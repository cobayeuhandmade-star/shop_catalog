"use client";

import styles from "./ProductCard.module.css";
// import Image from "next/image";

export interface Product {
  id: number | string;
  name: string;
  price: number;
  category: string;
  material?: string | null;
  size?: string | null;
  description?: string | null;
  images?: { url: string; isMain: boolean }[];
}

export default function ProductCard({ 
  product, 
  onClick 
}: { 
  product: Product, 
  onClick?: () => void 
}) {
  // Format tiền Việt Nam
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const mainImage = product.images?.find(img => img.isMain)?.url || product.images?.[0]?.url;

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.imageWrapper}>
        {mainImage ? (
          <img src={mainImage} alt={product.name} className={styles.productImg} />
        ) : (
          <div className={styles.placeholderImage}>
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" width="60" height="60">
              <rect x="20" y="20" width="60" height="60" rx="4" />
              <path d="M20 60 L 50 30 L 80 60" />
              <circle cx="40" cy="40" r="5" />
            </svg>
          </div>
        )}
      </div>
      
      <div className={styles.body}>
        <div className={styles.category}>{product.category}</div>
        <h3 className={styles.title}>{product.name}</h3>
        
        <div className={styles.footer}>
          <div className={styles.price}>{formatPrice(product.price)}</div>
          
          <button className={styles.addToCartBtn} aria-label="Xem chi tiết">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
