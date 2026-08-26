import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";
import "../styles/tokens.css";
import "../styles/typography.css";
import "../styles/components.css";

const interTight = Inter_Tight({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-family", // Ghi đè vào biến CSS của mình
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shop Decor | Không gian sống đẹp hơn mỗi ngày",
  description: "Cửa hàng bán các sản phẩm trang trí nội thất, đồ Noel, đồ Tết và hoa khô cao cấp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={interTight.variable}>
      <body>{children}</body>
    </html>
  );
}
