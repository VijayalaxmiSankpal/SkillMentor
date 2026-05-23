import axiosInstance from "./axios";

const getAuthHeaders = () => {
  const token = localStorage.getItem("skillmentor_token");

  return {
    Authorization: `Bearer ${token}`,
  };
};

const mockInterviewService = {
  getInterviews: async () => {
    const response = await axiosInstance.get("/mock-interviews", {
      headers: getAuthHeaders(),
    });

    return response.data;
  },

  createInterview: async (interviewData) => {
    const response = await axiosInstance.post(
      "/mock-interviews",
      interviewData,
      {
        headers: getAuthHeaders(),
      }
    );

    return response.data;
  },

  updateInterview: async (id, interviewData) => {
    const response = await axiosInstance.patch(
      `/mock-interviews/${id}`,
      interviewData,
      {
        headers: getAuthHeaders(),
      }
    );

    return response.data;
  },

  deleteInterview: async (id) => {
    const response = await axiosInstance.delete(
      `/mock-interviews/${id}`,
      {
        headers: getAuthHeaders(),
      }
    );

    return response.data;
  },

  saveFeedback: async (id, feedbackData) => {
    const response = await axiosInstance.post(
      `/mock-interviews/${id}/feedback`,
      feedbackData,
      {
        headers: getAuthHeaders(),
      }
    );

    return response.data;
  },
  generateQuestions: async (payload) => {
  const response = await axiosInstance.post(
    "/ai/interview-questions",
    payload,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
},

  evaluateInterview: async (id, answers) => {
    const response = await axiosInstance.post(
      `/mock-interviews/${id}/evaluate`,
      {
        answers,
      },
      {
        headers: getAuthHeaders(),
      }
    );

    return response.data;
  },
};

export default mockInterviewService;