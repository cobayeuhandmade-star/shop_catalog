import { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminLayoutWrapper from "./AdminLayoutWrapper";

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

  const userName = session?.user?.name || "Admin";
  const userInitial = session?.user?.name?.charAt(0).toUpperCase() || "A";

  return (
    <AdminLayoutWrapper userName={userName} userInitial={userInitial}>
      {children}
    </AdminLayoutWrapper>
  );
}
