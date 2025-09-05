<template>
  <div :class="['modal', 'fade', { 'show d-block': showModal }]" tabindex="-1" aria-labelledby="userDetailModalLabel" :aria-hidden="!showModal">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header alert-success">
          <h5 class="modal-title">Chi tiết nhóm đơn vị</h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close">&times;</button>
        </div>
        <div class="modal-body">
          <p><strong>Tên:</strong> {{ unitData?.name }}</p>
          <p><strong>Mô tả:</strong> {{ unitData?.description }}</p>
          <p><strong>Trạng thái:</strong> {{ unitData?.status }}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Đóng</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  unitData: Object,
  showModal: Boolean
})

const emit = defineEmits(['close-modal'])

const unit = ref(null)

watch(() => props.unitData, (newVal) => {
  unit.value = newVal
}, { immediate: true })

const closeModal = () => {
  emit('close-modal')
}
</script>
