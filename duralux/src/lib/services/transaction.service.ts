import api from "../axios";

// -------------------------------------
// TYPES
// -------------------------------------
export type TransactionType = "INCOME" | "EXPENSE";

export type PaymentMethod = "BANK_TRANSFER" | "CASH" | "CREDIT_CARD" | "OTHER";

export interface CustomerMini {
  id: string;
  fullName: string;
  companyName?: string | null;
}

export interface ProposalMini {
  id: string;
  title: string;
  status: string;
}

export interface UserMini {
  id: string;
  username: string;
  email?: string;
}

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  category: string | null;
  description: string | null;
  amount: string; // backend Decimal -> string
  currency: string;

  paymentMethod?: PaymentMethod;
  referenceNo?: string | null;

  customer?: CustomerMini | null;
  proposal?: ProposalMini | null;
  createdByUser?: UserMini;
}

export interface TransactionListResponse {
  items: Transaction[];
  page: number;
  limit: number;
  total: number;
}

export interface TransactionSummary {
  incomeTotal: string;
  expenseTotal: string;
  net: string;
  currency: string;
}

// -------------------------------------
// PAYLOADS
// -------------------------------------
export interface CreateTransactionPayload {
  type: TransactionType;
  amount: string; // decimal string (örn: "12500.00")
  currency?: string;
  date?: string; // ISO
  description?: string;
  category?: string;
  paymentMethod?: PaymentMethod;
  referenceNo?: string;
  proposalId?: string; // customer otomatik proposal'dan gelir
}

export interface UpdateTransactionPayload {
  type?: TransactionType;
  amount?: string;
  currency?: string;
  date?: string;
  description?: string | null;
  category?: string | null;
  paymentMethod?: PaymentMethod;
  referenceNo?: string | null;
  proposalId?: string;
}

// -------------------------------------
// SERVICE
// -------------------------------------
export const transactionService = {
  // ➕ CREATE
  create: (data: CreateTransactionPayload) => api.post("transactions", data),

  // 📄 LIST (filter + pagination)
  list: (params?: {
    page?: number;
    limit?: number;
    type?: TransactionType;
    category?: string;
    q?: string;
    dateFrom?: string;
    dateTo?: string;
    customerId?: string;
    paymentMethod?: PaymentMethod;
    minAmount?: string;
    maxAmount?: string;
    isPaid?: boolean;
  }) => api.get<TransactionListResponse>("transactions", { params }),

  // 🔍 GET BY ID (VIEW)
  getById: (id: string) => api.get<Transaction>(`transactions/${id}`),

  // 📊 SUMMARY
  summary: (params?: { dateFrom?: string; dateTo?: string }) =>
    api.get<TransactionSummary>("transactions/summary", { params }),

  // ✏️ UPDATE
  update: (id: string, data: UpdateTransactionPayload) =>
    api.patch(`transactions/${id}`, data),

  // 🗑️ SOFT DELETE
  remove: (id: string) => api.delete(`transactions/${id}`),
};
