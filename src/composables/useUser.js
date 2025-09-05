// composables/useUser.js
import { ref } from 'vue';
import api from '../composables/axios'

const selectedUser = ref(null);
const API_BASE_URL = '/users';

export function useUser() {
  const getUserById = async (id) => {
    try {
      const response = await api.get(`${API_BASE_URL}/${id}`);
      selectedUser.value = response.data; // Cập nhật ref selectedUser
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người dùng:', error);
      selectedUser.value = null; // Reset nếu có lỗi
      throw error; // Ném lỗi để component gọi có thể bắt
    }
  };

  const createUserApi = async (userData) => {
    try {
      const response = await api.post(API_BASE_URL, userData);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tạo người dùng:', error);
      throw error;
    }
  };

  const updateUserApi = async (id, userData) => {
    try {
      const response = await api.put(`${API_BASE_URL}/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi cập nhật người dùng:', error);
      throw error;
    }
  };

  const deleteUserApi = async (id) => {
    try {
      await api.delete(`${API_BASE_URL}/${id}`);
    } catch (error) {
      console.error('Lỗi khi xóa người dùng:', error);
      throw error;
    }
  };

  return {
    selectedUser,
    getUserById,
    createUserApi,
    updateUserApi,
    deleteUserApi,
  };
}