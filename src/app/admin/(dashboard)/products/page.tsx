import { prisma } from "@/lib/prisma";
import Link from "next/link";
import styles from "./page.module.css";
import DeleteProductBtn from "./DeleteProductBtn";

export const metadata = {
  title: "Quản lý sản phẩm | Admin",
};

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className="text-heading-2 text-primary">Danh sách sản phẩm</h1>
          <p className="text-muted">Quản lý các mặt hàng trong cửa hàng</p>
        </div>
        <Link href="/admin/products/new" className="btn btn-primary">
          + Thêm sản phẩm mới
        </Link>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên sản phẩm</th>
              <th>Danh mục</th>
              <th>Giá bán</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>#{product.id}</td>
                <td className={styles.productName}>{product.name}</td>
                <td>
                  <span className={styles.categoryBadge}>{product.category}</span>
                </td>
                <td className={styles.price}>{formatPrice(product.price)}</td>
                <td>
                  {product.isActive ? (
                    <span className={styles.statusActive}>Hiển thị</span>
                  ) : (
                    <span className={styles.statusInactive}>Đã ẩn</span>
                  )}
                </td>
                <td>
                  <div className={styles.actions}>
                    <Link href={`/admin/products/${product.id}/edit`} className={styles.editBtn}>
                      Sửa
                    </Link>
                    <DeleteProductBtn id={product.id} productName={product.name} />
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className={styles.emptyState}>
                  Chưa có sản phẩm nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
