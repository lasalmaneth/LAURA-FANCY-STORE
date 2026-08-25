"use client";

import { generateWhatsAppLink } from "@/lib/whatsapp";

interface WhatsAppButtonProps {
  productName: string;
  price: number;
  productCode?: string;
  productUrl?: string;
  variant?: "default" | "featured" | "large";
}

export default function WhatsAppButton({
  productName,
  price,
  productCode,
  productUrl,
  variant = "default",
}: WhatsAppButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const currentUrl = productUrl || window.location.href;
    const link = generateWhatsAppLink({
      productName,
      price,
      productCode,
      productUrl: currentUrl,
    });
    window.open(link, "_blank", "noopener,noreferrer");
  };

  if (variant === "large") {
    return (
      <button
        onClick={handleClick}
        className="btn btn--primary btn--full text-center"
      >
        Inquire via WhatsApp →
      </button>
    );
  }

  if (variant === "featured") {
    return (
      <button
        onClick={handleClick}
        className="btn btn--sm !border-paper !text-paper hover:!bg-paper hover:!text-ink"
      >
        Inquire →
      </button>
    );
  }

  return (
    <button onClick={handleClick} className="btn btn--sm">
      Inquire →
    </button>
  );
}
