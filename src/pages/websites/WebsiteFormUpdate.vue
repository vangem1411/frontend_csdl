<template>
  <teleport to="body">
    <div v-if="showModal">
      <div
        class="modal fade show d-block"
        tabindex="-1"
        aria-labelledby="updateWebsiteModalLabel"
        aria-modal="true"
        role="dialog"
      >
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <!-- Header -->
            <div class="modal-header alert-warning">
              <h5 class="modal-title" id="updateWebsiteModalLabel">Cập nhật trang web</h5>
              <!-- nút đóng dạng X -->
              <button type="button" class="btn btn-link text-dark p-0 m-0" @click="closeModal" aria-label="Close">
                <i class="fa fa-times fa-lg"></i>
              </button>
            </div>

            <!-- Body -->
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
                  <input type="text" class="form-control" id="description" v-model="form.description" />
                </div>

                <div class="mb-3">
                  <label for="status" class="form-label">Trạng thái:</label>
                  <input type="text" class="form-control" id="status" v-model="form.status" />
                </div>

                <div class="mb-3 form-check">
                  <input type="checkbox" class="form-check-input" id="is_defaced" v-model="form.is_defaced" />
                  <label class="form-check-label" for="is_defaced">Defaced</label>
                </div>

                <div class="mb-3 form-check">
                  <input
                    type="checkbox"
                    class="form-check-input"
                    id="has_security_issue"
                    v-model="form.has_security_issue"
                  />
                  <label class="form-check-label" for="has_security_issue">Lỗ hổng bảo mật</label>
                </div>

                <div class="mb-3">
                  <label for="snapshot_html" class="form-label">Snapshot (HTML):</label>
                  <textarea class="form-control" id="snapshot_html" rows="4" v-model="form.snapshot_html"></textarea>
                </div>

                <div class="mb-3">
                  <label for="note" class="form-label">Ghi chú:</label>
                  <input type="text" class="form-control" id="note" v-model="form.note" />
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

// PROPS (kebab-case ở template cha)
const props = defineProps({
  websiteData: { type: Object, default: () => ({}) },
  showModal: { type: Boolean, required: true }
})

// EMITS — khai báo để không cảnh báo
const emit = defineEmits(['emit-update-website', 'close-modal'])

const { groupUnitList, getAllGroupUnit } = useGroupUnit()

const form = ref({
  name: '',
  url: '',
  description: '',
  status: '',
  is_defaced: false,
  has_security_issue: false,
  snapshot_html: '',
  note: '',
  group_unit_id: ''
})

// Load danh sách đơn vị khi mở modal
watch(
  () => props.showModal,
  async v => {
    if (v) await getAllGroupUnit()
  },
  { immediate: true }
)

// Nhận dữ liệu website vào form
watch(
  () => props.websiteData,
  w => {
    if (!w) return
    form.value = {
      name: w.name ?? '',
      url: w.url ?? '',
      description: w.description ?? '',
      status: w.status ?? '',
      is_defaced: Boolean(w.is_defaced),
      has_security_issue: Boolean(w.has_security_issue),
      snapshot_html: w.snapshot_html ?? '',
      note: w.note ?? '',
      group_unit_id: w.group_unit_id ?? ''
    }
  },
  { immediate: true }
)

function handleSubmit() {
  emit('emit-update-website', { ...form.value })
}
function closeModal() {
  emit('close-modal')
}
</script>

<style scoped>
.modal { z-index: 1055; }
.modal-backdrop { z-index: 1050; }
</style>
