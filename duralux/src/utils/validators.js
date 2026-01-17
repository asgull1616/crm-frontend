// utils/validators.js

// Telefon (E.164 formatı)
export const PHONE_REGEX = /^\+?[1-9]\d{7,14}$/;

// Website (.com, .com.tr, subdomain destekli)
export const WEBSITE_REGEX =
  /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
  
// Vergi numarası (TR - 10 haneli)
export const VAT_REGEX = /^\d{10}$/;

// Email (frontend için yeterli)
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;