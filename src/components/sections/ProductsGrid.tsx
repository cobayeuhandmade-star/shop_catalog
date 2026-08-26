"use client";

import { useState, useEffect } from "react";
import styles from "./ProductsSection.module.css";
import ProductCard, { Product } from "./ProductCard";
import ProductModal from "./ProductModal";

const categories = [
  { id: "furniture", label: "Nội thất" },
  { id: "christmas", label: "Noel" },
  { id: "lunar-new-year", label: "Tết" },
  { id: "dried-flowers", label: "Hoa khô" },
];

export default function ProductsGrid({ initialProducts }: { initialProducts: Product[] }) {
  const [activeCategory, setActiveCategory] = useState("furniture");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Xử lý khi URL có chứa ID (do Header cuộn xuống)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (categories.some(c => c.id === hash)) {
        setActiveCategory(hash);
      }
    };

    // Chạy một lần khi component mount
    handleHashChange();

    // Lắng nghe sự thay đổi hash
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleTabClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    // Cập nhật URL hash để không bị mất context khi share link
    window.history.pushState(null, "", `#${categoryId}`);
  };

  const activeLabel = categories.find(c => c.id === activeCategory)?.label || "Nội thất";
  
  const filteredProducts = initialProducts.filter(
    (product) => product.category === activeLabel
  );

  return (
    <>
      <div className={styles.tabs}>
        {categories.map((category) => (
          <button
            key={category.id}
            id={category.id} // Gắn ID để Header có thể scroll tới và IntersectionObserver có thể nhận diện
            className={`${styles.tab} ${
              activeCategory === category.id ? styles.tabActive : ""
            }`}
            onClick={() => handleTabClick(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div key={activeCategory} className={styles.grid} style={{ marginTop: "var(--space-xl)" }}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onClick={() => setSelectedProduct(product)}
            />
          ))
        ) : (
          <div className={styles.emptyState} style={{ gridColumn: "1 / -1" }}>
            <p>Hiện chưa có sản phẩm nào trong danh mục này.</p>
          </div>
        )}
      </div>

      {/* Modal chi tiết sản phẩm */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </>
  );
}
