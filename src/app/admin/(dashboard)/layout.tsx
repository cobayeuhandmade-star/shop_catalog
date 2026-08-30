import { ReactNode } from "react";
import styles from "./layout.module.css";
import AdminNav from "./AdminNav";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin Panel | Decor Shop",
};

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  // Redirect nếu chưa đăng nhập (Server-side fallback)
  if (!session) {
    redirect("/admin/login");
  }
  return (
    <div className={styles.adminLayout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2 className={`text-heading-2 ${styles.sidebarTitle}`}>Admin Panel</h2>
        </div>
        <AdminNav />
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              {session?.user?.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <span>Xin chào, {session?.user?.name || "Admin"}!</span>
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
