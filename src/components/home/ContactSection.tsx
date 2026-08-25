"use client";

import { useState } from "react";

export default function ContactSection() {
  const whatsappNumber = "94752808963";
  const displayPhone = "075 280 8963";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi Laura Fancy Store, I would like to inquire about your products.")}`;

  return (
    <section className="py-24 px-6 md:px-12 border-b border-ink bg-paper-warm" id="contact">
      <div className="max-w-4xl mx-auto border-2 border-ink bg-paper p-8 sm:p-14 text-center flex flex-col items-center gap-6 shadow-[8px_8px_0px_0px_#111]">
        <h2 className="font-display text-4xl sm:text-6xl tracking-wider leading-none">CONTACT US</h2>
        
        <p className="text-xs sm:text-sm text-[#333] max-w-lg leading-relaxed">
          Have a question about our products, orders, or delivery? Reach out to us directly on WhatsApp for instant assistance and personalized customer support.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#25D366] text-white font-mono text-xs sm:text-sm font-bold tracking-wider uppercase border-2 border-ink shadow-[4px_4px_0px_0px_#111] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_#111] transition-all"
          >
            <svg
              className="w-6 h-6 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.99c-.002 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662a11.87 11.87 0 005.707 1.456h.005c6.554 0 11.89-5.335 11.893-11.893 0-3.177-1.238-6.163-3.487-8.411Z" />
            </svg>
            CLICK HERE
          </a>
        </div>

        <div className="font-mono text-[10px] text-grey tracking-wider uppercase mt-2">
          Direct Line: {displayPhone} | Available 24/7 for customer support
        </div>
      </div>
    </section>
  );
}
