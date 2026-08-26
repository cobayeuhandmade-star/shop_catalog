import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/products - Lấy danh sách sản phẩm
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const products = await prisma.product.findMany({
      where: {
        ...(category && category !== 'all' ? { category } : {}),
        isActive: true, // Chỉ lấy sản phẩm đang public
      },
      include: {
        images: {
          where: { isMain: true }, // Chỉ lấy ảnh chính cho thumbnail
          take: 1,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: 'Lỗi khi tải danh sách sản phẩm' }, { status: 500 });
  }
}

// POST /api/products - Tạo sản phẩm mới (Dành cho Admin)
export async function POST(request: Request) {
  try {
    // TODO: Phase 6 - Thêm check session NextAuth ở đây
    // const session = await auth();
    // if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { name, price, category, material, size, description, isActive, images } = body;

    if (!name || price === undefined || !category) {
      return NextResponse.json({ error: 'Thiếu thông tin bắt buộc' }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        price: Number(price),
        category,
        material: material || null,
        size: size || null,
        description: description || null,
        isActive: isActive !== undefined ? isActive : true,
        ...(images && images.length > 0 && {
          images: {
            create: images.map((img: any) => ({
              url: img.url,
              isMain: img.isMain || false,
              order: img.order || 0,
            })),
          },
        }),
      },
      include: { images: true },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: 'Lỗi khi tạo sản phẩm' }, { status: 500 });
  }
}
