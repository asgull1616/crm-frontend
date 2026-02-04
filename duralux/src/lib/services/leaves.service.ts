import api from '../axios';


console.log('🔥 LEAVES SERVICE API INSTANCE:', api);
export const leavesService = {
  getPending: () => api.get('/teams/leaves/pending'),
  getApproved: () => api.get('/teams/leaves/approved'),

  create: (data: {
  type: string;
  start: string;
  end: string;
  note?: string;
}) => api.post('/teams/leaves', data),

getMyLeaves: () => api.get('/teams/leaves/my'),

  approve: (id: number) =>
    api.patch(`/teams/leaves/${id}/approve`),
  reject: (id: number) =>
    api.patch(`/teams/leaves/${id}/reject`),
};
