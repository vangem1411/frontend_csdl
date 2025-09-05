// composables/useDevice.js
import { ref } from 'vue';
import api from '../composables/axios';

const selectedDevice = ref(null);
const API_BASE_URL = '/device';

export function useDevice() {
  const getDeviceById = async (id) => {
    try {
      const response = await api.get(`${API_BASE_URL}/${id}`);
      selectedDevice.value = response.data; // Cập nhật ref selectedDevice
    } catch (error) {
      console.error('Lỗi khi lấy thông tin trang web:', error);
      selectedDevice.value = null; // Reset nếu có lỗi
      throw error; // Ném lỗi để component gọi có thể bắt
    }
  };

  const createDeviceApi = async (deviceData) => {
    try {
      const response = await api.post(API_BASE_URL, deviceData);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tạo trang web:', error);
      throw error;
    }
  };

  const updateDeviceApi = async (id, deviceData) => {
    try {
      const response = await api.put(`${API_BASE_URL}/${id}`, deviceData);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi cập nhật trang web:', error);
      throw error;
    }
  };

  const deleteDeviceApi = async (id) => {
    try {
      await api.delete(`${API_BASE_URL}/${id}`);
    } catch (error) {
      console.error('Lỗi khi xóa trang web:', error);
      throw error;
    }
  };

  return {
    selectedDevice,
    getDeviceById,
    createDeviceApi,
    updateDeviceApi,
    deleteDeviceApi,
  };
}