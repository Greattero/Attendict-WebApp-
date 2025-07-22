import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // 👈 Listen on all interfaces explicitly
    port: 5173,
    allowedHosts: ['.ngrok-free.app'], // ✅ allow all ngrok URLs
    hmr: false, // 🔴 Disable auto-refresh / hot reload
  },
})
