<template>
  <div>
    <div :class="['modal', 'fade', 'bs-example-modal-lg', { 'show d-block': showModal }]" tabindex="-1"
      aria-labelledby="updateUserModalLabel" :aria-hidden="!showModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header alert-warning">
            <h5 class="modal-title" id="updateUserModalLabel">Cập nhật người dùng</h5>
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
              <!-- <div class="mb-3">
                <label for="unit" class="form-label">Tài khoản:</label>
                <input type="text" class="form-control" id="unit" v-model="form.group_unit_name" required />
              </div> -->
              <div class="mb-3">
                <label for="unit" class="form-label">Đơn vị:</label>
                <select v-model="form.group_unit_id" class="form-control">
                  <option disabled value="">-- Chọn đơn vị --</option>
                  <option v-for="unit in groupUnitList" :key="unit.id" :value="unit.id">
                    {{ unit.name }}
                  </option>
                </select>
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

<script>
import { ref, watch, onMounted } from 'vue';
import { useGroupUnit } from '@/composables/useGroupUnit';

export default {
  name: 'UpdateForm',
  props: {
    userData: {
      type: Object,
      default: () => ({}),
    },
    showModal: {
      type: Boolean,
      required: true,
    }
  },
  setup(props, { emit }) {
    const { groupUnitList, getAllGroupUnit } = useGroupUnit();

    const form = ref({
      name: '',
      email: '',
      username: '',
      rules: '',
      group_unit_id: null
    });

    // Lấy danh sách đơn vị khi mở modal
    watch(() => props.showModal, async (val) => {
      if (val) {
        document.body.classList.add('modal-open');
        await getAllGroupUnit(); // load danh sách đơn vị
      } else {
        document.body.classList.remove('modal-open');
      }
    });

    // Gán dữ liệu người dùng khi modal mở
    watch(() => props.userData, (newVal) => {
      if (newVal && newVal.id) {
        form.value = {
          name: newVal.name || '',
          email: newVal.email || '',
          username: newVal.username || '',
          rules: newVal.rules || '',
          group_unit_id: newVal.group_unit_id || null
        };
      }
    }, { immediate: true });

    const handleSubmit = () => {
      emit('emit-update-user', { ...form.value });
    };

    const closeModal = () => {
      emit('close-modal');
    };

    return {
      form,
      groupUnitList,
      handleSubmit,
      closeModal
    };
  }
};
</script>
