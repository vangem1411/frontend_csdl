<template>
  <div>
    <div :class="['modal', 'fade', 'bs-example-modal-lg', { 'show d-block': showModal }]" tabindex="-1"
      aria-labelledby="updateUserModalLabel" :aria-hidden="!showModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header alert-warning">
            <h5 class="modal-title" id="updateUserModalLabel">Cập nhật đơn vị</h5>
            <button type="button" class="btn-close" @click="closeModal" aria-label="Close">&times;</button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label for="name" class="form-label">Tên đơn vị:</label>
                <input type="text" class="form-control" v-model="form.name" required />
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Mô tả:</label>
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
                <button type="submit" class="btn btn-primary">Cập nhật</button>
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
  unitData: {
    type: Object,
    default: () => ({}),
  },
  showModal: {
    type: Boolean,
    required: true,
  }
})

const emit = defineEmits(['emit-update', 'close-modal'])

const form = ref({
  name: '',
  description: '',
  status: ''
})

// Theo dõi mở modal (chỉ xử lý class body)
watch(() => props.showModal, (val) => {
  if (val) {
    document.body.classList.add('modal-open')
  } else {
    document.body.classList.remove('modal-open')
  }
})

// Gán dữ liệu user khi prop thay đổi
watch(() => props.unitData, (newVal) => {
  if (newVal && newVal.id) {
    form.value = {
      name: newVal.name || '',
      description: newVal.description || '',
      status: newVal.status
    }
  }
}, { immediate: true })

const handleSubmit = () => {
  emit('emit-update', { ...form.value })
}

const closeModal = () => {
  emit('close-modal')
}
</script>
