import api from "./api";

export const loginUser = (data) => api.post("/auth/login", data);
export const registerUser = (data) => api.post("/auth/register", data);
export const getProfile = () => api.get("/auth/profile");
export const updateProfile = (data) => {
  if (data instanceof FormData) {
    return api.put("/auth/profile", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  return api.put("/auth/profile", data);
};
export const uploadResume = (file) => {
  const formData = new FormData();
  formData.append("resume", file);
  return api.post("/auth/upload-resume", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
export const changePassword = (data) => api.put("/auth/change-password", data);
