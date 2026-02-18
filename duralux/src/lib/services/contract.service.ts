import api from "../axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

/* ================= URL NORMALIZER ================= */

const normalizeFileUrl = (url?: string | null) => {
  if (!url) return null;
  if (url.startsWith("http")) return url;

  const cleanBase = API_BASE.replace(/\/$/, "");
  const cleanUrl = url.startsWith("/") ? url : `/${url}`;

  return `${cleanBase}${cleanUrl}`;
};

/* ================= SERVICE ================= */

export const contractService = {
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

  async create(formData: FormData) {
    return api.post(`/files/contracts`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  async update(id: string, data: any) {
    return api.patch(`/files/contracts/${id}`, data);
  },

  async delete(id: string) {
    return api.delete(`/files/contracts/${id}`);
  },
};
