<template>
  <div>
    <!-- Modal -->
    <div :class="['modal', 'fade', { 'show d-block': showModal }]" tabindex="-1" aria-labelledby="userDetailModalLabel" :aria-hidden="!showModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header alert-info">
            <h5 class="modal-title" id="userDetailModalLabel">Chi tiết người dùng</h5>
            <button type="button" class="btn-close" @click="closeModal" aria-label="Close">&times;</button>
          </div>
          <div class="modal-body">
            <div v-if="user">
              <p><strong>ID:</strong> {{ user.id }}</p>
              <p><strong>Họ tên:</strong> {{ user.name }}</p>
              <p><strong>Email:</strong> {{ user.email }}</p>
              <p><strong>Tài khoản:</strong> {{ user.username }}</p>
              <p><strong>Đơn vị:</strong> {{ user.group_unit_name || 'Không xác định'}}</p>
              <p><strong>Phân quyền:</strong> {{ user.rules || 'Không xác định'}}</p>
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
  userData: {
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

// Biến local để lưu user
const user = ref(null)

// Theo dõi props.userData để cập nhật user
watch(() => props.userData, (newVal) => {
  user.value = newVal
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