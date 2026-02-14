export const toUiStatus = (s) =>
  s === "ACTIVE" ? "AKTİF" : "PASİF";

export const formatTrDate = (iso) => {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("tr-TR");
};
