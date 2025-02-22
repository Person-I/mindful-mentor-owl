import axios from 'axios';
import { Note } from "@/types/note";
import { API_URL } from "@/api";

// Helper function to handle API errors
const handleApiError = (error: any) => {
  if (error.response) {
    throw new Error(error.response.data.message || "API Error");
  } else {
    throw new Error("Network Error");
  }
};

export const noteService = {
  async getNotes(userId: string): Promise<Note[]> {
    try {
      const response = await axios.get(`${API_URL}notes/`, {
        params: { user_id: userId },
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  async getNote(userId: string, id: string): Promise<Note> {
    try {
      const response = await axios.get(`${API_URL}notes/${id}/`, {
        params: { user_id: userId },
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  async createNote(userId: string, data: Omit<Note, "id" | "created_at" | "update_at">): Promise<Note> {
    try {
      const response = await axios.post(`${API_URL}notes/`, {
        ...data,
        user_id: userId,
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  async updateNote(userId: string, id: string, data: Partial<Omit<Note, "id" | "created_at">>): Promise<Note> {
    try {
      const response = await axios.put(`${API_URL}notes/${id}/`, {
        ...data,
        user_id: userId,
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  async deleteNote(userId: string, id: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}notes/${id}/?user_id=${userId}`);
    } catch (error) {
      handleApiError(error);
    }
  },
};
