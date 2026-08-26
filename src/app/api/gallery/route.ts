import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Lấy danh sách ảnh gallery
export async function GET() {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(images);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

// Thêm ảnh mới vào gallery
export async function POST(request: Request) {
  try {
    const { url, title } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "Thiếu URL ảnh" }, { status: 400 });
    }

    // Đẩy ảnh mới vào cuối danh sách
    const count = await prisma.galleryImage.count();
    const image = await prisma.galleryImage.create({
      data: {
        url,
        title,
        order: count,
      },
    });

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
