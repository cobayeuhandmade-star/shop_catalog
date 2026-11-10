import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { MAX_UPLOAD_BYTES, optimizeImage } from '@/lib/image';
import { makeUploadKey, objectUrl, putObject, storageConfigured } from '@/lib/storage';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    // Kích hoạt check session
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (!storageConfigured) {
      console.error('Upload thất bại: chưa cấu hình Cloudflare R2');
      return NextResponse.json(
        { error: 'Chưa cấu hình nơi lưu ảnh (Cloudflare R2)' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Không tìm thấy file' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File phải là hình ảnh' }, { status: 400 });
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { error: 'Ảnh quá lớn (tối đa 10MB). Vui lòng chọn ảnh nhỏ hơn.' },
        { status: 413 }
      );
    }

    const input = Buffer.from(await file.arrayBuffer());

    let optimized: Buffer;
    try {
      optimized = await optimizeImage(input);
    } catch (err) {
      console.error('Không xử lý được ảnh:', err);
      return NextResponse.json({ error: 'Không đọc được file ảnh' }, { status: 400 });
    }

    const key = makeUploadKey('webp');
    await putObject(key, optimized, 'image/webp');

    return NextResponse.json(
      {
        success: true,
        url: objectUrl(key),
        message: 'Upload thành công',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Lỗi khi upload file' }, { status: 500 });
  }
}
