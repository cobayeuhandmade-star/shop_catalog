import { prisma } from "@/lib/prisma";
import SettingsClient from "./SettingsClient";
import styles from "./page.module.css";

export const metadata = {
  title: "Cài đặt Giao diện | Admin",
};

export default async function SettingsPage() {
  // Lấy cấu hình About Image
  const aboutImageSetting = await prisma.siteSetting.findUnique({
    where: { key: "ABOUT_IMAGE" },
  });

  // Lấy danh sách ảnh Gallery
  const galleryImages = await prisma.galleryImage.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className="text-heading-2 text-primary">Cài đặt Giao diện</h1>
          <p className="text-muted">Quản lý hình ảnh và nội dung trên trang chủ</p>
        </div>
      </div>

      <SettingsClient 
        initialAboutImage={aboutImageSetting?.value || "https://images.unsplash.com/photo-1618220179428-22790b46a0eb?auto=format&fit=crop&q=80&w=800"} 
        initialGallery={galleryImages}
      />
    </div>
  );
}
