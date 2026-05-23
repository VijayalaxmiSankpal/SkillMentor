import axiosInstance from "./axios";

const getAuthHeaders = () => {
  const token = localStorage.getItem("skillmentor_token");

  return {
    Authorization: `Bearer ${token}`,
  };
};

const roadmapService = {
  getRoadmaps: async () => {
    const response = await axiosInstance.get("/roadmaps", {
      headers: getAuthHeaders(),
    });

    return response.data;
  },

  createRoadmap: async (roadmapData) => {
    const response = await axiosInstance.post("/roadmaps", roadmapData, {
      headers: getAuthHeaders(),
    });

    return response.data;
  },

  updateMilestone: async (roadmapId, milestoneId, data) => {
    const response = await axiosInstance.patch(
      `/roadmaps/${roadmapId}/milestones/${milestoneId}`,
      data,
      {
        headers: getAuthHeaders(),
      }
    );

    return response.data;
  },
};

export default roadmapService;