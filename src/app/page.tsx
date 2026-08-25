import Hero from "@/components/home/Hero";
import Ticker from "@/components/home/Ticker";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Story from "@/components/home/Story";
import Process from "@/components/home/Process";
import ContactSection from "@/components/home/ContactSection";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let products = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select("*, images:product_images(*)")
      .eq("active", true)
      .limit(6);
    if (data) {
      products = data;
    }
  } catch (error) {
    console.error("Failed to load products from Supabase:", error);
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
