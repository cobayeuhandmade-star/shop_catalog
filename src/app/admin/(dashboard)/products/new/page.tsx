import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";

export const metadata = {
  title: "Thêm sản phẩm mới | Admin",
};

export default function NewProductPage() {
  return (
    <div>
      <div style={{ marginBottom: "var(--space-xl)" }}>
        <Link href="/admin/products" className="text-muted" style={{ textDecoration: "none", fontSize: "var(--font-size-sm)", display: "inline-block", marginBottom: "var(--space-md)" }}>
          &larr; Quay lại danh sách
        </Link>
        <h1 className="text-heading-2 text-primary">Thêm sản phẩm mới</h1>
        <p className="text-muted">Điền thông tin bên dưới để tạo sản phẩm mới trên hệ thống.</p>
      </div>

      <ProductForm />
    </div>
  );
}
