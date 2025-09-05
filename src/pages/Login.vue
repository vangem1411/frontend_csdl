<template>
  <div class="container d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light">
    <div class="text-center mb-4">
      <h3 class="fw-bold" style="color: #343a40;">HỆ THỐNG <span style="color: #007bff;">CSDLPT</span></h3>
    </div>
    <div class="card p-4 shadow rounded-4" style="max-width: 400px; width: 100%;">
      <h2 class="text-center mb-4 text-primary">Đăng nhập</h2>

      <transition name="fade">
        <div v-if="errorMessage" class="alert alert-danger">
          {{ errorMessage }}
        </div>
      </transition>

      <form @submit.prevent="login">
        <div class="form-floating mb-3">
          <label for="username">Tên đăng nhập</label>
          <input v-model="username" type="text" id="username" class="form-control" placeholder="Tên đăng nhập"
            required />
        </div>

        <div class="form-floating mb-4">
          <label for="password">Mật khẩu</label>
          <input v-model="password" type="password" id="password" class="form-control" placeholder="Mật khẩu"
            required />
        </div>
        <button type="submit" class="btn btn-primary w-100 py-2 fw-semibold rounded-pill">
          Đăng nhập
        </button>
      </form>
    </div>
  </div>


</template>

<script>
import { ref, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import api from '../composables/axios'

export default {
  setup() {
    const username = ref('')
    const password = ref('')
    const errorMessage = ref('')
    const router = useRouter()

    const login = async () => {
      try {
        const response = await api.post('/login', {
          username: username.value,
          password: password.value,
        })

        const token = response.data.token
        const user = response.data.user

        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))

        router.push({ name: 'home' })
      } catch (error) {
        errorMessage.value = 'Sai tên đăng nhậpddf hoặc mật khẩu.'
        setTimeout(() => {
          errorMessage.value = ''
        }, 3000)
      }
    }


    return {
      username,
      password,
      errorMessage,
      login
    }
  }
}
</script>



<style scoped>
.card {
  border-radius: 12px;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.fade-enter-to, .fade-leave-from {
  opacity: 1;
}
</style>
