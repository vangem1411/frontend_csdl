<template>
  <div>
    <div :class="['modal', 'fade', 'bs-example-modal-lg', { 'show d-block': showModal }]" tabindex="-1"
      aria-labelledby="createUnitModalLabel" :aria-hidden="!showModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header alert-success">
            <h5 class="modal-title" id="createUnitModalLabel">Thêm mới đơn vị</h5>
            <button type="button" class="btn-close" @click="closeModal" aria-label="Close">&times;</button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label for="name" class="form-label">Tên đơn vị:</label>
                <input type="text" class="form-control" v-model="form.name" required />
              </div>
              <div class="mb-3">
                <label for="description" class="form-label">Mô tả:</label>
                <textarea class="form-control" rows="3" placeholder="Mô tả" v-model="form.description"
                  required></textarea>
              </div>
              <div class="mb-3">
                <label for="status" class="form-label">Trạng thái:</label>
                <select v-model="form.status" class="form-control" required>
                  <option :value="true">Kích hoạt</option>
                  <option :value="false">Vô hiệu hóa</option>
                </select>
              </div>
              <div class="modal-footer px-0 pb-0">
                <button type="button" class="btn btn-secondary" @click="closeModal">Hủy</button>
                <button type="submit" class="btn btn-primary">Thêm mới</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  showModal: {
    type: Boolean,
    required: true,
  }
})

const emit = defineEmits(['emit-create', 'close-modal'])

const form = ref({
  name: '',
  description: '',
  status: true // mặc định là kích hoạt
})

// Theo dõi showModal để thêm/xóa class modal-open cho body
watch(() => props.showModal, (val) => {
  if (val) {
    document.body.classList.add('modal-open')
  } else {
    document.body.classList.remove('modal-open')
  }
})

// Gửi dữ liệu form ra ngoài
const handleSubmit = () => {
  emit('submit', { ...form.value })
  // Reset lại form sau khi gửi
  form.value = {
    name: '',
    description: '',
    status: true
  }
}

const closeModal = () => {
  emit('close-modal')
}
</script>
