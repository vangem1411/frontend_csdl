<template>
    <div>
      <div
        :class="['modal', 'fade', 'bs-example-modal-lg', { show: showModal, 'd-block': showModal }]"
        tabindex="-1"
        aria-labelledby="createDeviceModalLabel"
        :aria-hidden="!showModal"
      >
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header alert-success">
              <h5 class="modal-title" id="createDeviceModalLabel">Thêm thiết bị</h5>
              <button type="button" class="btn-close" @click="closeModal" aria-label="Close">&times;</button>
            </div>
  
            <div class="modal-body">
              <form @submit.prevent="handleSubmit">
                <div class="mb-3">
                  <label for="device_code" class="form-label">Mã thiết bị:</label>
                  <input type="text" class="form-control" id="device_code" v-model="form.device_code" required />
                </div>
  
                <div class="mb-3">
                  <label for="name" class="form-label">Tên:</label>
                  <input type="text" class="form-control" id="name" v-model="form.name" required />
                </div>
  
                <div class="mb-3">
                  <label for="category" class="form-label">Loại:</label>
                  <input type="text" class="form-control" id="category" v-model="form.category" />
                </div>
  
                <div class="mb-3">
                  <label for="brand" class="form-label">Thương hiệu:</label>
                  <input type="text" class="form-control" id="brand" v-model="form.brand" />
                </div>
  
                <div class="mb-3">
                  <label for="model" class="form-label">Mẫu:</label>
                  <input type="text" class="form-control" id="model" v-model="form.model" />
                </div>
  
                <div class="mb-3">
                  <label for="serial_number" class="form-label">Số Seri:</label>
                  <input type="text" class="form-control" id="serial_number" v-model="form.serial_number" />
                </div>
  
                <!-- === NGÀY MUA: chọn hoặc nhập tay === -->
                <div class="mb-3">
                  <label class="form-label">Ngày mua:</label>
                  <div class="input-group">
                    <!-- Chế độ chọn ngày -->
                    <input
                      v-if="usePicker.purchase_date"
                      type="date"
                      class="form-control"
                      :id="'purchase_date'"
                      v-model="form.purchase_date"
                      @input="syncTextFromForm('purchase_date')"
                    />
                    <!-- Chế độ nhập tay -->
                    <input
                      v-else
                      type="text"
                      class="form-control"
                      placeholder="YYYY-MM-DD hoặc DD/MM/YYYY"
                      v-model="dateText.purchase_date"
                      @blur="applyTextToForm('purchase_date')"
                    />
                    <button
                      type="button"
                      class="btn btn-outline-secondary"
                      @click="toggleMode('purchase_date')"
                    >
                      {{ usePicker.purchase_date ? 'Nhập tay' : 'Chọn ngày' }}
                    </button>
                  </div>
                  <small class="text-muted">Chấp nhận: <code>YYYY-MM-DD</code> hoặc <code>DD/MM/YYYY</code></small>
                </div>
  
                <!-- === NGÀY HẾT HẠN BẢO HÀNH: chọn hoặc nhập tay === -->
                <div class="mb-3">
                  <label class="form-label">Ngày hết hạn bảo hành:</label>
                  <div class="input-group">
                    <!-- Chế độ chọn ngày -->
                    <input
                      v-if="usePicker.warranty_expiry"
                      type="date"
                      class="form-control"
                      :id="'warranty_expiry'"
                      v-model="form.warranty_expiry"
                      @input="syncTextFromForm('warranty_expiry')"
                    />
                    <!-- Chế độ nhập tay -->
                    <input
                      v-else
                      type="text"
                      class="form-control"
                      placeholder="YYYY-MM-DD hoặc DD/MM/YYYY"
                      v-model="dateText.warranty_expiry"
                      @blur="applyTextToForm('warranty_expiry')"
                    />
                    <button
                      type="button"
                      class="btn btn-outline-secondary"
                      @click="toggleMode('warranty_expiry')"
                    >
                      {{ usePicker.warranty_expiry ? 'Nhập tay' : 'Chọn ngày' }}
                    </button>
                  </div>
                  <small class="text-muted">Chấp nhận: <code>YYYY-MM-DD</code> hoặc <code>DD/MM/YYYY</code></small>
                </div>
  
                <div class="mb-3">
                  <label for="status" class="form-label">Trạng thái:</label>
                  <input type="text" class="form-control" id="status" v-model="form.status" />
                </div>
  
                <div class="mb-3">
                  <label for="location" class="form-label">Vị trí:</label>
                  <input type="text" class="form-control" id="location" v-model="form.location" />
                </div>
  
                <div class="mb-3">
                  <label for="assigned_to" class="form-label">Cấp cho ai:</label>
                  <input type="text" class="form-control" id="assigned_to" v-model="form.assigned_to" />
                </div>
  
                <div class="mb-3">
                  <label for="description" class="form-label">Mô tả:</label>
                  <input type="text" class="form-control" id="description" v-model="form.description" />
                </div>
  
                <div class="mb-3">
                  <label for="unit" class="form-label">Đơn vị:</label>
                  <select v-model="form.group_unit_id" id="unit" class="form-control">
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
  import { ref, watch } from 'vue'
  import { useGroupUnit } from '@/composables/useGroupUnit'
  
  export default {
    props: {
      showModal: { type: Boolean, required: true }
    },
    emits: ['submit', 'close-modal'],
    setup(props, { emit }) {
      const { groupUnitList, getAllGroupUnit } = useGroupUnit()
  
      const form = ref({
        device_code: '',
        name: '',
        category: '',
        brand: '',
        model: '',
        serial_number: '',
        purchase_date: '',
        warranty_expiry: '',
        status: '',
        location: '',
        assigned_to: '',
        description: '',
        group_unit_id: ''
      })
  
      // Chế độ hiển thị cho từng trường ngày
      const usePicker = ref({
        purchase_date: true,
        warranty_expiry: true
      })
  
      // Text nhập tay cho từng trường ngày
      const dateText = ref({
        purchase_date: '',
        warranty_expiry: ''
      })
  
      // Utils: parse "YYYY-MM-DD" hoặc "DD/MM/YYYY" -> "YYYY-MM-DD"
      const toISO = (text) => {
        if (!text) return ''
        const s = String(text).trim()
        // YYYY-MM-DD
        if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s
        // DD/MM/YYYY
        const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
        if (m) {
          const dd = m[1].padStart(2, '0')
          const mm = m[2].padStart(2, '0')
          const yyyy = m[3]
          return `${yyyy}-${mm}-${dd}`
        }
        return '' // không hợp lệ
      }
  
      // Khi đang ở mode nhập tay -> blur thì convert sang ISO và gán vào form
      const applyTextToForm = (field) => {
        const iso = toISO(dateText.value[field])
        if (iso) {
          form.value[field] = iso
        } // nếu rỗng/không hợp lệ thì giữ nguyên để user sửa tiếp
      }
  
      // Khi chọn bằng date picker, sync lại text hiển thị (để đổi qua nhập tay vẫn thấy giá trị)
      const syncTextFromForm = (field) => {
        dateText.value[field] = form.value[field] || ''
      }
  
      const toggleMode = (field) => {
        usePicker.value[field] = !usePicker.value[field]
        // khi chuyển sang nhập tay, hiển thị giá trị đang có
        if (!usePicker.value[field]) {
          dateText.value[field] = form.value[field] || ''
        }
      }
  
      // Reset form + load đơn vị khi mở modal
      watch(
        () => props.showModal,
        async (visible) => {
          if (visible) {
            await getAllGroupUnit()
            form.value = {
              device_code: '',
              name: '',
              category: '',
              brand: '',
              model: '',
              serial_number: '',
              purchase_date: '',
              warranty_expiry: '',
              status: '',
              location: '',
              assigned_to: '',
              description: '',
              group_unit_id: ''
            }
            // reset mode & text
            usePicker.value = { purchase_date: true, warranty_expiry: true }
            dateText.value = { purchase_date: '', warranty_expiry: '' }
            document.body.classList.add('modal-open')
          } else {
            document.body.classList.remove('modal-open')
          }
        }
      )
  
      const handleSubmit = () => {
        // đảm bảo nếu người dùng đang ở mode nhập tay mà chưa blur, ta vẫn parse
        if (!usePicker.value.purchase_date) applyTextToForm('purchase_date')
        if (!usePicker.value.warranty_expiry) applyTextToForm('warranty_expiry')
  
        emit('submit', { ...form.value })
      }
  
      const closeModal = () => {
        emit('close-modal')
      }
  
      return {
        form,
        groupUnitList,
        usePicker,
        dateText,
        toggleMode,
        applyTextToForm,
        syncTextFromForm,
        handleSubmit,
        closeModal
      }
    }
  }
  </script>
  