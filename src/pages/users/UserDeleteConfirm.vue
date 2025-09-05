<template>
  <div>
    <div :class="['modal', 'fade', { 'show d-block': showModal }]" tabindex="-1" aria-labelledby="userDeleteConfirmModalLabel" :aria-hidden="!showModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header alert-danger">
          <h5 class="modal-title" id="userDeleteConfirmModalLabel">Xác nhận xóa người dùng</h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close">&times;</button>
        </div>
        <div class="modal-body">
          <p v-if="userData">Bạn có chắc chắn muốn xóa người dùng **{{ userData.name }}** không?</p>
          <p v-else>Bạn có chắc chắn muốn xóa người dùng này không?</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Hủy</button>
          <button type="button" class="btn btn-danger" @click="handleConfirm">Xóa</button>
        </div>
      </div>
    </div>
  </div>
    <div v-if="showModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
import { watch } from 'vue';

export default {
  name: 'UserDeleteConfirm',
  props: {
    userData: {
      type: Object,
      default: null,
    },
    showModal: { // Prop mới để kiểm soát hiển thị
        type: Boolean,
        required: true
    }
  },
  setup(props, { emit }) {
    const handleConfirm = () => {
      emit('confirm-delete');
    };

    watch(() => props.showModal, (newVal) => {
        if (newVal) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }
    });

    const closeModal = () => {
        emit('close-modal');
    };

    return {
      handleConfirm,
      closeModal
    };
  },
};
</script>