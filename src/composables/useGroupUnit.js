// composables/useUser.js
import { ref } from 'vue';
import api from '../composables/axios';

const selectedGroupUnit = ref(null);
const groupUnitList = ref([]);
const API_BASE_URL = '/groupunit';

export function useGroupUnit() {
  const getGroupUnitById = async (id) => {
    try {
      const response = await api.get(`${API_BASE_URL}/${id}`);
      selectedGroupUnit.value = response.data; // Cập nhật ref selectedGroupUnit
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người dùng:', error);
      selectedGroupUnit.value = null; // Reset nếu có lỗi
      throw error; // Ném lỗi để component gọi có thể bắt
    }
  };

  const createGroupUnitApi = async (unitData) => {
    try {
      const response = await api.post(API_BASE_URL, unitData);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tạo người dùng:', error);
      throw error;
    }
  };

  const getAllGroupUnit = async () => {
    try {
      const response = await api.get(API_BASE_URL);
      groupUnitList.value = response.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách group unit:', error);
      groupUnitList.value = [];
      throw error;
    }
  };

  const updateGroupUnitApi = async (id, unitData) => {
    try {
      const response = await api.put(`${API_BASE_URL}/${id}`, unitData);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi cập nhật người dùng:', error);
      throw error;
    }
  };

  const deleteGroupUnitApi = async (id) => {
    try {
      await api.delete(`${API_BASE_URL}/${id}`);
    } catch (error) {
      console.error('Lỗi khi xóa người dùng:', error);
      throw error;
    }
  };

  return {
    selectedGroupUnit,
    groupUnitList,
    getAllGroupUnit,
    getGroupUnitById,
    createGroupUnitApi,
    updateGroupUnitApi,
    deleteGroupUnitApi,
  };
}