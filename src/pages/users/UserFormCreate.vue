<template>
  <div>
    <div :class="['modal', 'fade', 'bs-example-modal-lg', { 'show d-block': showModal }]" tabindex="-1"
      aria-labelledby="createUserModalLabel" :aria-hidden="!showModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header alert-success">
            <h5 class="modal-title" id="createUserModalLabel">Thêm người dùng</h5>
            <button type="button" class="btn-close" @click="closeModal" aria-label="Close">&times;</button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label for="name" class="form-label">Họ tên:</label>
                <input type="text" class="form-control" id="name" v-model="form.name" required />
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Email:</label>
                <input type="email" class="form-control" id="email" v-model="form.email" required />
              </div>
              <div class="mb-3">
                <label for="username" class="form-label">Tài khoản:</label>
                <input type="text" class="form-control" id="username" v-model="form.username" required />
              </div>
              <div class="mb-3">
                <label for="group_unit_id" class="form-label">Đơn vị:</label>
                <select class="form-control" id="group_unit_id" v-model="form.group_unit_id" required>
                  <option disabled value="">-- Chọn đơn vị --</option>
                  <option v-for="unit in groupUnitList" :key="unit.id" :value="unit.id">
                    {{ unit.name }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Mật khẩu:</label>
                <input type="password" class="form-control" id="password" v-model="form.password" required />
              </div>
              <div class="mb-3">
                <label for="password-confirmation" class="form-label">Xác nhận mật khẩu:</label>
                <input type="password" class="form-control" id="password-confirmation"
                  v-model="form.password_confirmation" required />
              </div>
              <div class="mb-3">
                <label for="rules" class="form-label">Vai trò:</label>
                <select class="form-control" id="rules" v-model="form.rules" required>
                  <option disabled value="">-- Chọn vai trò --</option>
                  <option value="super_admin">Super Admin</option>
                  <option value="staff">Nhân viên</option>
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

<script>
import { ref, watch, onMounted } from 'vue'
import { useGroupUnit } from '@/composables/useGroupUnit'

export default {
  props: {
    showModal: {
      type: Boolean,
      required: true
    }
  },
  emits: ['submit', 'close-modal'],
  setup(props, { emit }) {
    const { groupUnitList, getAllGroupUnit } = useGroupUnit()

    const form = ref({
      name: '',
      email: '',
      username: '',
      group_unit_id: '',
      password: '',
      password_confirmation: '',
      rules: ''
    })

    // Khi modal hiển thị thì reset form + load đơn vị
    watch(() => props.showModal, async (visible) => {
      if (visible) {
        await getAllGroupUnit()
        form.value = {
          name: '',
          email: '',
          username: '',
          group_unit_id: '',
          password: '',
          password_confirmation: '',
          rules: ''
        }
        document.body.classList.add('modal-open')
      } else {
        document.body.classList.remove('modal-open')
      }
    })

    const handleSubmit = () => {
      console.log('Form gửi:', form.value)
      emit('submit', { ...form.value })
    }

    const closeModal = () => {
      emit('close-modal')
    }

    return {
      form,
      groupUnitList,
      handleSubmit,
      closeModal
    }
  }
}
</script>
