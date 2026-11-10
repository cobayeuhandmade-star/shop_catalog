import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

const accountId = process.env.R2_ACCOUNT_ID;
const bucket = process.env.R2_BUCKET;
const publicUrl = (process.env.R2_PUBLIC_URL || '').replace(/\/+$/, '');

export const storageConfigured = Boolean(
  accountId && bucket && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY
);

let client: S3Client | null = null;

function getClient(): S3Client {
  if (!storageConfigured) {
    throw new Error(
      'Cloudflare R2 chưa được cấu hình: thiếu R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY / R2_BUCKET'
    );
  }
  if (!client) {
    client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
      },
    });
  }
  return client;
}

/** Tạo key duy nhất cho ảnh mới upload từ admin: uploads/2026/11/<uuid>.webp */
export function makeUploadKey(ext = 'webp'): string {
  const now = new Date();
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
  return `uploads/${yyyy}/${mm}/${randomUUID()}.${ext}`;
}

/** Upload một object lên R2. Key là đường dẫn trong bucket. */
export async function putObject(key: string, body: Buffer, contentType: string): Promise<void> {
  await getClient().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    })
  );
}

/** Xoá object khỏi R2. Không lỗi nếu object không tồn tại. */
export async function deleteObject(key: string): Promise<void> {
  await getClient().send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}

export async function objectExists(key: string): Promise<boolean> {
  try {
    await getClient().send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return true;
  } catch {
    return false;
  }
}

/** URL công khai của object (qua custom domain). */
export function objectUrl(key: string): string {
  if (!publicUrl) {
    throw new Error('Thiếu R2_PUBLIC_URL (ví dụ https://img.cobayeuhandmade.com)');
  }
  return `${publicUrl}/${key.replace(/^\/+/, '')}`;
}

/** Chuyển URL công khai ngược lại key, dùng cho script migration. */
export function keyFromUrl(url: string): string | null {
  if (!publicUrl || !url.startsWith(publicUrl + '/')) return null;
  return url.slice(publicUrl.length + 1);
}
