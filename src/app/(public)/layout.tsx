import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BackgroundDecor from "@/components/layout/BackgroundDecor";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <BackgroundDecor />
      <Header />
      <main style={{ minHeight: "calc(100vh - 80px)" }}>
        {children}
      </main>
      <Footer />
    </>
  );
}
