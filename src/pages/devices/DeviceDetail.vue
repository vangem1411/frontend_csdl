<template>
    <div>
      <!-- Modal -->
      <div :class="['modal', 'fade', { 'show d-block': showModal }]" tabindex="-1" aria-labelledby="deviceDetailModalLabel" :aria-hidden="!showModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header alert-info">
              <h5 class="modal-title" id="deviceDetailModalLabel">Chi tiết thiết bị</h5>
              <button type="button" class="btn-close" @click="closeModal" aria-label="Close">&times;</button>
            </div>
            <div class="modal-body">
              <div v-if="device">
                <p><strong>Mã thiết bị:</strong> {{ device.device_code }}</p>
                <p><strong>Tên:</strong> {{ device.name }}</p>
                <p><strong>Loại:</strong> {{ device.device_code }}</p>
                <p><strong>Thương hiệu:</strong> {{ device.brand}}</p>
                <p><strong>Mẫu:</strong> {{ device.model }}</p>
                <p><strong>Số Seri:</strong> {{ device.serial_number }}</p>
                <p><strong>Ngày mua:</strong> {{ device.purchase_date }}</p>
                <p><strong>Ngày hết hạn bảo hành:</strong> {{ device.warranty_expiry }}</p>
                <p><strong>Trạng thái:</strong> {{ device.status  }}</p>
                <p><strong>Vị trí:</strong> {{ device.location  }}</p>
                <p><strong>Cấp cho ai:</strong> {{ device.assigned_to}}</p>
                <p><strong>Mô tả:</strong> {{ device.description }}</p>
                <p><strong>Đơn vị:</strong> {{ device.group_unit_name || 'Không xác định'}}</p>
               
              </div>
              <div v-else>
                <p>Đang tải thông tin...</p>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">Đóng</button>
            </div>
          </div>
        </div>
      </div>
      <!-- Backdrop nằm bên ngoài modal -->
      <div v-if="showModal" class="modal-backdrop fade show"></div>
    </div>
  </template>
  
  
  <script setup>
  import { ref, watch } from 'vue'
  
  // Định nghĩa props
  const props = defineProps({
    deviceData: {
      type: Object,
      default: null
    },
    showModal: {
      type: Boolean,
      required: true
    }
  })
  
  // Định nghĩa emits
  const emit = defineEmits(['close-modal'])
  
  // Biến local để lưu device
  const device = ref(null)
  
  // Theo dõi props.deviceData để cập nhật device
  watch(() => props.deviceData, (newVal) => {
    device.value = newVal
  }, { immediate: true })
  
  // Theo dõi props.showModal để thêm/xoá class body
  watch(() => props.showModal, (newVal) => {
    if (newVal) {
      document.body.classList.add('modal-open')
    } else {
      document.body.classList.remove('modal-open')
    }
  })
  
  // Hàm đóng modal
  const closeModal = () => {
    emit('close-modal')
  }
  </script>