import api from "./api";

export const getCompanies = (params) => api.get("/companies", { params });
export const getCompanyById = (id) => api.get(`/companies/${id}`);
export const getMyCompany = () => api.get("/companies/my");
export const createCompany = (data) => api.post("/companies", data);
export const updateCompany = (id, data) => {
  if (data instanceof FormData) {
    return api.put(`/companies/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  return api.put(`/companies/${id}`, data);
};
export const approveCompany = (id, isApproved) =>
  api.put(`/companies/${id}/approve`, { isApproved });
