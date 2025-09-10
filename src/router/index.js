import { createRouter, createWebHistory } from 'vue-router'
import AdminLayout from '../layouts/AdminLayout.vue'
import Home from '../pages/Home.vue'
import Login from '../pages/login.vue'
import Unit from '../pages/units/UnitManager.vue'
import User from '../pages/users/UserManager.vue'
import Website from '../pages/websites/WebsiteManager.vue'
import Device from '../pages/devices/DeviceManager.vue'
import Vulnerability from '../pages/vulnerabilitys/VulnerabilityManager.vue'
import Statistics from '../pages/statistics/Statistics.vue'
import VulnerabilityAlerts from '../pages/vulnerabilityAlerts/VulnerabilityAlerts.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },

  {
    path: '/',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'home',
        component: Home,
        meta: { roles: ['super_admin', 'staff'] }
      },
      {
        path: 'units',
        name: 'units',
        component: Unit,
        meta: { roles: ['super_admin'] }
      },
      {
        path: 'users',
        name: 'users',
        component: User,
        meta: { roles: ['super_admin'] }
      },
      {
        path: 'devices',
        name: 'devices',
        component: Device,
        meta: { roles: ['super_admin', 'staff'] }
      },
      {
        path: 'websites',
        name: 'websites',
        component: Website,
        meta: { roles: ['super_admin', 'staff'] }
      },
      {
        path: 'vulnerabilitys',
        name: 'vulnerabilitys',
        component: Vulnerability,
        meta: { roles: ['super_admin', 'staff'] }
      },
       {
        path: 'statistics',
        name: 'statistics',
        component: Statistics,
        meta: { roles: ['super_admin', 'staff'] }
      },
    
{
  path: '/VulnerabilityAlerts',
  name: 'VulnerabilityAlerts',
  component: VulnerabilityAlerts,
  meta: { requiresAuth: true }
},

      {
        path: '403',
        name: 'forbidden',
        component: () => import('../pages/403.vue')
      }
    ]
  },

  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const userRaw = localStorage.getItem('user')
  const user = userRaw ? JSON.parse(userRaw) : null
  const userRoles = user?.rules || []

  const isAuthenticated = !!token

  // Chưa đăng nhập mà truy cập trang cần đăng nhập
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ name: 'login' })
  }

  // Đã đăng nhập nhưng vào lại trang login
  if (to.name === 'login' && isAuthenticated) {
    return next({ name: 'home' })
  }

  // Kiểm tra quyền nếu có yêu cầu roles
  if (to.meta.roles && !to.meta.roles.some(role => userRoles.includes(role))) {
    return next({ name: 'forbidden' })
  }

  return next()
})

export default router
