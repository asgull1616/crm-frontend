import api from '../axios';

export interface CreateProposalPayload {
  title: string;
  customerId: string;
  validUntil: string; // ISO string
  status?: 'DRAFT' | 'SENT' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
}

export interface ProposalListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'status';
  order?: 'asc' | 'desc';
}

export const proposalService = {
  list: (params: ProposalListParams) =>
    api.get('/proposals/list', { params }),

  getById: (id: string) =>
    api.get(`/proposals/${id}`),

  create: (data: CreateProposalPayload) =>
    api.post('/proposals', data),

  update: (id: string, data: Partial<CreateProposalPayload>) =>
    api.patch(`/proposals/${id}`, data),

  remove: (id: string) =>
    api.delete(`/proposals/${id}`),
};
