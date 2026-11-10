/**
 * Test end-to-end: tạo ảnh mẫu -> nén WebP (sharp) -> upload R2 -> tải lại qua URL công khai.
 *
 * Chạy: node scripts/test-upload.js
 */

const fs = require('fs');
const path = require('path');

function readEnv(file) {
  const out = {};
  if (!fs.existsSync(file)) return out;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)$/);
    if (m) out[m[1]] = m[2].trim().replace(/^['"]|['"]$/g, '');
  }
  return out;
}

const root = path.resolve(__dirname, '..');
const env = { ...readEnv(path.join(root, '.env')), ...readEnv(path.join(root, '.env.local')) };
for (const k of Object.keys(env)) if (!process.env[k]) process.env[k] = env[k];

const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const sharp = require('sharp');

const publicUrl = (process.env.R2_PUBLIC_URL || '').replace(/\/+$/, '');
const bucket = process.env.R2_BUCKET;

const client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const key = `_test/upload-${Date.now()}.webp`;

(async () => {
  // Ảnh mẫu 1600x1200 có gradient + chữ
  const svg = Buffer.from(`<svg width="1600" height="1200" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1e3a8a"/><stop offset="100%" stop-color="#0ea5e9"/>
    </linearGradient></defs>
    <rect width="1600" height="1200" fill="url(#g)"/>
    <text x="800" y="600" font-size="90" fill="#ffffff" text-anchor="middle" font-family="sans-serif">R2 TEST</text>
  </svg>`);

  const original = await sharp(svg).jpeg({ quality: 95 }).toBuffer();
  process.stdout.write(`1/4 Nén ảnh (${(original.length / 1024).toFixed(0)}KB JPEG) ... `);
  const webp = await sharp(original).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
  console.log(`OK -> ${(webp.length / 1024).toFixed(0)}KB WebP`);

  process.stdout.write('2/4 Upload lên R2 ............ ');
  const t0 = Date.now();
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: webp,
      ContentType: 'image/webp',
      CacheControl: 'public, max-age=31536000, immutable',
    })
  );
  console.log(`OK (${Date.now() - t0}ms)`);

  const url = `${publicUrl}/${key}`;
  process.stdout.write('3/4 Tải lại qua URL công khai . ');
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} khi tải ${url}`);
  const bytes = Buffer.from(await res.arrayBuffer());
  if (bytes.length !== webp.length) throw new Error('Dung lượng tải về không khớp');
  console.log(`OK (${(bytes.length / 1024).toFixed(0)}KB)`);

  process.stdout.write('4/4 Dọn file test ............ ');
  await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
  console.log('OK');

  console.log('\n✅ Pipeline nén + upload + CDN hoạt động.');
  console.log('   URL mẫu (đã xoá):', url);
})().catch((e) => {
  console.error('\n❌ LỖI:', e.message);
  process.exit(1);
});
