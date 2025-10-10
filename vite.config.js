import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { fileURLToPath } from 'url';


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
  },
  optimizeDeps: {
    include: ['primereact/organizationchart']
  },
  server: {
    allowedHosts: [
      '7397-190-110-47-243.ngrok-free.app'
    ]
  }
})

