import styles from "./FeaturedProducts.module.css";
import ProductsGrid from "./ProductsGrid";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function FeaturedProducts() {
  // Lấy 4 sản phẩm mới nhất làm sản phẩm nổi bật
  const rawProducts = await prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: {
      images: {
        orderBy: { order: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  const products = rawProducts.map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    category: p.category,
    material: p.material,
    size: p.size,
    description: p.description,
    images: p.images.map(img => ({
      url: img.url,
      isMain: img.isMain,
    })),
  }));

  return (
    <section id="featured-products" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.topRow}>
          <div className={styles.titleArea}>
            <h2 className="text-heading-1">Bộ Sưu Tập Nổi Bật</h2>
            <p className="text-muted text-md" style={{ marginTop: 'var(--space-xs)' }}>
              Những thiết kế tinh tế nhất, được tuyển chọn dành riêng cho không gian sống của bạn.
            </p>
          </div>
          <div className={styles.linkArea}>
            <Link href="/san-pham" className="btn-outline" style={{ textDecoration: 'none' }}>
              Khám phá toàn bộ ➔
            </Link>
          </div>
        </div>

        <ProductsGrid initialProducts={products} showTabs={false} />
      </div>
    </section>
  );
}
