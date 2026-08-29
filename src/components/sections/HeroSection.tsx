"use client";

import styles from "./HeroSection.module.css";
import Link from "next/link";

// Botanical Leaf SVG (Left)
const BotanicalLeafLeft = () => (
  <svg viewBox="0 0 200 400" fill="currentColor" className={styles.decorationLeft} xmlns="http://www.w3.org/2000/svg">
    <path d="M-50,0 C20,100 150,150 180,300 C180,300 120,200 0,150 Z" />
    <path d="M20,50 C80,120 180,100 200,200 C200,200 150,150 50,150 Z" />
    <path d="M0,100 C50,150 120,180 150,280 C150,280 90,200 -20,200 Z" />
  </svg>
);

// Botanical Branch SVG (Right)
const BotanicalBranchRight = () => (
  <svg viewBox="0 0 200 400" fill="currentColor" className={styles.decorationRight} xmlns="http://www.w3.org/2000/svg">
    <path d="M250,400 C180,300 50,250 20,100 C20,100 80,200 200,250 Z" />
    <path d="M180,350 C120,280 20,300 0,200 C0,200 50,250 150,250 Z" />
    <path d="M200,300 C150,250 80,220 50,120 C50,120 110,200 220,200 Z" />
  </svg>
);

export default function HeroSection() {

  return (
    <section id="hero" className={styles.hero}>
      <BotanicalLeafLeft />
      
      <div className={styles.content}>
        <div className={styles.badge}>Premium Decor</div>
        
        <h1 className={`text-display ${styles.title}`}>
          Không gian sống đẹp hơn mỗi ngày
          <span>Mang thiên nhiên và sự tinh tế vào ngôi nhà của bạn</span>
        </h1>
        
        <p className={styles.description}>
          Khám phá bộ sưu tập nội thất, phụ kiện trang trí theo mùa (Noel, Tết) và các thiết kế hoa khô nghệ thuật được tuyển chọn kỹ lưỡng.
        </p>
        
        <div className={styles.actions}>
          <Link href="/san-pham" className="btn btn-primary">
            Khám phá sản phẩm
          </Link>
          <Link href="#about" className="btn btn-outline">
            Về chúng tôi
          </Link>
        </div>
      </div>

      <BotanicalBranchRight />
    </section>
  );
}
