export const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export const toUiStatus = (s) => (s === "ACTIVE" ? "AKTİF" : "PASİF");

export const formatTrDate = (iso) => {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("tr-TR");
};
