import styles from "./ProductsSection.module.css";
import ProductsGrid from "./ProductsGrid";
import { prisma } from "@/lib/prisma";

export default async function ProductsSection() {
  // Fetch trực tiếp từ Database
  const rawProducts = await prisma.product.findMany({
    where: { isActive: true },
    include: {
      images: {
        orderBy: { order: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Chuyển đổi dữ liệu để phù hợp với component ProductsGrid
  // Đặc biệt, loại bỏ các trường thừa không cần thiết hoặc Date object có thể gây lỗi tuần tự hóa (serialization)
  const products = rawProducts.map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    category: p.category,
    subCategory: p.subCategory,
    material: p.material,
    size: p.size,
    description: p.description,
    images: p.images.map(img => ({
      url: img.url,
      isMain: img.isMain,
    })),
  }));

  return (
    <section id="products" className={styles.productsSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={`text-heading-1 ${styles.title}`}>Sản Phẩm Nổi Bật</h2>
          <p className="text-muted text-md">
            Khám phá những thiết kế mới nhất dành riêng cho không gian của bạn.
          </p>
        </div>

        {/* Tab/Filter Bar và Product Grid được quản lý bởi Client Component */}
        <ProductsGrid initialProducts={products} />
      </div>
    </section>
  );
}
