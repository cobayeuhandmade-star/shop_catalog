import styles from "./AboutSection.module.css";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export default async function AboutSection() {
  const aboutImageSetting = await prisma.siteSetting.findUnique({
    where: { key: "ABOUT_IMAGE" },
  });
  
  const imageUrl = aboutImageSetting?.value || "https://images.unsplash.com/photo-1618220179428-22790b46a0eb?auto=format&fit=crop&q=80&w=800";

  return (
    <section id="about" className={styles.about}>
      <div className={styles.container}>
        <div className={styles.imageSingle}>
          <img 
            src={imageUrl} 
            alt="Không gian nội thất tinh tế" 
            className={styles.img}
          />
          <div className={styles.experienceBadge}>
            <span className={styles.expNumber}>10+</span>
            <span className={styles.expText}>Năm kinh<br/>nghiệm</span>
          </div>
        </div>

        {/* Cột phải: Nội dung */}
        <div className={styles.content}>
          <div className={styles.badge}>Về chúng tôi</div>
          <h2 className={styles.title}>Nghệ thuật trang trí nâng tầm không gian</h2>
          <p className={styles.description}>
            DECOR SHOP tự hào là địa chỉ tin cậy mang đến những sản phẩm trang trí nội thất tinh tế, 
            đáp ứng đa dạng phong cách từ hiện đại, tối giản đến cổ điển. Đặc biệt, chúng tôi cung cấp
            các bộ sưu tập độc quyền dành riêng cho dịp lễ hội như Giáng Sinh và Tết Nguyên Đán.
          </p>
          
          <div className={styles.features}>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>✨</div>
              <div>
                <div className={styles.featureTitle}>Chất lượng cao cấp</div>
                <div className={styles.featureDesc}>Sản phẩm được tuyển chọn kỹ lưỡng.</div>
              </div>
            </div>
            
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>🌿</div>
              <div>
                <div className={styles.featureTitle}>Thiết kế tinh tế</div>
                <div className={styles.featureDesc}>Đường nét thanh lịch, hợp xu hướng.</div>
              </div>
            </div>
            
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>🎁</div>
              <div>
                <div className={styles.featureTitle}>Đa dạng bộ sưu tập</div>
                <div className={styles.featureDesc}>Trang trí theo mọi mùa lễ hội.</div>
              </div>
            </div>
            
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>💖</div>
              <div>
                <div className={styles.featureTitle}>Tận tâm phục vụ</div>
                <div className={styles.featureDesc}>Tư vấn nhiệt tình, tối ưu không gian.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
