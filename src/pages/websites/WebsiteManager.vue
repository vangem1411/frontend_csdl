<template>
  <div>
    <div class="page-title">
      <div class="title_left"><h3>Quản lý trang web</h3></div>
      <div class="title_right">
        <div class="col-md-5 form-group pull-right top_search">
          <div class="input-group">
            <input v-model="search" type="text" class="form-control" placeholder="Tìm kiếm trang web" @keyup.enter="goFirstPage" />
            <span class="input-group-btn">
              <button class="btn btn-secondary"  @click="goFirstPage">Tìm</button>
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
            <h2>Dữ liệu <small>trang web</small></h2>
            <ul class="nav navbar-right panel_toolbox">
              <li><a class="collapse-link"><i class="fa fa-chevron-up"></i></a></li>
              <li><a class="close-link"><i class="fa fa-close"></i></a></li>
            </ul>
            <div class="clearfix"></div>
          </div>

          <!-- Nút + Bộ lọc -->
          <div class="d-flex align-items-center mb-3 flex-wrap form-inline">
            <button class="btn btn-success mr-2 mb-2" @click="showCreateModal = true">Thêm trang web</button>

            <select class="form-control mr-2 mb-2" style="width:auto" v-model="filters.group_unit_id" @change="goFirstPage">
              <option value="">Nhóm đơn vị (tất cả)</option>
              <option v-for="g in groupUnitList" :key="g.id" :value="g.id">{{ g.name }}</option>
            </select>

            <select class="form-control mr-2 mb-2" style="width:auto" v-model="filters.status" @change="goFirstPage">
              <option value="">Trạng thái (tất cả)</option>
              <option v-for="s in statusOptions" :key="s" :value="s">{{ s }}</option>
            </select>

            <select class="form-control mr-2 mb-2" style="width:auto" v-model="filters.domain" @change="goFirstPage">
              <option value="">Tên miền (tất cả)</option>
              <option v-for="d in domains" :key="d" :value="d">{{ d }}</option>
            </select>

            <button class="btn btn-outline-secondary mb-2" @click="resetFilters">Xóa lọc</button>
          </div>

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
                    <th>Tên</th>
                    <th>Url</th>
                    <th>Mô tả</th>
                    <th>Trạng thái</th>
                    <th>Ghi chú</th>
                    <th style="width:200px">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="pagedWebsites.length === 0 && !loading">
                    <td colspan="7" class="text-center text-muted">Không có dữ liệu</td>
                  </tr>
                  <tr v-for="(row, idx) in pagedWebsites" :key="row.id">
                    <td>{{ startIndex + idx + 1 }}</td>
                    <td>{{ row.name }}</td>
                    <td><a :href="row.url" target="_blank" rel="noopener">{{ row.url }}</a></td>
                    <td>{{ row.description }}</td>
                    <td><span :class="['badge', badgeClass(row.status)]">{{ row.status || '—' }}</span></td>
                    <td>{{ row.note }}</td>
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
            <nav v-if="totalPages > 1 && !loading" aria-label="Website pagination">
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
    <FormCreate v-if="showCreateModal" :showModal="showCreateModal" @submit="createWebsite" @close-modal="showCreateModal = false" />
    <FormUpdate v-if="showEditModal" :websiteData="selectedWebsite" :showModal="showEditModal" @emit-update-website="updateWebsite" @close-modal="showEditModal = false" />
    <WebsiteDetailModal v-if="showDetailModal && selectedWebsite" :websiteData="selectedWebsite" :showModal="showDetailModal" @close-modal="showDetailModal = false" />
    <WebsiteDeleteConfirm v-if="showDeleteConfirmModal && selectedWebsite" :websiteData="selectedWebsite" :showModal="showDeleteConfirmModal" @confirm-delete="deleteWebsiteConfirm" @close-modal="showDeleteConfirmModal = false" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import FormCreate from './WebsiteFormCreate.vue'
import FormUpdate from './WebsiteFormUpdate.vue'
import WebsiteDetailModal from './WebsiteDetail.vue'
import WebsiteDeleteConfirm from './WebsiteDeleteConfirm.vue'
import { useWebsite } from '@/composables/useWebsite'
import { useGroupUnit } from '@/composables/useGroupUnit'
import { useToast } from 'vue-toastification'

const toast = useToast()
const search = ref('')

const { selectedWebsite, getWebsiteById, deleteWebsiteApi, createWebsiteApi, updateWebsiteApi } = useWebsite()
const { groupUnitList, getAllGroupUnit } = useGroupUnit()

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDetailModal = ref(false)
const showDeleteConfirmModal = ref(false)

const loading = ref(false)

const websites = ref([])
const filters = ref({ group_unit_id: '', status: '', domain: '' })
const statusOptions = ref([])
const domains = ref([])

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
const extractDomain = (url='') => { try { return new URL(url).hostname.replace(/^www\./, '') } catch { return '' } }

const loadWebsites = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('token') || ''
    const headers = { Accept: 'application/json' }
    if (token) headers.Authorization = 'Bearer ' + token
    const urls = [
      '/api/website?start=0&length=100000&draw=1',
      '/api/website?length=100000&start=0',
      '/api/website'
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

    websites.value = rows.map((w, i) => ({
      id: w.id ?? i,
      name: w.name ?? '',
      url: w.url ?? '',
      description: w.description ?? '',
      status: w.status ?? '',
      note: w.note ?? '',
      group_unit_id: w.group_unit_id ?? w.groupId ?? '',
      _domain: extractDomain(w.url ?? '')
    }))

    const setStatus = new Set(), setDomain = new Set()
    websites.value.forEach(w => { if (w.status) setStatus.add(w.status); if (w._domain) setDomain.add(w._domain) })
    statusOptions.value = Array.from(setStatus)
    domains.value = Array.from(setDomain)
    page.value = 1
  } finally {
    loading.value = false
  }
}

/* Lọc */
const filteredWebsites = computed(() => {
  const kw = (search.value || '').toLowerCase().trim()
  return websites.value.filter(w => {
    const okGroup  = !filters.value.group_unit_id || String(w.group_unit_id) === String(filters.value.group_unit_id)
    const okStatus = !filters.value.status || w.status === filters.value.status
    const okDomain = !filters.value.domain || w._domain === filters.value.domain
    const okKw = !kw || [w.name, w.url, w.description, w.status, w.note].some(x => String(x || '').toLowerCase().includes(kw))
    return okGroup && okStatus && okDomain && okKw
  })
})

/* Phân trang computed */
const totalRows     = computed(() => filteredWebsites.value.length)
const totalPages    = computed(() => Math.max(1, Math.ceil(totalRows.value / perPage.value)))
const startIndex    = computed(() => (page.value - 1) * perPage.value)
const endIndex      = computed(() => Math.min(totalRows.value, startIndex.value + perPage.value))
const pagedWebsites = computed(() => filteredWebsites.value.slice(startIndex.value, endIndex.value))

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
watch([perPage, filteredWebsites], () => { if (page.value > totalPages.value) page.value = 1 })

const resetFilters = () => {
  filters.value = { group_unit_id: '', status: '', domain: '' }
  search.value = ''
  page.value = 1
}

/* Badge trạng thái */
const badgeClass = (st) => {
  const s = String(st || '').toLowerCase()
  if (!s) return 'badge-secondary'
  if (/(inactive|ngung|ngừng|dung|dừng|off|false|0)/.test(s)) return 'badge-danger'
  if (/(active|hoat|hoạt|on|true|1)/.test(s)) return 'badge-success'
  return 'badge-info'
}

/* CRUD */
const onView = async (id) => { await getWebsiteById(id); showDetailModal.value = true }
const onEdit = async (id) => { await getWebsiteById(id); showEditModal.value = true }
const onDelete = async (id) => { await getWebsiteById(id); showDeleteConfirmModal.value = true }

const createWebsite = async (websiteData) => {
  loading.value = true
  try {
    await createWebsiteApi(websiteData)
    toast.success('Tạo trang web thành công!')
    showCreateModal.value = false
    await loadWebsites()
  } catch {
    alert('Tạo trang web thất bại!')
  } finally {
    loading.value = false
  }
}
const updateWebsite = async (websiteData) => {
  loading.value = true
  try {
    if (!selectedWebsite.value?.id) return alert('Không tìm thấy trang web để cập nhật.')
    await updateWebsiteApi(selectedWebsite.value.id, websiteData)
    toast.success('Cập nhật thành công!')
    showEditModal.value = false
    await loadWebsites()
  } catch {
    alert('Cập nhật trang web thất bại!')
  } finally {
    loading.value = false
  }
}
const deleteWebsiteConfirm = async () => {
  loading.value = true
  try {
    if (!selectedWebsite.value?.id) return alert('Không tìm thấy trang web để xóa.')
    await deleteWebsiteApi(selectedWebsite.value.id)
    toast.warning('Xóa thành công!')
    showDeleteConfirmModal.value = false
    await loadWebsites()
  } catch {
    alert('Xóa trang web thất bại!')
  } finally {
    loading.value = false
  }
}

onMounted(async () => { await getAllGroupUnit(); await loadWebsites() })

/* ======= Export helpers ======= */
const webHeaders = ['STT','Tên','Url','Mô tả','Trạng thái','Ghi chú']
const webRows = () => pagedWebsites.value.map((w,i)=>[
  startIndex.value + i + 1, w.name, w.url, w.description, w.status, w.note
])
const exportCopy = () => {
  const lines = [webHeaders.join('\t'), ...webRows().map(r=>r.join('\t'))].join('\n')
  navigator.clipboard.writeText(lines); toast.success('Đã copy vào clipboard!')
}
const exportCSV = () => {
  const toCsv = (a)=>a.map(r=>r.map(v=>`"${String(v).replaceAll('"','""')}"`).join(',')).join('\n')
  const csv = toCsv([webHeaders, ...webRows()])
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'})
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='websites.csv'; a.click(); URL.revokeObjectURL(a.href)
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
