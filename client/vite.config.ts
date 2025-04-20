import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    proxy:{
      '/api/v1':{
        // target: 'http://127.0.0.1:9000',
        target: 'http://localhost:9000',
        changeOrigin: true,
      }
    }
  }
})
