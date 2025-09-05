<template>
  <div>
    <div class="page-title">
      <div class="title_left"><h3>Quản lý thiết bị</h3></div>
      <div class="title_right">
        <div class="col-md-5 form-group pull-right top_search">
          <div class="input-group">
            <input v-model="search" type="text" class="form-control" placeholder="Tìm kiếm" @keyup.enter="goFirstPage" />
            <span class="input-group-btn">
              <button class="btn btn-secondary" @click="goFirstPage">Tìm</button>
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
            <h2>Dữ liệu <small>thiết bị</small></h2>
            <ul class="nav navbar-right panel_toolbox">
              <li><a class="collapse-link"><i class="fa fa-chevron-up"></i></a></li>
              <li><a class="close-link"><i class="fa fa-close"></i></a></li>
            </ul>
            <div class="clearfix"></div>
          </div>

          <!-- Nút + Bộ lọc -->
          <div class="d-flex align-items-center mb-3 flex-wrap form-inline">
            <button class="btn btn-success mr-2 mb-2" @click="showCreateModal = true">Thêm thiết bị</button>

            <select class="form-control mr-2 mb-2" style="width:auto" v-model="filters.group_unit_id" @change="goFirstPage">
              <option value="">Nhóm đơn vị (tất cả)</option>
              <option v-for="g in groupUnitList" :key="g.id" :value="g.id">{{ g.name }}</option>
            </select>

            <select class="form-control mr-2 mb-2" style="width:auto" v-model="filters.category" @change="goFirstPage">
              <option value="">Loại (tất cả)</option>
              <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
            </select>

            <select class="form-control mr-2 mb-2" style="width:auto" v-model="filters.brand" @change="goFirstPage">
              <option value="">Thương hiệu (tất cả)</option>
              <option v-for="b in brands" :key="b" :value="b">{{ b }}</option>
            </select>

            <button class="btn btn-outline-secondary mb-2" @click="resetFilters">Xóa lọc</button>
          </div>

          <!-- Bảng -->
          <div class="x_content">
            <!-- Toolbar -->
            <div class="row mb-3" v-if="!loading">
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
                  <input v-model="search" type="text" class="form-control" placeholder="Tìm" @keyup.enter="goFirstPage" />
                  <span class="input-group-btn">
                    <button class="btn btn-secondary" @click="goFirstPage">Tìm</button>
                  </span>
                </div>
              </div>
            </div>

            <!-- Overlay -->
            <div v-if="loading" class="dt-processing-overlay">
              <div class="dt-processing-box">Đang xử lý...</div>
            </div>

            <div class="table-responsive">
              <table class="table table-striped table-bordered" style="width:100%">
                <thead>
                  <tr>
                    <th style="width:70px">STT</th>
                    <th>Mã thiết bị</th>
                    <th>Tên</th>
                    <th>Loại</th>
                    <th>Thương hiệu</th>
                    <th>Mẫu</th>
                    <th>Số sê-ri</th>
                    <th style="width:200px">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="pagedDevices.length === 0 && !loading">
                    <td colspan="8" class="text-center text-muted">Không có dữ liệu</td>
                  </tr>
                  <tr v-for="(row, idx) in pagedDevices" :key="row.id">
                    <td>{{ startIndex + idx + 1 }}</td>
                    <td>{{ row.device_code }}</td>
                    <td>{{ row.name }}</td>
                    <td>{{ row.category }}</td>
                    <td>{{ row.brand }}</td>
                    <td>{{ row.model }}</td>
                    <td>{{ row.serial_number }}</td>
                    <td>
                      <button class="btn btn-info btn-sm mr-1" @click="onView(row.id)" title="Xem">
                        <i class="fa fa-eye"></i>
                      </button>
                      <button class="btn btn-warning btn-sm mr-1" @click="onEdit(row.id)" title="Sửa">
                        <i class="fa fa-pencil"></i>
                      </button>
                      <button class="btn btn-danger btn-sm" @click="onDelete(row.id)" title="Xóa">
                        <i class="fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Phân trang -->
            <nav v-if="totalPages > 1 && !loading" aria-label="Device pagination">
              <ul class="pagination justify-content-end flex-wrap">
                <li class="page-item" :class="{ disabled: page === 1 }">
                  <button class="page-link" @click="goTo(page - 1)" :disabled="page === 1">«</button>
                </li>
                <li v-for="p in pageNumbers" :key="p.key" class="page-item" :class="{ active: p.num === page, disabled: p.sep }">
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
    <FormCreate v-if="showCreateModal" :showModal="showCreateModal" @submit="createDevice" @close-modal="showCreateModal = false" />
    <FormUpdate v-if="showEditModal" :deviceData="selectedDevice" :showModal="showEditModal" @emit-update-device="updateDevice" @close-modal="showEditModal = false" />
    <DeviceDetailModal v-if="showDetailModal && selectedDevice" :deviceData="selectedDevice" :showModal="showDetailModal" @close-modal="showDetailModal = false" />
    <DeviceDeleteConfirm v-if="showDeleteConfirmModal && selectedDevice" :deviceData="selectedDevice" :showModal="showDeleteConfirmModal" @confirm-delete="deleteDeviceConfirm" @close-modal="showDeleteConfirmModal = false" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import FormCreate from './DeviceFormCreate.vue'
import FormUpdate from './DeviceFormUpdate.vue'
import DeviceDetailModal from './DeviceDetail.vue'
import DeviceDeleteConfirm from './DeviceDeleteConfirm.vue'
import { useDevice } from '@/composables/useDevice'
import { useGroupUnit } from '@/composables/useGroupUnit'
import { useToast } from 'vue-toastification'

const toast = useToast()
const search = ref('')

const { selectedDevice, getDeviceById, deleteDeviceApi, createDeviceApi, updateDeviceApi } = useDevice()
const { groupUnitList, getAllGroupUnit } = useGroupUnit()

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDetailModal = ref(false)
const showDeleteConfirmModal = ref(false)

const loading = ref(false)

const devices = ref([])
const filters = ref({ group_unit_id: '', category: '', brand: '' })
const categories = ref([])
const brands = ref([])

/* Phân trang */
const page = ref(1)
const perPage = ref(10)

const extractRows = (json) => {
  if (Array.isArray(json)) return json
  if (Array.isArray(json.data)) return json.data
  if (json?.data && Array.isArray(json.data.data)) return json.data.data
  if (Array.isArray(json.items)) return json.items
  if (Array.isArray(json.records)) return json.records
  return []
}

const loadDevices = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('token') || ''
    const headers = { Accept: 'application/json' }
    if (token) headers.Authorization = 'Bearer ' + token
    const urls = [
      '/api/device?start=0&length=100000&draw=1',
      '/api/device?length=100000&start=0',
      '/api/device'
    ]
    let rows = []
    for (const url of urls) {
      try {
        const res = await fetch(url, { headers })
        if (!res?.ok) continue
        const json = await res.json()
        rows = extractRows(json)
        if (rows.length) break
      } catch {}
    }

    devices.value = rows.map((d, i) => ({
      id: d.id ?? d.device_id ?? i,
      device_code: d.device_code ?? d.code ?? '',
      name: d.name ?? d.device_name ?? '',
      category: d.category ?? d.type ?? '',
      brand: d.brand ?? '',
      model: d.model ?? '',
      serial_number: d.serial_number ?? d.serial ?? '',
      group_unit_id: d.group_unit_id ?? d.groupId ?? ''
    }))

    const setCat = new Set(), setBrand = new Set()
    devices.value.forEach(d => { if (d.category) setCat.add(d.category); if (d.brand) setBrand.add(d.brand) })
    categories.value = Array.from(setCat)
    brands.value = Array.from(setBrand)
    page.value = 1
  } finally {
    loading.value = false
  }
}

/* Lọc */
const filteredDevices = computed(() => {
  const kw = (search.value || '').toLowerCase().trim()
  return devices.value.filter(d => {
    const okGroup = !filters.value.group_unit_id || String(d.group_unit_id) === String(filters.value.group_unit_id)
    const okCat   = !filters.value.category || d.category === filters.value.category
    const okBrand = !filters.value.brand || d.brand === filters.value.brand
    const okKw = !kw || [d.device_code, d.name, d.category, d.brand, d.model, d.serial_number]
                  .some(x => String(x || '').toLowerCase().includes(kw))
    return okGroup && okCat && okBrand && okKw
  })
})

/* Phân trang computed */
const totalRows   = computed(() => filteredDevices.value.length)
const totalPages  = computed(() => Math.max(1, Math.ceil(totalRows.value / perPage.value)))
const startIndex  = computed(() => (page.value - 1) * perPage.value)
const endIndex    = computed(() => Math.min(totalRows.value, startIndex.value + perPage.value))
const pagedDevices = computed(() => filteredDevices.value.slice(startIndex.value, endIndex.value))

const pageNumbers = computed(() => {
  const cur = page.value, last = totalPages.value, win = 2, out=[]
  const push = n => out.push({ key:'p'+n, num:n }), sep = k => out.push({ key:k, sep:true })
  if (last <= 7) { for (let i=1;i<=last;i++) push(i); return out }
  push(1); if (cur > 3 + win) sep('a')
  for (let i=Math.max(2, cur-win); i<=Math.min(last-1, cur+win); i++) push(i)
  if (cur < last - (2+win)) sep('b'); push(last); return out
})

const goTo = (p) => { if (p>=1 && p<=totalPages.value) page.value = p }
const goFirstPage = () => { page.value = 1 }
watch([filters, search], () => { page.value = 1 }, { deep: true })
watch([perPage, filteredDevices], () => { if (page.value > totalPages.value) page.value = 1 })

const resetFilters = () => {
  filters.value = { group_unit_id: '', category: '', brand: '' }
  search.value = ''
  page.value = 1
}

/* CRUD */
const onView = async (id) => { await getDeviceById(id); showDetailModal.value = true }
const onEdit = async (id) => { await getDeviceById(id); showEditModal.value = true }
const onDelete = async (id) => { await getDeviceById(id); showDeleteConfirmModal.value = true }

const createDevice = async (deviceData) => {
  loading.value = true
  try {
    await createDeviceApi(deviceData)
    toast.success('Tạo thiết bị thành công!')
    showCreateModal.value = false
    await loadDevices()
  } catch {
    alert('Tạo thiết bị thất bại!')
  } finally {
    loading.value = false
  }
}

const updateDevice = async (deviceData) => {
  loading.value = true
  try {
    if (!selectedDevice.value?.id) return alert('Không tìm thấy thiết bị để cập nhật.')
    await updateDeviceApi(selectedDevice.value.id, deviceData)
    toast.success('Cập nhật thành công!')
    showEditModal.value = false
    await loadDevices()
  } catch (e) {
    if (e.response?.status === 422) {
      const msg = Object.values(e.response.data.errors).flat().join('\n')
      alert('Cập nhật thiết bị thất bại:\n' + msg)
    } else alert('Cập nhật thiết bị thất bại!')
  } finally {
    loading.value = false
  }
}

const deleteDeviceConfirm = async () => {
  loading.value = true
  try {
    if (!selectedDevice.value?.id) return alert('Không tìm thấy thiết bị để xóa.')
    await deleteDeviceApi(selectedDevice.value.id)
    toast.warning('Xóa thành công!')
    showDeleteConfirmModal.value = false
    await loadDevices()
  } catch {
    alert('Xóa thiết bị thất bại!')
  } finally {
    loading.value = false
  }
}

onMounted(async () => { await getAllGroupUnit(); await loadDevices() })

/* ======= Export helpers ======= */
const deviceHeaders = ['STT','Mã thiết bị','Tên','Loại','Thương hiệu','Mẫu','Số sê-ri']
const deviceRows = () => pagedDevices.value.map((d,i)=>[
  startIndex.value + i + 1, d.device_code, d.name, d.category, d.brand, d.model, d.serial_number
])
const exportCopy = () => {
  const lines = [deviceHeaders.join('\t'), ...deviceRows().map(r=>r.join('\t'))].join('\n')
  navigator.clipboard.writeText(lines); toast.success('Đã copy vào clipboard!')
}
const exportCSV = () => {
  const toCsv = (a)=>a.map(r=>r.map(v=>`"${String(v).replaceAll('"','""')}"`).join(',')).join('\n')
  const csv = toCsv([deviceHeaders, ...deviceRows()])
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'})
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download='devices.csv'; a.click(); URL.revokeObjectURL(a.href)
}
const exportExcel = () => exportCSV()
const exportPDF = () => window.print()
</script>

<style scoped>
/* Overlay “Đang xử lý…” giống UnitManager.vue */
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
  border: 2px solid #28a745;
  box-shadow: 0 6px 20px rgba(0,0,0,0.2);
}
.btn-group .btn + .btn { margin-left: 4px; }
</style>
