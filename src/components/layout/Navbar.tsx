"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { logout } from "@/actions/auth";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<{ email?: string; first_name?: string } | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Fetch active Supabase user session
    const supabase = createClient();

    const updateUserState = (userObj: any) => {
      if (userObj) {
        const name =
          userObj.user_metadata?.first_name ||
          userObj.user_metadata?.full_name ||
          userObj.email?.split("@")[0];
        // Capitalize first letter
        const formattedName = name ? name.charAt(0).toUpperCase() + name.slice(1) : "";
        setUser({
          email: userObj.email,
          first_name: formattedName,
        });
      } else {
        setUser(null);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      updateUserState(session?.user);
    });

    supabase.auth.getUser().then(({ data: { user } }) => {
      updateUserState(user);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      updateUserState(session?.user);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      authListener.subscription.unsubscribe();
    };
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
        className={`md:flex items-center gap-6 ${
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

        {user ? (
          <div className="flex items-center gap-3 border-l border-ink/20 pl-4">
            <span className="font-mono text-xs font-bold tracking-wider px-3.5 py-1.5 bg-ink text-paper border border-ink flex items-center gap-1.5 shadow-sm">
              <span>👋 Hello, {user.first_name}</span>
            </span>
            <form action={logout}>
              <button
                type="submit"
                title="Sign Out"
                className="font-mono text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 border border-ink text-ink hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
              >
                Sign Out
              </button>
            </form>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="font-mono text-[10px] font-bold tracking-widest uppercase px-3 py-1 text-ink hover:underline"
              onClick={() => setIsOpen(false)}
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="font-mono text-[10px] font-bold tracking-widest uppercase px-3 py-1 border border-ink bg-ink text-paper hover:bg-paper hover:text-ink transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Register
            </Link>
          </div>
        )}
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
