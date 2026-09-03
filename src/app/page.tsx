import Hero from "@/components/home/Hero";
import Ticker from "@/components/home/Ticker";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Story from "@/components/home/Story";
import Process from "@/components/home/Process";
import ContactSection from "@/components/home/ContactSection";
export const dynamic = "force-dynamic";

export default async function HomePage() {
  let products = [];
  try {
    const res = await fetch("http://localhost:8080/api/products/featured", { cache: "no-store" });
    if (res.ok) {
      products = await res.json();
    }
  } catch (error) {
    console.error("Failed to load products from API Gateway:", error);
  }

  return (
    <>
      <Ticker />
      <Hero />
      <FeaturedProducts products={products} />
      <Story />
      <Process />
      <ContactSection />
    </>
  );
}
