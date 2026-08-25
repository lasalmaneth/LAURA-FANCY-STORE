"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between transition-all duration-300 border-b border-ink bg-paper/90 backdrop-blur-md ${
        scrolled ? "py-3 px-6 md:px-12" : "py-5 px-6 md:px-12"
      }`}
    >
      <div className="flex items-center">
        <Link href="/" className="flex items-center gap-3 text-none group">
          <Image
            src="/assets/images/logo.png"
            alt="Laura Fancy Store"
            width={160}
            height={56}
            className="h-11 sm:h-13 w-auto object-contain block"
            priority
          />
          <span className="font-display text-xl sm:text-2xl tracking-wider font-bold text-ink uppercase group-hover:opacity-80 transition-opacity">
            LAURA FANCY STORE
          </span>
        </Link>
      </div>

      <nav
        className={`md:flex items-center gap-9 ${
          isOpen
            ? "flex flex-col fixed top-[73px] left-0 right-0 bg-paper border-b border-ink p-6 gap-5 shadow-lg"
            : "hidden md:flex"
        }`}
        id="nav-links"
      >
        <Link
          href="/products"
          className="font-mono text-xs font-bold tracking-widest uppercase relative py-1 hover:after:scale-x-100 after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-ink after:scale-x-0 after:transition-transform"
          onClick={() => setIsOpen(false)}
        >
          Catalog
        </Link>
        <Link
          href="/#story"
          className="font-mono text-xs font-bold tracking-widest uppercase relative py-1 hover:after:scale-x-100 after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-ink after:scale-x-0 after:transition-transform"
          onClick={() => setIsOpen(false)}
        >
          Story
        </Link>
        <Link
          href="/#process"
          className="font-mono text-xs font-bold tracking-widest uppercase relative py-1 hover:after:scale-x-100 after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-ink after:scale-x-0 after:transition-transform"
          onClick={() => setIsOpen(false)}
        >
          Process
        </Link>
        <Link
          href="/#contact"
          className="font-mono text-xs font-bold tracking-widest uppercase relative py-1 hover:after:scale-x-100 after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-ink after:scale-x-0 after:transition-transform"
          onClick={() => setIsOpen(false)}
        >
          Contact
        </Link>
        <Link
          href="/admin"
          className="font-mono text-[10px] font-bold tracking-widest uppercase px-3 py-1 border border-ink hover:bg-ink hover:text-paper transition-colors"
          onClick={() => setIsOpen(false)}
        >
          Admin Login
        </Link>
      </nav>

      <button
        className="md:hidden flex flex-col gap-1.5 p-1 bg-none border-none cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <span className={`block w-5 h-0.5 bg-ink transition-transform ${isOpen ? "rotate-45 translate-y-2" : ""}`} />
        <span className={`block w-5 h-0.5 bg-ink transition-opacity ${isOpen ? "opacity-0" : ""}`} />
        <span className={`block w-5 h-0.5 bg-ink transition-transform ${isOpen ? "-rotate-45 -translate-y-2" : ""}`} />
      </button>
    </header>
  );
}
