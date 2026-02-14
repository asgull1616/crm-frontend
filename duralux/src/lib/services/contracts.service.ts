import api from "../axios";

export type ContractStatus = "ACTIVE" | "INACTIVE";

export type ContractListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  status?: ContractStatus;
  customerId?: string;
  _t?: number;
  [key: string]: any;
};

export type CreateContractPayload = {
  title: string;
  status: ContractStatus;
  description?: string;
  customerId?: string;
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
};

export type UpdateContractPayload = Partial<CreateContractPayload>;

export const contractsService = {
  list: (params?: ContractListQuery) => api.get("files/contracts", { params }),

  getById: (id: string) => api.get(`files/contracts/${id}`),

  create: (payload: CreateContractPayload, file?: File | null) => {
    const fd = new FormData();

    fd.append("title", payload.title);
    fd.append("status", payload.status);

    if (payload.description) fd.append("description", payload.description);
    if (payload.customerId) fd.append("customerId", payload.customerId);
    if (payload.startDate) fd.append("startDate", payload.startDate);
    if (payload.endDate) fd.append("endDate", payload.endDate);

    if (file) {
      console.log("Appending file:", file);
      fd.append("file", file);
    } else {
      console.log("⚠️ No file to append");
    }

    // 🔥 FormData içeriğini yazdır
    console.log("----- FORM DATA START -----");
    console.log("----- FORM DATA START -----");

    fd.forEach((value, key) => {
      console.log("FD", key, value);
    });

    console.log("----- FORM DATA END -----");
    console.log("----- FORM DATA END -----");

    return api.post("files/contracts", fd, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },


  update: (id: string, payload: UpdateContractPayload, file?: File | null) => {
    const fd = new FormData();

    if (payload.title !== undefined) fd.append("title", payload.title ?? "");
    if (payload.status !== undefined) fd.append("status", payload.status);

    if (payload.description !== undefined) fd.append("description", payload.description ?? "");
    if (payload.customerId !== undefined) fd.append("customerId", payload.customerId ?? "");
    if (payload.startDate !== undefined) fd.append("startDate", payload.startDate ?? "");
    if (payload.endDate !== undefined) fd.append("endDate", payload.endDate ?? "");

    if (file) fd.append("file", file);

    return api.patch(`files/contracts/${id}`, fd);
  },

  delete: (id: string) => api.delete(`files/contracts/${id}`),
};
