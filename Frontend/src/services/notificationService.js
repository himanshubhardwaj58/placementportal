import api from "./api";

export const getNotifications = (params) => api.get("/notifications", { params });
export const markAsRead = (id) => api.put(`/notifications/${id}/read`);
export const markAllAsRead = () => api.put("/notifications/read-all");
export const deleteNotification = (id) => api.delete(`/notifications/${id}`);
export const sendNotification = (data) => api.post("/notifications", data);
