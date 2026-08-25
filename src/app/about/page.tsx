import Story from "@/components/home/Story";
import Process from "@/components/home/Process";
import Features from "@/components/home/Features";

export const metadata = {
  title: "About Our Store — Laura Fancy Store",
  description: "Learn about Laura Fancy Store, your trusted online shopping store for everyday customer needs, fast home delivery, and quality guarantee.",
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
