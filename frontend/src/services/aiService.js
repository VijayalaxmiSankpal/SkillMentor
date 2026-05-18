import api from "./api";

const mentorChat = (message, chatId = null) => {
  return api.post("/ai/mentor", {
    message,
    chatId,
  });
};

const generateInterviewQuestions = (payload) => {
  return api.post("/ai/interview-questions", {
    role: payload.role,
    type: "technical",
    difficulty: payload.difficulty.toLowerCase(),
    skills: payload.skills,
    count: payload.count,
  });
};

const aiService = {
  mentorChat,
  generateInterviewQuestions,
};

export default aiService;