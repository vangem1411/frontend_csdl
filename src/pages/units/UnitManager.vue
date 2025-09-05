<template>
  <div>
    <div class="page-title">
      <div class="title_left"><h3>Quản lý nhóm địa bàn</h3></div>
      <div class="title_right">
        <div class="col-md-5 form-group pull-right top_search">
          <div class="input-group">
            <input
              v-model="search"
              type="text"
              class="form-control"
              placeholder="Tìm kiếm nhóm địa bàn"
              @input="applySearchDebounced"
              @keyup.enter="page = 1"
            />
            <span class="input-group-btn">
              <button class="btn btn-secondary" @click="page = 1">Tìm</button>
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="clearfix"></div>

    <div class="row">
      <div class="col-md-12 col-sm-12">
        <div class="x_panel">
          <div class="x_title">
            <h2>Dữ liệu <small>địa bàn</small></h2>
            <ul class="nav navbar-right panel_toolbox">
              <li><a class="collapse-link"><i class="fa fa-chevron-up"></i></a></li>
              <li><a class="close-link"><i class="fa fa-close"></i></a></li>
            </ul>
            <div class="clearfix"></div>
          </div>

          <!-- Nút + BỘ LỌC -->
          <div class="d-flex align-items-center mb-3 flex-wrap form-inline">
            <button class="btn btn-success mr-2 mb-2" @click="showCreateModal = true">
              Thêm nhóm địa bàn
            </button>

            <!-- Filter: Tên đơn vị -->
            <select
              class="form-control mr-2 mb-2"
              style="width:auto; min-width:220px"
              v-model="filters.unitName"
              @change="page = 1"
            >
              <option value="">Tên đơn vị (tất cả)</option>
              <option v-for="n in unitNameOptions" :key="n" :value="n">{{ n }}</option>
            </select>

            <!-- Filter: Trạng thái -->
            <select
              class="form-control mr-2 mb-2"
              style="width:auto"
              v-model="filters.status"
              @change="page = 1"
            >
              <option value="">Trạng thái (tất cả)</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Ngưng hoạt động</option>
            </select>

            <button class="btn btn-outline-secondary mb-2" @click="resetFilters">Xóa lọc</button>
          </div>

          <div class="x_content position-relative">
            <!-- Thanh công cụ đồng bộ DataTables -->
            <div class="row mb-3">
              <div class="col-md-3">
                <label class="mr-2">Xem</label>
                <select class="form-control d-inline-block" style="width:auto" v-model.number="perPage">
                  <option :value="10">10</option>
                  <option :value="25">25</option>
                  <option :value="50">50</option>
                  <option :value="100">100</option>
                </select>
                <span class="ml-2">mục</span>
              </div>

              <div class="col-md-6 text-center">
                <div class="btn-group">
                  <button class="btn btn-sm btn-secondary" @click="exportCopy">Copy</button>
                  <button class="btn btn-sm btn-success"   @click="exportExcel">Excel</button>
                  <button class="btn btn-sm btn-info"      @click="exportCSV">CSV</button>
                  <button class="btn btn-sm btn-danger"    @click="exportPDF">PDF</button>
                  <button class="btn btn-sm btn-dark"      @click="window.print()">Print</button>
                </div>
              </div>

              <div class="col-md-3">
                <div class="input-group">
                  <input
                    v-model="search"
                    type="text"
                    class="form-control"
                    placeholder="Tìm"
                    @input="applySearchDebounced"
                    @keyup.enter="page = 1"
                  />
                  <span class="input-group-btn">
                    <button class="btn btn-secondary" @click="page = 1">Tìm</button>
                  </span>
                </div>
              </div>
            </div>

            <!-- Overlay processing -->
            <div v-if="loading" class="dt-processing-overlay">
              <div class="dt-processing-box">Đang xử lý...</div>
            </div>

            <div v-if="loadError" class="text-danger mb-2">{{ loadError }}</div>

            <div class="table-responsive">
              <table class="table table-striped table-bordered" style="width:100%">
                <thead>
                  <tr>
                    <th style="width:70px">STT</th>
                    <th>Tên đơn vị</th>
                    <th>Mô tả</th>
                    <th>Trạng thái</th>
                    <th style="width:200px">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="pagedUnits.length === 0 && !loading">
                    <td colspan="5" class="text-center text-muted">Không có dữ liệu</td>
                  </tr>
                  <tr v-for="(u, idx) in pagedUnits" :key="u.id">
                    <td>{{ startIndex + idx + 1 }}</td>
                    <td>{{ u.name }}</td>
                    <td>{{ u.description }}</td>
                    <td><span :class="['badge', badgeClass(u.status)]">{{ u.status || '—' }}</span></td>
                    <td>
                      <button class="btn btn-info btn-sm mr-1" @click="onView(u.id)" title="Xem">
                        <i class="fa fa-eye"></i>
                      </button>
                      <button class="btn btn-warning btn-sm mr-1" @click="onEdit(u.id)" title="Sửa">
                        <i class="fa fa-pencil"></i>
                      </button>
                      <button class="btn btn-danger btn-sm" @click="onAskDelete(u.id)" title="Xóa">
                        <i class="fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Phân trang -->
            <nav v-if="totalPages > 1 && !loading" aria-label="Units pagination">
              <ul class="pagination justify-content-end flex-wrap">
                <li class="page-item" :class="{ disabled: page === 1 }">
                  <button class="page-link" @click="goTo(page - 1)" :disabled="page === 1">«</button>
                </li>
                <li
                  v-for="p in pageNumbers"
                  :key="p.key"
                  class="page-item"
                  :class="{ active: p.num === page, disabled: p.sep }"
                >
                  <button class="page-link" v-if="!p.sep" @click="goTo(p.num)">{{ p.num }}</button>
                  <span class="page-link" v-else>…</span>
                </li>
                <li class="page-item" :class="{ disabled: page === totalPages }">
                  <button class="page-link" @click="goTo(page + 1)" :disabled="page === totalPages">»</button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <CreateUnitModal
      :showModal="showCreateModal"
      @submit="createUnit"
      @close-modal="showCreateModal = false"
    />
    <UnitUpdateForm
      v-if="showEditModal"
      :unitData="selectedGroupUnit"
      :showModal="showEditModal"
      @emit-update="updateUnit"
      @close-modal="showEditModal = false"
    />
    <UnitDetailModal
      v-if="showDetailModal"
      :unitData="selectedGroupUnit"
      :showModal="showDetailModal"
      @close-modal="showDetailModal = false"
    />
    <UnitDeleteConfirm
      v-if="showDeleteConfirmModal && selectedGroupUnit"
      :unitData="selectedGroupUnit"
      :showModal="showDeleteConfirmModal"
      @confirm-delete="deleteUnitConfirm"
      @close-modal="showDeleteConfirmModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import CreateUnitModal from './UnitFormCreate.vue'
import UnitDetailModal from './UnitDetail.vue'
import UnitDeleteConfirm from './UnitDeleteConfirm.vue'
import UnitUpdateForm from './UnitFormUpdate.vue'
import { useGroupUnit } from '@/composables/useGroupUnit'

const toast = useToast()
const search = ref('')

const {
  selectedGroupUnit,
  createGroupUnitApi,
  updateGroupUnitApi,
  deleteGroupUnitApi,
  getGroupUnitById
} = useGroupUnit()

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDetailModal = ref(false)
const showDeleteConfirmModal = ref(false)

/* ---------- STATE ---------- */
const units = ref([])
const loading = ref(false)
const loadError = ref('')

/* Bộ lọc */
const filters = ref({
  unitName: '',
  status: ''
})

/* danh sách tên đơn vị cho select */
const unitNameOptions = ref([])

/* Debug (ẩn mặc định) */
const showDebug = ref(false)
const lastFetch = ref({ url: '', status: '', error: '', snippet: '' })

/* tìm kiếm mượt + bỏ dấu */
const searchDebounced = ref('')
let _searchTimer = null
const norm = (s) =>
  String(s ?? '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
const applySearchDebounced = () => {
  clearTimeout(_searchTimer)
  _searchTimer = setTimeout(() => {
    searchDebounced.value = search.value
    page.value = 1
  }, 250)
}

/* ---------- PHÂN TRANG ---------- */
const page = ref(1)
const perPage = ref(10)

const filteredUnits = computed(() => {
  const kw = norm(searchDebounced.value)
  return units.value.filter(u => {
    const okKw = !kw || [u.name, u.description, u.status].some(v => norm(v).includes(kw))
    const okStatus =
      !filters.value.status ||
      (filters.value.status === 'active' && u.statusRaw === true) ||
      (filters.value.status === 'inactive' && u.statusRaw === false)
    const okName = !filters.value.unitName || u.name === filters.value.unitName
    return okKw && okStatus && okName
  })
})

const totalRows  = computed(() => filteredUnits.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalRows.value / perPage.value)))
const startIndex = computed(() => (page.value - 1) * perPage.value)
const endIndex   = computed(() => Math.min(totalRows.value, startIndex.value + perPage.value))
const pagedUnits = computed(() => filteredUnits.value.slice(startIndex.value, endIndex.value))

const pageNumbers = computed(() => {
  const cur = page.value, last = totalPages.value, win = 2, out=[]
  const push = n => out.push({ key:'p'+n, num:n }), sep = k => out.push({ key:k, sep:true })
  if (last <= 7) { for (let i=1;i<=last;i++) push(i); return out }
  push(1); if (cur > 3 + win) sep('a')
  for (let i=Math.max(2, cur-win); i<=Math.min(last-1, cur+win); i++) push(i)
  if (cur < last - (2+win)) sep('b'); push(last); return out
})
const goTo = (p) => { if (p>=1 && p<=totalPages.value) page.value = p }
watch([perPage, filteredUnits], () => { if (page.value > totalPages.value) page.value = 1 })
watch(filters, () => { page.value = 1 }, { deep: true })

/* ---------- LOAD DATA ---------- */
const extractRows = (json) => Array.isArray(json) ? json : (
  Array.isArray(json?.data) ? json.data :
  Array.isArray(json?.unitData) ? json.unitData :
  Array.isArray(json?.records) ? json.records :
  Array.isArray(json?.items) ? json.items :
  Array.isArray(json?.rows) ? json.rows :
  (json?.data?.data && Array.isArray(json.data.data) ? json.data.data :
  (json?.payload?.data && Array.isArray(json.payload.data) ? json.payload.data : []))
)

const loadUnits = async () => {
  loading.value = true
  loadError.value = ''
  lastFetch.value = { url: '', status: '', error: '', snippet: '' }

  try {
    const token = localStorage.getItem('token') || ''
    const headers = new Headers({ Accept: 'application/json' })
    if (token) headers.set('Authorization', 'Bearer ' + token)

    const urls = [
      '/api/groupunit',
      '/api/groupunits',
      '/api/group-unit',
      '/api/group_units',
      '/api/units/group',
      '/api/unit-groups'
    ]

    let rows = []
    for (const url of urls) {
      try {
        const res = await fetch(url, { headers, credentials: 'include' })
        const status = `${res.status} ${res.statusText}`
        const text = await res.text().catch(() => '')
        let json = null
        try { json = text ? JSON.parse(text) : null } catch {}
        const extracted = json ? extractRows(json) : []
        lastFetch.value = {
          url, status,
          error: res.ok ? '' : `HTTP ${status}`,
          snippet: (json ? JSON.stringify(json) : text || '(no body)').slice(0, 600)
        }
        if (res.ok && extracted.length) { rows = extracted; break }
      } catch (e) {
        lastFetch.value = { url, status: '(fetch error)', error: String(e?.message || e), snippet: '' }
      }
    }

    units.value = rows.map((r, i) => {
      const raw = typeof r.status === 'boolean' ? r.status : (String(r.status).toLowerCase() === 'true')
      return {
        id: r.id ?? r.unit_id ?? i,
        name: r.name ?? r.unit_name ?? '',
        description: r.description ?? r.note ?? '',
        statusRaw: raw,
        status: raw ? 'Hoạt động' : 'Ngưng hoạt động'
      }
    })

    unitNameOptions.value = Array.from(new Set(units.value.map(u => u.name))).sort((a,b)=>a.localeCompare(b))
    page.value = 1
    searchDebounced.value = search.value

    if (!units.value.length && !loadError.value) {
      loadError.value = 'Không nhận được dữ liệu hợp lệ từ API.'
    }
  } catch {
    loadError.value = 'Không thể tải dữ liệu (mạng/CORS/JSON).'
  } finally {
    loading.value = false
  }
}

/* ---------- CRUD ---------- */
const onView = async (id) => { await getGroupUnitById(id); showDetailModal.value = true }
const onEdit = async (id)  => { await getGroupUnitById(id); showEditModal.value  = true }
const onAskDelete = async (id) => { await getGroupUnitById(id); showDeleteConfirmModal.value = true }

const createUnit = async (unitData) => {
  try {
    await createGroupUnitApi(unitData)
    toast.success('Tạo đơn vị thành công!')
    showCreateModal.value = false
    await loadUnits()
  } catch { alert('Tạo đơn vị thất bại!') }
}

const updateUnit = async (unitData) => {
  try {
    if (!selectedGroupUnit.value?.id) return alert('Không tìm thấy đơn vị để cập nhật.')
    await updateGroupUnitApi(selectedGroupUnit.value.id, unitData)
    toast.success('Cập nhật thành công!')
    showEditModal.value = false
    await loadUnits()
  } catch (e) {
    if (e.response?.status === 422) {
      const msgs = Object.values(e.response.data.errors).flat().join('\n')
      alert('Cập nhật đơn vị thất bại:\n' + msgs)
    } else alert('Cập nhật đơn vị thất bại!')
  }
}

const deleteUnitConfirm = async () => {
  try {
    if (!selectedGroupUnit.value?.id) return alert('Không tìm thấy đơn vị để xóa.')
    await deleteGroupUnitApi(selectedGroupUnit.value.id)
    toast.warning('Xóa thành công!')
    showDeleteConfirmModal.value = false
    await loadUnits()
  } catch { alert('Xóa đơn vị thất bại!') }
}

onMounted(loadUnits)

/* ---------- UI helpers ---------- */
const badgeClass = (st) => {
  const s = norm(st)
  if (!s) return 'badge-secondary'
  if (/\b(ngung|ngừng|dung|dừng|inactive|off|false)\b/.test(s)) return 'badge-danger'
  if (/\b(hoat|hoạt|active|on|true)\b/.test(s)) return 'badge-success'
  return 'badge-info'
}

const resetFilters = () => {
  filters.value = { unitName: '', status: '' }
  search.value = ''
  searchDebounced.value = ''
  page.value = 1
}

/* ======= Export helpers ======= */
const tableHeaders = ['STT', 'Tên đơn vị', 'Mô tả', 'Trạng thái']
const currentRows = () => pagedUnits.value.map((u, i) => [
  startIndex.value + i + 1, u.name, u.description, u.status
])

const exportCopy = () => {
  const lines = [tableHeaders.join('\t'), ...currentRows().map(r => r.join('\t'))].join('\n')
  navigator.clipboard.writeText(lines)
  toast.success('Đã copy vào clipboard!')
}
const exportCSV = () => {
  const toCsv = (arr) => arr.map(row => row.map(v => `"${String(v).replaceAll('"','""')}"`).join(',')).join('\n')
  const csv = toCsv([tableHeaders, ...currentRows()])
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'units.csv'; a.click(); URL.revokeObjectURL(a.href)
}
const exportExcel = () => { exportCSV() }
const exportPDF = () => { window.print() }
</script>

<style scoped>
/* Overlay “Đang xử lý…” */
.x_content { position: relative; }
.dt-processing-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.6);
  z-index: 10;
}
.dt-processing-box {
  padding: 10px 16px;
  border-radius: 8px;
  background: #ffffff;
  color: #28a745;
  font-weight: 600;
  box-shadow: 0 6px 20px rgba(0,0,0,0.2);
  border: 2px solid #28a745;
}

.btn-group .btn + .btn { margin-left: 4px; }
</style>
