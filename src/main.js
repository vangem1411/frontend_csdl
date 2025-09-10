import './assets/css/global.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Toast, { POSITION } from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import VueApexCharts from 'vue3-apexcharts'
createApp(App).use(VueApexCharts).mount('#app')


const app = createApp(App)

app.use(router)
app.use(Toast, {
  position: POSITION.TOP_RIGHT,
  timeout: 3000
});
app.mount('#app')
