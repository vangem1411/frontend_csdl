<template>
  <div class="col-md-3 left_col">
    <div class="left_col scroll-view">
      <div class="navbar nav_title" style="border: 0;">
        <router-link to="/" class="site_title">
          <i class="fa fa-paw"></i> <span>CSDLPT</span>
        </router-link>
      </div>

      <div class="clearfix"></div>

      <!-- menu profile quick info -->
      <div class="profile clearfix">
        <div class="profile_pic">
          <img src="/images/img.jpg" alt="..." class="img-circle profile_img">
        </div>
        <div class="profile_info">
          <span>Xin chào,</span>
          <h2>{{ username }}</h2>
        </div>
      </div>
      <!-- /menu profile quick info -->

      <br />

      <!-- sidebar menu -->
      <div id="sidebar-menu" class="main_menu_side hidden-print main_menu">
        <div class="menu_section">
          <h3>Thống kê, cảnh báo</h3>
         <ul class="nav side-menu">
            <li v-if="userRole !== 'staff'">
              <router-link to="/statistics">
                <i class="fa fa-bar-chart"></i> Thống kê
              </router-link>
            </li>
              <li v-if="userRole !== 'staff'">
              <router-link to="/statistics">
                <i class="fa fa fa-bell"></i> Cảnh báo
              </router-link>
            </li>
          </ul>
        </div>
        <div class="menu_section">
          <h3>Quản lý</h3>
          <ul class="nav side-menu">
            <li v-if="userRole !== 'staff'">
              <router-link to="/units">
                <i class="fa fa-sitemap"></i> Quản lý nhóm địa bàn
              </router-link>
            </li>
            <li v-if="userRole !== 'staff'">
              <router-link to="/users">
                <i class="fa fa-user"></i> Quản lý người dùng
              </router-link>
            </li>

            <li v-if="userRole !== 'staff'">
            <router-link to="/devices">
              <i class="fa fa-desktop"></i> Quản lý thiết bị
            </router-link>
            </li>
            <li v-if="userRole !== 'staff'">
              <router-link to="/websites">
              <i class="fa fa-globe"></i> Quản lý trang web
            </router-link>
            </li>
            <li  v-if="userRole !== 'staff'">
              <router-link to="/vulnerabilitys">
            <i class="fa fa-shield"></i> Quản lý lỗ hổng bảo mật
          </router-link>
          </li>

          </ul>
        </div>

      </div>
      <!-- /sidebar menu -->

      <!-- /menu footer buttons -->
      <div class="sidebar-footer hidden-small">
        <a data-toggle="tooltip" data-placement="top" title="Settings">
          <span class="glyphicon glyphicon-cog" aria-hidden="true"></span>
        </a>
        <a data-toggle="tooltip" data-placement="top" title="FullScreen">
          <span class="glyphicon glyphicon-fullscreen" aria-hidden="true"></span>
        </a>
        <a data-toggle="tooltip" data-placement="top" title="Lock">
          <span class="glyphicon glyphicon-eye-close" aria-hidden="true"></span>
        </a>
        <a data-toggle="tooltip" data-placement="top" title="Đăng xuất" @click="logout">
          <span class="glyphicon glyphicon-off" aria-hidden="true"></span>
        </a>
      </div>
      <!-- /menu footer buttons -->
    </div>
  </div>

  <!-- top navigation -->
  <div class="top_nav">
    <div class="nav_menu">
      <div class="nav toggle">
        <a id="menu_toggle"><i class="fa fa-bars"></i></a>
      </div>
      <nav class="nav navbar-nav">
        <ul class=" navbar-right">
          <li class="nav-item dropdown open" style="padding-left: 15px;">
            <a href="javascript:;" class="user-profile dropdown-toggle" aria-haspopup="true" id="navbarDropdown"
              data-toggle="dropdown" aria-expanded="false">
              <img src="/images/img.jpg" alt="">{{ username }}
            </a>
            <div class="dropdown-menu dropdown-usermenu pull-right" aria-labelledby="navbarDropdown">
              <a class="dropdown-item" href="javascript:;"> Profile</a>
              <a class="dropdown-item" href="javascript:;">
                <span class="badge bg-red pull-right">50%</span>
                <span>Settings</span>
              </a>
              <a class="dropdown-item" href="javascript:;">Help</a>
              <a class="dropdown-item" @click="logout"><i class="fa fa-sign-out pull-right"></i> Đăng xuất</a>
            </div>
          </li>

          <li role="presentation" class="nav-item dropdown open">
            <a href="javascript:;" class="dropdown-toggle info-number" id="navbarDropdown1" data-toggle="dropdown"
              aria-expanded="false">
              <i class="fa fa-envelope-o"></i>
              <span class="badge bg-green">6</span>
            </a>
            <ul class="dropdown-menu list-unstyled msg_list" role="menu" aria-labelledby="navbarDropdown1">
              <li class="nav-item">
                <a class="dropdown-item">
                  <span class="image"><img src="/images/img.jpg" alt="Profile Image" /></span>
                  <span>
                    <span>John Smith</span>
                    <span class="time">3 mins ago</span>
                  </span>
                  <span class="message">
                    Film festivals used to be do-or-die moments for movie makers. They were where...
                  </span>
                </a>
              </li>
              <li class="nav-item">
                <a class="dropdown-item">
                  <span class="image"><img src="/images/img.jpg" alt="Profile Image" /></span>
                  <span>
                    <span>John Smith</span>
                    <span class="time">3 mins ago</span>
                  </span>
                  <span class="message">
                    Film festivals used to be do-or-die moments for movie makers. They were where...
                  </span>
                </a>
              </li>
              <li class="nav-item">
                <a class="dropdown-item">
                  <span class="image"><img src="/images/img.jpg" alt="Profile Image" /></span>
                  <span>
                    <span>John Smith</span>
                    <span class="time">3 mins ago</span>
                  </span>
                  <span class="message">
                    Film festivals used to be do-or-die moments for movie makers. They were where...
                  </span>
                </a>
              </li>
              <li class="nav-item">
                <a class="dropdown-item">
                  <span class="image"><img src="/images/img.jpg" alt="Profile Image" /></span>
                  <span>
                    <span>John Smith</span>
                    <span class="time">3 mins ago</span>
                  </span>
                  <span class="message">
                    Film festivals used to be do-or-die moments for movie makers. They were where...
                  </span>
                </a>
              </li>
              <li class="nav-item">
                <div class="text-center">
                  <a class="dropdown-item">
                    <strong>See All Alerts</strong>
                    <i class="fa fa-angle-right"></i>
                  </a>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  </div>
  <!-- /top navigation -->
</template>


<script>
import { useRouter } from 'vue-router'
import api from '../composables/axios'
import { ref, onMounted } from 'vue'

export default {
  setup() {
    const router = useRouter()
    const username = ref('')
    const userRole = ref('')
    onMounted(() => {
      const userRaw = localStorage.getItem('user')
      if (userRaw) {
        try {
          const user = JSON.parse(userRaw)
          username.value = user.name || user.username
          userRole.value = user.role || user.rules
        } catch (err) {
          console.error('Lỗi khi parse user:', err)
        }
      }
    })

    const logout = async () => {
      try {
        await api.post('/logout')
      } catch (error) {
        console.error('Lỗi đăng xuất:', error)
      } finally {
        localStorage.removeItem('token')
        delete api.defaults.headers.common['Authorization']
        router.push('/login')
      }
    }

    return {
      username,
      userRole,
      logout
    }
  }
}
</script>
