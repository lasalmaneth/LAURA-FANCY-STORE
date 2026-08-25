import Story from "@/components/home/Story";
import Process from "@/components/home/Process";
import Features from "@/components/home/Features";

export const metadata = {
  title: "About Our Craft — Laura Fancy Store",
  description: "Learn about our handcrafted philosophy, local timber sourcing, and traditional workshop process.",
};

export default function AboutPage() {
  return (
    <div className="pt-20">
      <Story />
      <Process />
      <Features />
    </div>
  );
}
