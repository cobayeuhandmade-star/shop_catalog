import ProductsSection from "@/components/sections/ProductsSection";

export const metadata = {
  title: "Sản phẩm | Decor Shop",
  description: "Khám phá danh sách sản phẩm nội thất và đồ trang trí cao cấp tại Decor Shop.",
};

export default function ProductsPage() {
  return (
    <div className="text-body-color" style={{ paddingTop: "var(--space-band)" }}>
      <ProductsSection />
    </div>
  );
}
