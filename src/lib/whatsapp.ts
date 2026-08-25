interface WhatsAppInquiryParams {
  productName: string;
  price: number;
  productCode?: string;
  productUrl?: string;
}

export function generateWhatsAppLink({
  productName,
  price,
  productCode,
  productUrl,
}: WhatsAppInquiryParams): string {
  const rawNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '94752808963';
  const cleanNumber = rawNumber.replace(/[^0-9]/g, '');

  let message = `Hi, I'm interested in this product.\n`;
  message += `Product: ${productName}\n`;
  message += `Price: $${price.toLocaleString('en-US')}\n`;
  
  if (productCode) {
    message += `Product Code: ${productCode}\n`;
  }
  
  if (productUrl) {
    message += `Product Link: ${productUrl}\n`;
  }
  
  message += `Could you please provide more information?`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
}
