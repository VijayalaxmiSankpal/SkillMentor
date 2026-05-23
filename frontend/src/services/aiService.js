import api from "./api";

const mentorChat = (message, chatId) => {
  const payload = {
    message,
  };

  if (chatId) {
    payload.chatId = chatId;
  }

  return api.post("/ai/mentor", payload);
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
const listChats = () => {
  return api.get("/ai/chats?context=mentor");
};

const getChat = (chatId) => {
  return api.get(`/ai/chats/${chatId}`);
};

const deleteChat = (chatId) => {
  return api.delete(`/ai/chats/${chatId}`);
};

const saveQuestion = (question) => {
  return api.post("/ai/saved-questions", question);
};

const listSavedQuestions = () => {
  return api.get("/ai/saved-questions");
};

const deleteSavedQuestion = (id) => {
  return api.delete(`/ai/saved-questions/${id}`);
};

const aiService = {
  mentorChat,
  listChats,
  getChat,
  deleteChat,
  generateInterviewQuestions,
  saveQuestion,
listSavedQuestions,
deleteSavedQuestion,
};

export default aiService;