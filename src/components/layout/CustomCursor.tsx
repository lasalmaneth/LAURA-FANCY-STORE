"use client";

import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const dot = document.createElement("div");
    dot.id = "cursor-dot";
    Object.assign(dot.style, {
      position: "fixed",
      width: "6px",
      height: "6px",
      background: "#0a0a0a",
      borderRadius: "50%",
      pointerEvents: "none",
      zIndex: "99999",
      transition: "transform 0.12s ease",
      mixBlendMode: "difference",
      top: "-10px",
      left: "-10px",
    });
    document.body.appendChild(dot);

    const handleMouseMove = (e: MouseEvent) => {
      dot.style.left = `${e.clientX - 3}px`;
      dot.style.top = `${e.clientY - 3}px`;
    };

    const interactives = "a, button, .product-card, .collage-card, .feature-item";
    const handleMouseEnter = () => {
      dot.style.transform = "scale(4)";
    };
    const handleMouseLeave = () => {
      dot.style.transform = "scale(1)";
    };

    document.addEventListener("mousemove", handleMouseMove);

    const elements = document.querySelectorAll(interactives);
    elements.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      elements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
      if (document.body.contains(dot)) {
        document.body.removeChild(dot);
      }
    };
  }, []);

  if (!mounted) return null;
  return null;
}
