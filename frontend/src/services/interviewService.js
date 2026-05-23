import api from "./api";

const getAllPrep = () => {
  return api.get("/interview-prep");
};

const upsertPrep = (payload) => {
  return api.put("/interview-prep", payload);
};

const addTopic = (subject, topicData) => {
  return api.post(`/interview-prep/${subject}/topics`, topicData);
};

const updateTopic = (subject, topicId, topicData) => {
  return api.patch(`/interview-prep/${subject}/topics/${topicId}`, topicData);
};

const deleteTopic = (subject, topicId) => {
  return api.delete(`/interview-prep/${subject}/topics/${topicId}`);
};

const getWeakTopics = () => {
  return api.get("/interview-prep/weak-topics");
};

const generateAIQuestions = (payload) => {
  return api.post("/ai/interview-questions", {
    role: payload.role || "Frontend Developer",
    type: payload.type || "technical",
    difficulty: payload.difficulty || "medium",
    skills: payload.skills || ["JavaScript"],
    count: payload.count || 1,
  });
};

const interviewService = {
  getAllPrep,
  upsertPrep,
  addTopic,
  updateTopic,
  deleteTopic,
  getWeakTopics,
  generateAIQuestions,
};

export default interviewService;