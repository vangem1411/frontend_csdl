// import { defineConfig } from 'vite'
// import vue from '@vitejs/plugin-vue'


// import { fileURLToPath, URL } from 'node:url'

// export default defineConfig({
//   plugins: [vue()],
//   resolve: {
//     alias: {
//       '@': fileURLToPath(new URL('./src', import.meta.url)) // ✅ alias cho "@/..."
//     }
//   }
// })



import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:8000' // ✅ Laravel backend
    }
  }
})
