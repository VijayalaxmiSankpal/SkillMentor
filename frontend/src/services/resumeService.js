import axiosInstance from "./axios";

const getAuthHeaders = () => {
  const token = localStorage.getItem("skillmentor_token");

  return {
    Authorization: `Bearer ${token}`,
  };
};

const resumeService = {
  uploadResume: async (file, targetRole = "Frontend Developer") => {
    const formData = new FormData();

    formData.append("resume", file);
    formData.append("targetRole", targetRole);

    const response = await axiosInstance.post("/resume/upload", formData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  getReviews: async () => {
    const response = await axiosInstance.get("/resume", {
      headers: getAuthHeaders(),
    });

    return response.data;
  },

  deleteReview: async (id) => {
    const response = await axiosInstance.delete(`/resume/${id}`, {
      headers: getAuthHeaders(),
    });

    return response.data;
  },
};

export default resumeService;