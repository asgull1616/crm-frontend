import api from "../axios";

// ✅ Backend ProposalItem modeli ile tam uyumlu kalem yapısı
export interface ProposalItemPayload {
  description: string; // Ürün/Hizmet adı
  quantity: number;    // Adet
  unitPrice: number;   // Birim Fiyat
  taxRate: number;     // KDV Oranı (Örn: 20)
}

export interface CreateProposalPayload {
  title: string;
  customerId: string;
  validUntil: string; // ISO string formatında (2026-03-01T...)
  status?: "DRAFT" | "SENT" | "APPROVED" | "REJECTED" | "EXPIRED";
  items: ProposalItemPayload[]; // ✅ Kalem listesi zorunlu hale getirildi
  totalAmount?: string | number; // Opsiyonel toplam tutar
}

export interface ProposalListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: "createdAt" | "updatedAt" | "title" | "status";
  order?: "asc" | "desc";
}

export const proposalService = {
  // Teklif listesini getirir
  list: (params: ProposalListParams) => api.get("proposals/list", { params }),

  // Teklif detayını kalemleriyle birlikte getirir
  getById: (id: string) => api.get(`proposals/${id}`),

  // Yeni teklif oluşturur (Kalemler dahil)
  create: (data: CreateProposalPayload) => api.post("proposals", data),

  // Mevcut teklifi ve kalemlerini günceller
  update: (id: string, data: Partial<CreateProposalPayload>) =>
    api.patch(`proposals/${id}`, data),

  // Teklifi siler (Soft delete)
  remove: (id: string) => api.delete(`proposals/${id}`),
};

export const proposalService2 = {
  list: (params?: {
    page?: number;
    limit?: number;
    sortBy?: "createdAt" | "updatedAt" | "title" | "status";
    order?: "asc" | "desc";
    status?: string;
    search?: string;
  }) => api.get("proposals/list", { params }),
};