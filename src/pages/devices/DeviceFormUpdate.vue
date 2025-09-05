<template>
    <teleport to="body">
      <div v-if="showModal">
        <div
          class="modal fade show d-block"
          tabindex="-1"
          aria-labelledby="updateDeviceModalLabel"
          aria-modal="true"
          role="dialog"
        >
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <!-- Header -->
              <div class="modal-header alert-warning">
                <h5 class="modal-title" id="updateDeviceModalLabel">Cập nhật thiết bị</h5>
                <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
              </div>
  
              <!-- Body -->
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
  
                  <!-- === NGÀY MUA === -->
                  <div class="mb-3">
                    <label class="form-label">Ngày mua:</label>
                    <div class="input-group">
                      <!-- Date picker -->
                      <input
                        v-if="usePicker.purchase_date"
                        type="date"
                        class="form-control"
                        id="purchase_date"
                        v-model="form.purchase_date"
                        @input="syncTextFromForm('purchase_date')"
                      />
                      <!-- Nhập tay -->
                      <input
                        v-else
                        type="text"
                        class="form-control"
                        placeholder="YYYY-MM-DD hoặc DD/MM/YYYY"
                        v-model="dateText.purchase_date"
                        @blur="applyTextToForm('purchase_date')"
                      />
                      <button type="button" class="btn btn-outline-secondary" @click="toggleMode('purchase_date')">
                        {{ usePicker.purchase_date ? 'Nhập tay' : 'Chọn ngày' }}
                      </button>
                    </div>
                    <small class="text-muted">Chấp nhận: <code>YYYY-MM-DD</code> hoặc <code>DD/MM/YYYY</code></small>
                  </div>
  
                  <!-- === HẾT HẠN BẢO HÀNH === -->
                  <div class="mb-3">
                    <label class="form-label">Ngày hết hạn bảo hành:</label>
                    <div class="input-group">
                      <!-- Date picker -->
                      <input
                        v-if="usePicker.warranty_expiry"
                        type="date"
                        class="form-control"
                        id="warranty_expiry"
                        v-model="form.warranty_expiry"
                        @input="syncTextFromForm('warranty_expiry')"
                      />
                      <!-- Nhập tay -->
                      <input
                        v-else
                        type="text"
                        class="form-control"
                        placeholder="YYYY-MM-DD hoặc DD/MM/YYYY"
                        v-model="dateText.warranty_expiry"
                        @blur="applyTextToForm('warranty_expiry')"
                      />
                      <button type="button" class="btn btn-outline-secondary" @click="toggleMode('warranty_expiry')">
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
  
                  <!-- Footer -->
                  <div class="modal-footer px-0 pb-0">
                    <button type="button" class="btn btn-secondary" @click="closeModal">Hủy</button>
                    <button type="submit" class="btn btn-primary">Cập nhật</button>
                  </div>
                </form>
              </div>
              <!-- /Body -->
            </div>
          </div>
        </div>
  
        <!-- backdrop -->
        <div class="modal-backdrop fade show"></div>
      </div>
    </teleport>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  import { useGroupUnit } from '@/composables/useGroupUnit'
  
  /* PROPS */
  const props = defineProps({
    deviceData: { type: Object, default: () => ({}) },
    showModal: { type: Boolean, required: true }
  })
  
  /* EMITS */
  const emit = defineEmits(['emit-update-device', 'close-modal'])
  
  const { groupUnitList, getAllGroupUnit } = useGroupUnit()
  
  /* STATE FORM (đúng các trường của thiết bị) */
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
  
  /* Toggle chế độ chọn/ngập tay cho 2 trường ngày */
  const usePicker = ref({
    purchase_date: true,
    warranty_expiry: true
  })
  
  /* Text nhập tay cho 2 trường ngày */
  const dateText = ref({
    purchase_date: '',
    warranty_expiry: ''
  })
  
  /* Utils: parse YYYY-MM-DD hoặc DD/MM/YYYY -> YYYY-MM-DD */
  const toISO = (text) => {
    if (!text) return ''
    const s = String(text).trim()
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s
    const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
    if (m) {
      const dd = m[1].padStart(2, '0')
      const mm = m[2].padStart(2, '0')
      const yyyy = m[3]
      return `${yyyy}-${mm}-${dd}`
    }
    return ''
  }
  
  /* Khi đang nhập tay -> blur thì convert và gán vào form */
  const applyTextToForm = (field) => {
    const iso = toISO(dateText.value[field])
    if (iso) form.value[field] = iso
  }
  
  /* Khi chọn bằng date picker, sync lại text (để switch mode vẫn thấy giá trị) */
  const syncTextFromForm = (field) => {
    dateText.value[field] = form.value[field] || ''
  }
  
  /* Chuyển chế độ cho một field ngày */
  const toggleMode = (field) => {
    usePicker.value[field] = !usePicker.value[field]
    if (!usePicker.value[field]) {
      // khi chuyển sang nhập tay thì hiển thị giá trị sẵn có
      dateText.value[field] = form.value[field] || ''
    }
  }
  
  /* Khi mở modal: load đơn vị (nếu cần) */
  watch(
    () => props.showModal,
    async (v) => {
      if (v) {
        await getAllGroupUnit()
      }
    },
    { immediate: true }
  )
  
  /* Nhận dữ liệu thiết bị từ props -> form */
  watch(
    () => props.deviceData,
    (d) => {
      if (!d) return
      form.value = {
        device_code: d.device_code ?? '',
        name: d.name ?? '',
        category: d.category ?? '',
        brand: d.brand ?? '',
        model: d.model ?? '',
        serial_number: d.serial_number ?? '',
        purchase_date: d.purchase_date ?? '',
        warranty_expiry: d.warranty_expiry ?? '',
        status: d.status ?? '',
        location: d.location ?? '',
        assigned_to: d.assigned_to ?? '',
        description: d.description ?? '',
        group_unit_id: d.group_unit_id ?? ''
      }
      // đồng bộ text khi nhận dữ liệu
      syncTextFromForm('purchase_date')
      syncTextFromForm('warranty_expiry')
    },
    { immediate: true }
  )
  
  /* Submit */
  function handleSubmit() {
    // đảm bảo nếu đang nhập tay mà chưa blur vẫn parse
    if (!usePicker.value.purchase_date) applyTextToForm('purchase_date')
    if (!usePicker.value.warranty_expiry) applyTextToForm('warranty_expiry')
  
    emit('emit-update-device', { ...form.value })
  }
  
  /* Close */
  function closeModal() {
    emit('close-modal')
  }
  </script>
  
  <style scoped>
  .modal { z-index: 1055; }
  .modal-backdrop { z-index: 1050; }
  </style>
  