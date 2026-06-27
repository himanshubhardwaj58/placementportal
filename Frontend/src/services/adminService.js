import api from "./api";

export const getDashboardStats = () => api.get("/admin/stats");
export const getUsers = (params) => api.get("/admin/users", { params });
export const toggleUserStatus = (id) => api.put(`/admin/users/${id}/toggle-status`);
export const updateUserRole = (id, role) => api.put(`/admin/users/${id}/role`, { role });
export const getPlacementStats = () => api.get("/admin/placement-stats");
