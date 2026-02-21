import api from "../axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

/* ================= URL NORMALIZER ================= */

const normalizeFileUrl = (url?: string | null) => {
  if (!url) return null;

  // already absolute
  if (url.startsWith("http")) return url;

  const cleanBase = API_BASE.replace(/\/$/, "");
  const cleanUrl = url.startsWith("/") ? url : `/${url}`;

  return `${cleanBase}${cleanUrl}`;
};

/* ================= CACHE BUSTER ================= */

const withCacheBuster = (url?: string | null) => {
  const normalized = normalizeFileUrl(url);
  if (!normalized) return null;

  const separator = normalized.includes("?") ? "&" : "?";
  return `${normalized}${separator}v=${Date.now()}`;
};

/* ================= SERVICE ================= */

export const contractService = {
  /* ===== LIST ===== */
  async getAll(page = 1, limit = 50) {
    const res = await api.get(`/files/contracts`, {
      params: { page, limit },
    });

    const mapped = (res.data?.data || []).map((x: any) => ({
      ...x,
      fileUrl: normalizeFileUrl(x.fileUrl),
    }));

    return {
      ...res.data,
      data: mapped,
    };
  },

  /* ===== DETAIL ===== */
  async getById(id: string) {
    const res = await api.get(`/files/contracts/${id}`);

    return {
      ...res.data,
      data: {
        ...res.data?.data,
        fileUrl: normalizeFileUrl(res.data?.data?.fileUrl),
      },
    };
  },

  /* ===== CREATE (multipart) ===== */
  async create(formData: FormData) {
    return api.post(`/files/contracts`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  /* ===== UPDATE (multipart destekli) ===== */
  async update(id: string, formData: FormData) {
    return api.patch(`/files/contracts/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  /* ===== DELETE ===== */
  async delete(id: string) {
    return api.delete(`/files/contracts/${id}`);
  },

  /* ===== FILE OPEN HELPER ===== */
  openFile(url?: string | null) {
    const finalUrl = withCacheBuster(url);
    if (!finalUrl) return;

    window.open(finalUrl, "_blank");
  },
};