import axiosInstance from "./axios";

const authService = {
  login: async (email, password) => {
    const response = await axiosInstance.post("/auth/login", { email, password });
    return response.data;
  },

  register: async (name, email, password) => {
    const response = await axiosInstance.post("/auth/signup", { name, email, password });
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await axiosInstance.post("/auth/forgot-password", { email });
    return response.data;
  },

  resetPassword: async (token, password) => {
    const response = await axiosInstance.post("/auth/reset-password", { token, password });
    return response.data;
  },

  verifyEmail: async (token) => {
    const response = await axiosInstance.get("/auth/verify-email?token=" + token);
    return response.data;
  },
};

export default authService;