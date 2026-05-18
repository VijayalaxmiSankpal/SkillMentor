import axiosInstance from "./axios";

const getAuthHeaders = () => {
  const token = localStorage.getItem("skillmentor_token");

  return {
    Authorization: `Bearer ${token}`,
  };
};

const codingService = {
  getProblems: async () => {
    const response = await axiosInstance.get("/coding", {
      headers: getAuthHeaders(),
    });

    return response.data;
  },

  createProblem: async (problemData) => {
    const response = await axiosInstance.post("/coding", problemData, {
      headers: getAuthHeaders(),
    });

    return response.data;
  },

  updateProblem: async (id, problemData) => {
    const response = await axiosInstance.patch(`/coding/${id}`, problemData, {
      headers: getAuthHeaders(),
    });

    return response.data;
  },

  deleteProblem: async (id) => {
    const response = await axiosInstance.delete(`/coding/${id}`, {
      headers: getAuthHeaders(),
    });

    return response.data;
  },

  getStats: async () => {
    const response = await axiosInstance.get("/coding/stats", {
      headers: getAuthHeaders(),
    });

    return response.data;
  },
};

export default codingService;