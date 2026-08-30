import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { auth } from "@/auth";

// POST /api/upload - Upload ảnh sản phẩm (Admin only)
export async function POST(request: Request) {
  try {
    // Kích hoạt check session
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Không tìm thấy file' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File phải là hình ảnh' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Tạo tên file độc nhất
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = file.name.split('.').pop();
    const filename = `img-${uniqueSuffix}.${extension}`;

    // Đảm bảo thư mục upload tồn tại
    const uploadDir = join(process.cwd(), 'public/uploads');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Lưu file
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    const fileUrl = `/uploads/${filename}`;

    return NextResponse.json({ 
      success: true, 
      url: fileUrl,
      message: 'Upload thành công' 
    }, { status: 201 });

  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: 'Lỗi khi upload file' }, { status: 500 });
  }
}
