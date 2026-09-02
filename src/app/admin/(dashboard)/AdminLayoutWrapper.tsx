"use client";

import { useState, ReactNode } from "react";
import styles from "./layout.module.css";
import AdminNav from "./AdminNav";

interface AdminLayoutWrapperProps {
  children: ReactNode;
  userName: string;
  userInitial: string;
}

export default function AdminLayoutWrapper({ 
  children, 
  userName, 
  userInitial 
}: AdminLayoutWrapperProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <div className={styles.adminLayout}>
      {/* Mobile Sidebar Overlay */}
      <div 
        className={`${styles.sidebarOverlay} ${isOpen ? styles.sidebarOverlayOpen : ''}`} 
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <h2 className={`text-heading-2 ${styles.sidebarTitle}`}>Admin Panel</h2>
        </div>
        <AdminNav onNavClick={closeSidebar} />
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Header */}
        <header className={styles.header}>
          <button 
            className={styles.menuToggleBtn} 
            onClick={toggleSidebar}
            aria-label="Toggle Menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              {userInitial}
            </div>
            <span>Xin chào, {userName}!</span>
          </div>
        </header>

        {/* Page Content */}
        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
}
