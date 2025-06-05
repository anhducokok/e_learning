import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    hmr: false, // Disable Hot Module Replacement (WebSocket)
    port: 5173,
  },
})
