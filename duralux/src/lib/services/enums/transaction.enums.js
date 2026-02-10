export const TransactionType = {
  INCOME: "INCOME",
  EXPENSE: "EXPENSE",
};

// ✅ GÜNCELLEME BURADA:
// Okunabilirlik için 'bg-opacity' kaldırdık, 'text-white' ekledik.
// Artık "GELİR" yemyeşil zemin üzerine beyaz yazı olacak.
export const TransactionTypeConfig = {
  [TransactionType.INCOME]: {
    label: "GELİR",
    class: "bg-success text-white shadow-sm", // Yeşil zemin, Beyaz yazı
    btnClass: "btn-success",
    outlineClass: "btn-outline-success",
  },
  [TransactionType.EXPENSE]: {
    label: "GİDER",
    class: "bg-danger text-white shadow-sm", // Kırmızı zemin, Beyaz yazı
    btnClass: "btn-danger",
    outlineClass: "btn-outline-danger",
  },
};

export const PaymentMethod = {
  BANK_TRANSFER: "BANK_TRANSFER",
  CASH: "CASH",
  CREDIT_CARD: "CREDIT_CARD",
  OTHER: "OTHER",
};

export const PaymentMethodLabels = {
  [PaymentMethod.BANK_TRANSFER]: "Banka Havalesi",
  [PaymentMethod.CASH]: "Nakit",
  [PaymentMethod.CREDIT_CARD]: "Kredi Kartı",
  [PaymentMethod.OTHER]: "Diğer",
};
