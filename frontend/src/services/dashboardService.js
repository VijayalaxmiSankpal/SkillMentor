import axiosInstance from "./axios";

const dashboardService = {
  getDashboard: async () => {
    const token = localStorage.getItem("skillmentor_token");

    const response = await axiosInstance.get("/users/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },
};

export default dashboardService;