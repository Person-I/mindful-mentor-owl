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

  async getNote(id: string): Promise<Note> {
    try {
      const response = await axios.get(`${API_URL}notes/${id}/`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  async createNote(data: Omit<Note, "id" | "createdAt" | "updatedAt">): Promise<Note> {
    try {
      const response = await axios.post(`${API_URL}notes/`, data);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  async updateNote(id: string, data: Partial<Omit<Note, "id" | "createdAt">>): Promise<Note> {
    try {
      const response = await axios.put(`${API_URL}notes/${id}/`, data);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  async deleteNote(id: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}notes/${id}/`);
    } catch (error) {
      handleApiError(error);
    }
  },
};
