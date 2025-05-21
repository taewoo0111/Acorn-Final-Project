import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:9000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/upload': {
        target: 'http://localhost:9000',
        changeOrigin: true
      },
      '/download': {
        target: 'http://localhost:9000',
        changeOrigin: true,
      },
      '/editor_upload': {
        target: 'http://localhost:9000',
        changeOrigin: true,
      }
    }
  }
})
