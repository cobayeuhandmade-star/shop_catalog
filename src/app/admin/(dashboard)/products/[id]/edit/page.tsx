import ProductForm from "@/components/admin/ProductForm";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Sửa sản phẩm | Admin",
};

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);
  
  if (isNaN(id)) {
    notFound();
  }

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <div>
      <div style={{ marginBottom: "var(--space-xl)" }}>
        <Link href="/admin/products" className="text-muted" style={{ textDecoration: "none", fontSize: "var(--font-size-sm)", display: "inline-block", marginBottom: "var(--space-md)" }}>
          &larr; Quay lại danh sách
        </Link>
        <h1 className="text-heading-2 text-primary">Cập nhật sản phẩm</h1>
        <p className="text-muted">Chỉnh sửa thông tin cho sản phẩm #{product.id}</p>
      </div>

      <ProductForm initialData={product} isEditing={true} />
    </div>
  );
}
