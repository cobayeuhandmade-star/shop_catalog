import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/products/[id] - Lấy chi tiết 1 sản phẩm
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID không hợp lệ' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { order: 'asc' }, // Sắp xếp ảnh theo thứ tự order
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Không tìm thấy sản phẩm' }, { status: 404 });
    }

    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: 'Lỗi khi tải thông tin sản phẩm' }, { status: 500 });
  }
}

// PUT /api/products/[id] - Cập nhật sản phẩm (Admin only)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // TODO: Phase 6 - Thêm check session NextAuth ở đây

    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    if (isNaN(id)) return NextResponse.json({ error: 'ID không hợp lệ' }, { status: 400 });

    const body = await request.json();
    const { name, price, category, material, size, description, isActive, images } = body;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(price !== undefined && { price: Number(price) }),
        ...(category && { category }),
        ...(material !== undefined && { material }),
        ...(size !== undefined && { size }),
        ...(description !== undefined && { description }),
        ...(isActive !== undefined && { isActive }),
        ...(images && {
          images: {
            deleteMany: {}, // Xóa hết ảnh cũ
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

    return NextResponse.json({ product: updatedProduct }, { status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: 'Lỗi khi cập nhật sản phẩm' }, { status: 500 });
  }
}

// DELETE /api/products/[id] - Xóa sản phẩm (Admin only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // TODO: Phase 6 - Thêm check session NextAuth ở đây

    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    if (isNaN(id)) return NextResponse.json({ error: 'ID không hợp lệ' }, { status: 400 });

    // Prisma Cascade Delete sẽ tự động xóa các ProductImage liên quan
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Đã xóa sản phẩm' }, { status: 200 });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: 'Lỗi khi xóa sản phẩm' }, { status: 500 });
  }
}
