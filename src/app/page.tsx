import Hero from "@/components/home/Hero";
import Ticker from "@/components/home/Ticker";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Story from "@/components/home/Story";
import Process from "@/components/home/Process";
import ContactSection from "@/components/home/ContactSection";
import { createClient } from "@/lib/supabase/server";
import { API_BASE_URL } from "@/lib/config";
export const dynamic = "force-dynamic";

export default async function HomePage() {
  let products = [];
  
  // 1. Fetch from live Supabase Cloud Database
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(*), images:product_images(*)")
      .eq("active", true)
      .eq("featured", true)
      .order("created_at", { ascending: false });

    if (!error && Array.isArray(data) && data.length > 0) {
      products = data;
    }
  } catch (err) {
    console.error("Supabase load error on HomePage:", err);
  }

  // 2. Fallback to API Gateway if Supabase returned nothing
  if (products.length === 0) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/featured`, { cache: "no-store" });
      if (res.ok) {
        products = await res.json();
      }
    } catch (error) {
      console.error("Failed to load products from API Gateway:", error);
    }
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
