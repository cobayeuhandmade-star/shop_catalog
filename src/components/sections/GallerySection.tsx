import styles from "./GallerySection.module.css";
import { prisma } from "@/lib/prisma";
import GalleryClient from "./GalleryClient";

export default async function GallerySection() {
  // Fetch từ DB
  let dbGalleryItems = await prisma.galleryImage.findMany({
    orderBy: { order: "asc" },
  });

  // Nếu DB trống, hiển thị tạm dữ liệu tĩnh
  if (dbGalleryItems.length === 0) {
    dbGalleryItems = [
      { id: 1, title: "Không gian phòng khách", url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=600", order: 0, createdAt: new Date() },
      { id: 2, title: "Decor bàn làm việc", url: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=600", order: 1, createdAt: new Date() },
      { id: 3, title: "Góc chill cuối tuần", url: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&q=80&w=600", order: 2, createdAt: new Date() },
      { id: 4, title: "Hoa khô nghệ thuật", url: "https://images.unsplash.com/photo-1528659553880-9759247eb9f6?auto=format&fit=crop&q=80&w=600", order: 3, createdAt: new Date() },
      { id: 5, title: "Thiết kế hiện đại", url: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=600", order: 4, createdAt: new Date() },
      { id: 6, title: "Bình gốm sứ", url: "https://images.unsplash.com/photo-1610312278520-bcc893a3ff1d?auto=format&fit=crop&q=80&w=600", order: 5, createdAt: new Date() },
      { id: 7, title: "Trang trí dịp lễ", url: "https://images.unsplash.com/photo-1512330752119-a1b4142fbf96?auto=format&fit=crop&q=80&w=600", order: 6, createdAt: new Date() },
      { id: 8, title: "Nội thất tối giản", url: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=600", order: 7, createdAt: new Date() },
    ];
  }

  return (
    <section id="hinh-anh" className={styles.gallerySection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={`text-heading-1 ${styles.title}`}>Hình Ảnh Thực Tế</h2>
          <p className={styles.subtitle}>
            Khám phá những không gian đẹp được tô điểm bởi các sản phẩm trang trí từ Decor Shop.
          </p>
        </div>

        {/* Chuyển phần tương tác UI sang Client Component */}
        <GalleryClient galleryItems={dbGalleryItems} />
      </div>
    </section>
  );
}
