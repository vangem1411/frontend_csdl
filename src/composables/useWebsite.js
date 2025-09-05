// composables/useWebsite.js
import { ref } from 'vue';
import api from '../composables/axios';

const selectedWebsite = ref(null);
const API_BASE_URL = '/website';

export function useWebsite() {
  const getWebsiteById = async (id) => {
    try {
      const response = await api.get(`${API_BASE_URL}/${id}`);
      selectedWebsite.value = response.data; // Cập nhật ref selectedWebsite
    } catch (error) {
      console.error('Lỗi khi lấy thông tin trang web:', error);
      selectedWebsite.value = null; // Reset nếu có lỗi
      throw error; // Ném lỗi để component gọi có thể bắt
    }
  };

  const createWebsiteApi = async (websiteData) => {
    try {
      const response = await api.post(API_BASE_URL, websiteData);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tạo trang web:', error);
      throw error;
    }
  };

  const updateWebsiteApi = async (id, websiteData) => {
    try {
      const response = await api.put(`${API_BASE_URL}/${id}`, websiteData);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi cập nhật trang web:', error);
      throw error;
    }
  };

  const deleteWebsiteApi = async (id) => {
    try {
      await api.delete(`${API_BASE_URL}/${id}`);
    } catch (error) {
      console.error('Lỗi khi xóa trang web:', error);
      throw error;
    }
  };

  return {
    selectedWebsite,
    getWebsiteById,
    createWebsiteApi,
    updateWebsiteApi,
    deleteWebsiteApi,
  };
}