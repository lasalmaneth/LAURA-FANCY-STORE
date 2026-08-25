import type { Metadata } from "next";
import { Bebas_Neue, Space_Mono, Special_Elite } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import NoiseOverlay from "@/components/layout/NoiseOverlay";
import CustomCursor from "@/components/layout/CustomCursor";
import ScrollObserver from "@/components/layout/ScrollObserver";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
});

const specialElite = Special_Elite({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-hand",
});

export const metadata: Metadata = {
  title: "Laura Fancy Store — Handcrafted Boutique",
  description: "Simple objects. Honest materials. Made by hand. No excess. Only function.",
  keywords: ["handcrafted", "furniture", "boutique", "oak chair", "dining table", "craftsmanship"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bebas.variable} ${spaceMono.variable} ${specialElite.variable}`}>
      <body className="antialiased bg-paper text-ink selection:bg-ink selection:text-paper min-h-screen flex flex-col">
        <NoiseOverlay />
        <CustomCursor />
        <ScrollObserver />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
