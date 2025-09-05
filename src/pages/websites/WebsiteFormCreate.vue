<template>
    <div>
      <div :class="['modal', 'fade', 'bs-example-modal-lg', { 'show d-block': showModal }]" tabindex="-1"
        aria-labelledby="createWebsiteModalLabel" :aria-hidden="!showModal">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header alert-success">
              <h5 class="modal-title" id="createWebsiteModalLabel">Thêm trang web</h5>
              <button type="button" class="btn-close" @click="closeModal" aria-label="Close">&times;</button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="handleSubmit">
                <div class="mb-3">
                  <label for="name" class="form-label">Tên:</label>
                  <input type="text" class="form-control" id="name" v-model="form.name" required />
                </div>
                <div class="mb-3">
                  <label for="url" class="form-label">Url:</label>
                  <input type="text" class="form-control" id="url" v-model="form.url" required />
                </div>
                <div class="mb-3">
                  <label for="description" class="form-label">Mô tả:</label>
                  <input type="text" class="form-control" id="description" v-model="form.description" required />
                </div>
                <div class="mb-3">
                  <label for="status" class="form-label">Trạng thái:</label>
                  <input type="text" class="form-control" id="status" v-model="form.status" required />
                </div>
                <div class="mb-3">
                  <label for="is_defaced" class="form-label">Defaced:</label>
                  <input type="text" class="form-control" id="is_defaced" v-model="form.status" required />
                </div>
                <div class="mb-3">
                  <label for="has_security_issue" class="form-label">Lỗ hổng bảo mật:</label>
                  <input type="text" class="form-control" id="has_security_issue" v-model="form.has_security_issue" required />
                </div>
                <div class="mb-3">
                  <label for="snapshot_html" class="form-label">Snapshot:</label>
                  <input type="text" class="form-control" id="snapshot_html" v-model="form.snapshot_html" required />
                </div>
                <div class="mb-3">
                  <label for="note" class="form-label">Ghi chú:</label>
                  <input type="text" class="form-control" id="note" v-model="form.note" required />
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
        url: '',
        description: '',
        status:'',
        is_defaced: '',
        has_security_issue: '',
        snapshot_html:'',
        note:'',
        group_unit_id: '',
        
      })
  
      // Khi modal hiển thị thì reset form + load đơn vị
      watch(() => props.showModal, async (visible) => {
        if (visible) {
          await getAllGroupUnit()
          form.value = {
            name: '',
            url: '',
            description: '',
            status:'',
            is_defaced: '',
            has_security_issue: '',
            snapshot_html:'',
            note:'',
            group_unit_id: '',
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
  