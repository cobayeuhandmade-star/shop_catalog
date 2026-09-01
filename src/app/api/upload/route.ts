import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { auth } from "@/auth";

// Configure Cloudinary (it automatically picks up CLOUDINARY_URL from env)
cloudinary.config({
  secure: true,
});

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

    // Upload to Cloudinary using a stream
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'shop_catalog' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      
      uploadStream.end(buffer);
    });

    const fileUrl = (result as any).secure_url;

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
