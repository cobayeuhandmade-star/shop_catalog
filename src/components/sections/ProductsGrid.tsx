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

export default function ProductsGrid({ 
  initialProducts,
  showTabs = true
}: { 
  initialProducts: Product[];
  showTabs?: boolean;
}) {
  const [activeCategory, setActiveCategory] = useState("furniture");
  const [activeSubCategory, setActiveSubCategory] = useState("all");
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
    setActiveSubCategory("all");
    // Cập nhật URL hash để không bị mất context khi share link
    window.history.pushState(null, "", `#${categoryId}`);
  };

  const activeLabel = categories.find(c => c.id === activeCategory)?.label || "Nội thất";
  
  const filteredProducts = showTabs 
    ? initialProducts.filter((product) => {
        if (product.category !== activeLabel) return false;
        if (activeCategory === "furniture" && activeSubCategory !== "all") {
          return product.subCategory === activeSubCategory;
        }
        return true;
      })
    : initialProducts;

  const subCategories = ["Bàn", "Ghế", "Tủ", "Kệ", "Combo", "Khác"];

  return (
    <>
      {showTabs && (
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
      )}

      {showTabs && activeCategory === "furniture" && (
        <div className={styles.tabs} style={{ marginTop: '1rem', gap: '10px' }}>
          <button
            className={`${styles.tab} ${activeSubCategory === "all" ? styles.tabActive : ""}`}
            style={{ padding: '6px 12px', fontSize: '0.9rem' }}
            onClick={() => setActiveSubCategory("all")}
          >
            Tất cả
          </button>
          {subCategories.map((sub) => (
            <button
              key={sub}
              className={`${styles.tab} ${activeSubCategory === sub ? styles.tabActive : ""}`}
              style={{ padding: '6px 12px', fontSize: '0.9rem' }}
              onClick={() => setActiveSubCategory(sub)}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

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
