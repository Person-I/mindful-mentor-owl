import axios from 'axios';
import { Talk, CreateTalkInput, UpdateTalkInput } from "@/types/talk";
import { API_URL } from "@/api";

const handleApiError = (error: any) => {
  if (error.response) {
    throw new Error(error.response.data.message || "API Error");
  } else {
    throw new Error("Network Error");
  }
};

export const historyService = {
  async getTalks(userId: string): Promise<Talk[]> {
    try {
      const response = await axios.get(`${API_URL}conversations/`, {
        params: { user_id: userId },
      });
      const xyz =  response.data.map((item: any) => ({id: item.id, created_at: item.created_at, content: JSON.parse(item.content)}));
      return xyz;
    } catch (error) {
      handleApiError(error);
    }
  },

  async getTalk(userId: string, id: string): Promise<Talk> {
    try {
      const response = await axios.get(`${API_URL}conversations/${id}/`, {
        params: { user_id: userId },
      });
      return {
        ...response.data,
        content: JSON.parse(response.data.content),
      };
    } catch (error) {
      handleApiError(error);
    }
  },

  async createTalk(userId: string, content: string): Promise<Talk> {
    try {
      const response = await axios.post(`${API_URL}conversations/`, {
        content: content,
        user_id: userId,
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  async updateTalk(userId: string, id: string, data: UpdateTalkInput): Promise<Talk> {
    try {
      const response = await axios.put(`${API_URL}conversations/${id}/`, {
        ...data,
        user_id: userId,
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  async deleteTalk(userId: string, id: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}conversations/${id}/`, {
        params: { user_id: userId },
      });
    } catch (error) {
      handleApiError(error);
    }
  },
};
