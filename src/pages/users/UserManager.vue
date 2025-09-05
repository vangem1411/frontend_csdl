<template>
  <div>
    <div class="page-title">
      <div class="title_left"><h3>Quản lý người dùng</h3></div>
      <div class="title_right">
        <div class="col-md-5 form-group pull-right top_search">
          <div class="input-group">
            <input v-model="search" type="text" class="form-control" placeholder="Tìm kiếm người dùng"
              @keyup.enter="reloadTable" />
            <span class="input-group-btn">
              <button class="btn btn-secondary" @click="reloadTable">Tìm</button>
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
            <h2>Dữ liệu <small>người dùng</small></h2>
            <ul class="nav navbar-right panel_toolbox">
              <li><a class="collapse-link"><i class="fa fa-chevron-up"></i></a></li>
              <li><a class="close-link"><i class="fa fa-close"></i></a></li>
            </ul>
            <div class="clearfix"></div>
          </div>

          <!-- Nút thêm -->
          <div class="d-flex align-items-center mb-3 flex-wrap form-inline">
            <button class="btn btn-success mr-2 mb-2" @click="showCreateModal = true">Thêm người dùng</button>
            <select class="form-control mr-2 mb-2" style="width:auto" v-model="filterUnit">
              <option value="">Nhóm đơn vị (tất cả)</option>
              <option v-for="g in groupUnitList" :key="g.id" :value="g.id">{{ g.name }}</option>
            </select>
            <button class="btn btn-outline-secondary mb-2" @click="resetFilters">Xóa lọc</button>
          </div>

          <div class="x_content">
            <div class="table-responsive">
              <table id="datatable-users" class="table table-striped table-bordered" style="width: 100%">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Họ tên</th>
                    <th>Email</th>
                    <th>Tài khoản</th>
                    <th>Đơn vị</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody></tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <FormCreate v-if="showCreateModal" :showModal="showCreateModal" @submit="createUser"
      @close-modal="showCreateModal = false" />
    <FormUpdate v-if="showEditModal" :userData="selectedUser" :showModal="showEditModal" @emit-update-user="updateUser"
      @close-modal="showEditModal = false" />
    <UserDetailModal v-if="showDetailModal && selectedUser" :userData="selectedUser"
      :showModal="showDetailModal" @close-modal="showDetailModal = false" />
    <UserDeleteConfirm v-if="showDeleteConfirmModal && selectedUser" :userData="selectedUser"
      :showModal="showDeleteConfirmModal" @confirm-delete="deleteUserConfirm"
      @close-modal="showDeleteConfirmModal = false" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import FormCreate from './UserFormCreate.vue'
import FormUpdate from './UserFormUpdate.vue'
import UserDetailModal from './UserDetail.vue'
import UserDeleteConfirm from './UserDeleteConfirm.vue'
import { useUser } from '@/composables/useUser'
import { useGroupUnit } from '@/composables/useGroupUnit'
import { useToast } from 'vue-toastification'

const toast = useToast()
const search = ref('')
const filterUnit = ref('')

const {
  selectedUser,
  getUserById,
  deleteUserApi,
  createUserApi,
  updateUserApi
} = useUser()

const { groupUnitList, getAllGroupUnit } = useGroupUnit()

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDetailModal = ref(false)
const showDeleteConfirmModal = ref(false)

const table = ref(null)

const initDataTable = async () => {
  const $ = window.$
  const tableId = '#datatable-users'

  if ($.fn.DataTable.isDataTable(tableId)) {
    $(tableId).DataTable().clear().destroy()
  }

  table.value = $(tableId).DataTable({
    processing: true,
    serverSide: true,
    autoWidth: false,
    ordering: false,
    ajax: {
      url: '/api/users',
      data: d => {
        if (search.value) d.search = search.value
        if (filterUnit.value) d.group_unit_id = filterUnit.value
      },
      beforeSend: function (xhr) {
        const token = localStorage.getItem('token')
        if (token) {
          xhr.setRequestHeader('Authorization', 'Bearer ' + token)
        }
      }
    },
    columns: [
      { data: null, render: (data, type, row, meta) => meta.row + meta.settings._iDisplayStart + 1 },
      { data: 'name' },
      { data: 'email' },
      { data: 'username' },
      {
        data: 'group_unit_id',
        render: function (data) {
          const units = Array.isArray(groupUnitList.value) ? groupUnitList.value : []
          const unit = units.find(u => u.id === data)
          return unit ? unit.name : 'Không xác định'
        }
      },
      {
        data: null,
        searchable: false,
        render: (data, type, row) => `
          <div class="btn-group" role="group">
            <button class="btn btn-info btn-sm view-user-btn" title="Xem" data-id="${row.id}">
              <i class="fa fa-eye"></i>
            </button>
            <button class="btn btn-warning btn-sm edit-user-btn" title="Sửa" data-id="${row.id}">
              <i class="fa fa-pencil"></i>
            </button>
            <button class="btn btn-danger btn-sm delete-user-btn" title="Xóa" data-id="${row.id}">
              <i class="fa fa-trash"></i>
            </button>
          </div>
        `
      }
    ],
    columnDefs: [
      { targets: 0, width: '5%' },
      { targets: 1, width: '25%' },
      { targets: 2, width: '20%' },
      { targets: 3, width: '20%' },
      { targets: 4, width: '15%' },
      { targets: 5, width: '15%' }
    ],
    dom: "<'row mb-3'" +
      "<'col-md-3'l>" +
      "<'col-md-6 text-center'B>" +
      "<'col-md-3'f>" +
      ">" +
      "<'row'<'col-sm-12'tr>>" +
      "<'row'<'col-sm-5'i><'col-sm-7'p>>",
    buttons: [
      { extend: 'copy', className: 'btn btn-sm btn-secondary' },
      { extend: 'excel', className: 'btn btn-sm btn-success' },
      { extend: 'csv', className: 'btn btn-sm btn-info' },
      { extend: 'pdf', className: 'btn btn-sm btn-danger' },
      { extend: 'print', className: 'btn btn-sm btn-dark' }
    ],
    language: {
      sProcessing: 'Đang xử lý...',
      sLengthMenu: 'Xem _MENU_ mục',
      sZeroRecords: 'Không tìm thấy dòng nào phù hợp',
      sInfo: 'Đang xem _START_ đến _END_ trong tổng số _TOTAL_ mục',
      sInfoEmpty: 'Đang xem 0 đến 0 trong tổng số 0 mục',
      sInfoFiltered: '(được lọc từ _MAX_ mục)',
      sSearch: 'Tìm:',
      oPaginate: { sFirst: 'Đầu', sPrevious: 'Trước', sNext: 'Tiếp', sLast: 'Cuối' }
    },
    drawCallback: () => {
      $('.edit-user-btn').off('click').on('click', async function () {
        const id = $(this).data('id')
        if (id) { await getUserById(id); showEditModal.value = true }
      })
      $('.view-user-btn').off('click').on('click', async function () {
        const id = $(this).data('id')
        if (id) { await getUserById(id); showDetailModal.value = true }
      })
      $('.delete-user-btn').off('click').on('click', async function () {
        const id = $(this).data('id')
        if (id) { await getUserById(id); showDeleteConfirmModal.value = true }
      })
    }
  })
}

const reloadTable = () => { if (table.value) table.value.ajax.reload(null, false) }

const resetFilters = () => { filterUnit.value = ''; search.value = ''; reloadTable() }

const createUser = async (userData) => {
  try {
    await createUserApi(userData)
    toast.success('Tạo người dùng thành công!')
    showCreateModal.value = false
    reloadTable()
  } catch { alert('Tạo người dùng thất bại!') }
}

const updateUser = async (userData) => {
  try {
    if (!selectedUser.value?.id) return alert('Không tìm thấy người dùng để cập nhật.')
    await updateUserApi(selectedUser.value.id, userData)
    toast.success('Cập nhật thành công!')
    showEditModal.value = false
    reloadTable()
  } catch { alert('Cập nhật người dùng thất bại!') }
}

const deleteUserConfirm = async () => {
  try {
    if (!selectedUser.value?.id) return alert('Không tìm thấy người dùng để xóa.')
    await deleteUserApi(selectedUser.value.id)
    toast.warning('Xóa thành công!')
    showDeleteConfirmModal.value = false
    reloadTable()
  } catch { alert('Xóa người dùng thất bại!') }
}

onMounted(async () => { await getAllGroupUnit(); initDataTable() })
onUnmounted(() => { const $ = window.$; if (table.value && $.fn.dataTable.isDataTable('#datatable-users')) table.value.destroy() })
</script>
