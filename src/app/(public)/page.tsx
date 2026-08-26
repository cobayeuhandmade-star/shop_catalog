import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import GallerySection from "@/components/sections/GallerySection";
import ProductsSection from "@/components/sections/ProductsSection";

export default function Home() {
  return (
    <div className="text-body-color">
      <HeroSection />
      <AboutSection />
      <GallerySection />
      <ProductsSection />
    </div>
  );
}
