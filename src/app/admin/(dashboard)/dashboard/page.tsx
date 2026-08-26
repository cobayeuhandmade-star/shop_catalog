import { prisma } from "@/lib/prisma";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata = {
  title: "Dashboard | Decor Shop",
};

export default async function DashboardPage() {
  // Fetch thống kê
  const totalProducts = await prisma.product.count();
  const activeProducts = await prisma.product.count({ where: { isActive: true } });
  const categoryCounts = await prisma.product.groupBy({
    by: ['category'],
    _count: {
      category: true,
    },
  });

  return (
    <div>
      <div className={styles.header}>
        <h1 className="text-heading-2 text-primary">Tổng quan</h1>
        <p className="text-muted">Theo dõi hoạt động cửa hàng của bạn</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>Tổng sản phẩm</div>
          <div className={styles.statValue}>{totalProducts}</div>
          <div className={styles.statDesc}>
            <span style={{ color: "var(--color-primary)" }}>{activeProducts}</span> đang hiển thị
          </div>
        </div>

        {categoryCounts.map((cat) => (
          <div key={cat.category} className={styles.statCard}>
            <div className={styles.statTitle}>Danh mục: {cat.category}</div>
            <div className={styles.statValue}>{cat._count.category}</div>
            <div className={styles.statDesc}>Sản phẩm</div>
          </div>
        ))}
      </div>

      <div className={styles.actionsGrid}>
        <div className={styles.actionCard}>
          <h3 className="text-heading-3" style={{ marginBottom: "var(--space-sm)" }}>Quản lý sản phẩm</h3>
          <p className="text-muted" style={{ marginBottom: "var(--space-lg)" }}>
            Thêm mới, chỉnh sửa thông tin hoặc xóa sản phẩm khỏi cửa hàng.
          </p>
          <Link href="/admin/products" className="btn btn-primary" style={{ display: "inline-block" }}>
            Đến trang quản lý &rarr;
          </Link>
        </div>
        
        <div className={styles.actionCard}>
          <h3 className="text-heading-3" style={{ marginBottom: "var(--space-sm)" }}>Cấu hình cửa hàng</h3>
          <p className="text-muted" style={{ marginBottom: "var(--space-lg)" }}>
            Cập nhật thông tin liên hệ, banner và các thiết lập khác. (Đang phát triển)
          </p>
          <button className="btn btn-outline" disabled>
            Sắp ra mắt
          </button>
        </div>
      </div>
    </div>
  );
}
