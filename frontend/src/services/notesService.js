import axiosInstance from "./axios";

const getAuthHeaders = () => {
  const token = localStorage.getItem("skillmentor_token");

  return {
    Authorization: `Bearer ${token}`,
  };
};

const notesService = {
  getNotes: async () => {
    const response = await axiosInstance.get("/notes", {
      headers: getAuthHeaders(),
    });

    return response.data;
  },

  createNote: async (noteData) => {
    const response = await axiosInstance.post("/notes", noteData, {
      headers: getAuthHeaders(),
    });

    return response.data;
  },

  updateNote: async (id, noteData) => {
    const response = await axiosInstance.patch(`/notes/${id}`, noteData, {
      headers: getAuthHeaders(),
    });

    return response.data;
  },

  deleteNote: async (id) => {
    const response = await axiosInstance.delete(`/notes/${id}`, {
      headers: getAuthHeaders(),
    });

    return response.data;
  },
};

export default notesService;