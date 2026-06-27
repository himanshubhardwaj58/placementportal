import api from "./api";

export const applyToJob = (jobId) => api.post(`/applications/apply/${jobId}`);
export const withdrawApplication = (id) => api.delete(`/applications/${id}/withdraw`);
export const getMyApplications = () => api.get("/applications/my");
export const getJobApplications = (jobId, params) =>
  api.get(`/applications/job/${jobId}`, { params });
export const updateApplicationStatus = (id, data) =>
  api.put(`/applications/${id}/status`, data);
