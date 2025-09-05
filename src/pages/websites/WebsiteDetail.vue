<template>
    <div>
      <!-- Modal -->
      <div :class="['modal', 'fade', { 'show d-block': showModal }]" tabindex="-1" aria-labelledby="websiteDetailModalLabel" :aria-hidden="!showModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header alert-info">
              <h5 class="modal-title" id="websiteDetailModalLabel">Chi tiết trang web</h5>
              <button type="button" class="btn-close" @click="closeModal" aria-label="Close">&times;</button>
            </div>
            <div class="modal-body">
              <div v-if="website">
                <p><strong>ID:</strong> {{ website.id }}</p>
                <p><strong>Tên:</strong> {{ website.name }}</p>
                <p><strong>Url:</strong> {{ website.url }}</p>
                <p><strong>Mô tả:</strong> {{ website.description }}</p>
                <p><strong>Trạng thái:</strong> {{ website.status }}</p>
                <p><strong>Deface:</strong> {{ website.is_defaced }}</p>
                <p><strong>Lỗ hổng bảo mật:</strong> {{ website.has_security_issue }}</p>
                <p><strong>Snapshort:</strong> {{ website.snapshot_html }}</p>
                <p><strong>Ghi chú:</strong> {{ website.note }}</p>
                <p><strong>Đơn vị:</strong> {{ website.group_unit_name || 'Không xác định'}}</p>
               
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
    websiteData: {
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
  
  // Biến local để lưu website
  const website = ref(null)
  
  // Theo dõi props.websiteData để cập nhật website
  watch(() => props.websiteData, (newVal) => {
    website.value = newVal
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