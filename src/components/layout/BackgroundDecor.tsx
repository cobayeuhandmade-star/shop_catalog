"use client";

import { useEffect, useState } from "react";
import styles from "./BackgroundDecor.module.css";

export default function BackgroundDecor() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    // Thêm event listener
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Khởi tạo giá trị ban đầu
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Tính toán vị trí parallax (chậm hơn cuộn thật)
  // Các shape ở gần thì trôi nhanh hơn, ở xa thì trôi chậm hơn
  const translateY1 = scrollY * 0.15;
  const translateY2 = scrollY * -0.1;
  const translateY3 = scrollY * 0.2;
  const translateY4 = scrollY * -0.15;

  return (
    <div className={styles.decorContainer}>
      {/* Lớp màng Texture giấy/nhám */}
      <div className={styles.textureOverlay}></div>

      {/* SHAPE 1: Lá Monstera bên trái trên cùng */}
      <div 
        className={`${styles.shape} ${styles.shape1}`}
        style={{ transform: `translateY(${translateY1}px)` }}
      >
        <svg width="120" height="150" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="0.5" strokeOpacity="0.1">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" fill="var(--color-primary)" fillOpacity="0.03" />
          <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" />
        </svg>
      </div>

      {/* SHAPE 2: Khối hình học bo tròn bên phải */}
      <div 
        className={`${styles.shape} ${styles.shape2}`}
        style={{ transform: `translateY(${translateY2}px)` }}
      >
        <svg width="180" height="180" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink)" strokeWidth="0.5" strokeOpacity="0.05">
          <rect x="3" y="3" width="18" height="18" rx="4" fill="var(--color-ink)" fillOpacity="0.02" />
          <circle cx="12" cy="12" r="5" />
        </svg>
      </div>

      {/* SHAPE 3: Lá hoặc cành cây bên trái dưới */}
      <div 
        className={`${styles.shape} ${styles.shape3}`}
        style={{ transform: `translateY(${translateY3}px) rotate(45deg)` }}
      >
        <svg width="150" height="200" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="0.5" strokeOpacity="0.1">
          <path d="M12 22V2M12 2C8 6 4 10 4 14c0 4.418 3.582 8 8 8s8-3.582 8-8c0-4-4-8-8-12z" fill="var(--color-primary)" fillOpacity="0.03"/>
        </svg>
      </div>

      {/* SHAPE 4: Bình gốm trừu tượng bên phải dưới */}
      <div 
        className={`${styles.shape} ${styles.shape4}`}
        style={{ transform: `translateY(${translateY4}px)` }}
      >
        <svg width="140" height="160" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink)" strokeWidth="0.5" strokeOpacity="0.05">
          <path d="M8 2h8v4a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-8a4 4 0 0 1 4-4V2z" fill="var(--color-ink)" fillOpacity="0.02"/>
          <line x1="8" y1="6" x2="16" y2="6"/>
          <line x1="4" y1="14" x2="20" y2="14"/>
        </svg>
      </div>
    </div>
  );
}
