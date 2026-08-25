"use client";

import { useEffect } from "react";

const REVEAL_SELECTORS = [
  ".hero__left",
  ".hero__right",
  ".product-card",
  ".story__left",
  ".story__right",
  ".process-step",
  ".feature-item",
  ".contact__left",
  ".contact__right",
];

export default function ScrollObserver() {
  useEffect(() => {
    REVEAL_SELECTORS.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el, i) => {
        el.classList.add("reveal");
        if (i === 1) el.classList.add("reveal-delay-1");
        if (i === 2) el.classList.add("reveal-delay-2");
        if (i === 3) el.classList.add("reveal-delay-3");
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    const timer = setTimeout(() => {
      document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return null;
}
