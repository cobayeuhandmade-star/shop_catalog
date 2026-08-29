"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";

const navLinks = [
  { href: "/", id: "hero", label: "Trang chủ" },
  { href: "/#about", id: "about", label: "Giới thiệu" },
  { href: "/san-pham", id: "products", label: "Sản phẩm" },
  { href: "/#contact", id: "contact", label: "Liên hệ" },
];

export default function Header() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // 1. Đồng bộ active state dựa trên URL hiện tại
  useEffect(() => {
    if (pathname === "/san-pham") {
      setActiveSection("products");
    } else if (pathname === "/") {
      setActiveSection("hero"); // Default for home
      // Check hash on load
      const hash = window.location.hash.replace("#", "");
      if (hash && navLinks.some(l => l.id === hash)) {
        setActiveSection(hash);
      }
    }
  }, [pathname]);

  // 2. Intersection Observer chỉ chạy trên trang chủ
  useEffect(() => {
    if (pathname !== "/") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -40% 0px",
      }
    );

    navLinks.forEach((link) => {
      if (link.id !== "products") { // Bỏ qua sản phẩm vì nó ở trang khác
        const element = document.getElementById(link.id);
        if (element) observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [pathname]);

  // Lắng nghe sự kiện scroll để thêm bóng đổ cho Header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, id: string) => {
    setIsMobileMenuOpen(false);

    if (href === "/san-pham") {
      setActiveSection("products");
      return;
    }

    if (pathname === "/") {
      if (href.startsWith("/#")) {
        e.preventDefault();
        setActiveSection(id);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          window.history.pushState(null, "", `/${href.substring(1)}`);
        }
      } else if (href === "/") {
        e.preventDefault();
        setActiveSection("hero");
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.history.pushState(null, "", "/");
      }
    } else {
      // Đang ở trang /san-pham và muốn về lại trang chủ có hash
      setActiveSection(id);
    }
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          DECOR<span className={styles.logoAccent}>SHOP</span>
        </Link>

        {/* Desktop Nav */}
        <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.mobileOpen : ""}`}>
          {navLinks.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              onClick={(e) => handleClick(e, link.href, link.id)}
              className={`${styles.navLink} ${
                activeSection === link.id ? styles.navLinkActive : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Toggle */}
        <button 
          className={styles.mobileMenuBtn}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          )}
        </button>
      </div>
    </header>
  );
}
