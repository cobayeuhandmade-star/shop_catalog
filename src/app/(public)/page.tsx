import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import GallerySection from "@/components/sections/GallerySection";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import ParallaxBanner from "@/components/sections/ParallaxBanner";

export default function Home() {
  return (
    <div className="text-body-color">
      <HeroSection />
      <AboutSection />
      <FeaturedProducts />
      <ParallaxBanner />
      <GallerySection />
    </div>
  );
}
