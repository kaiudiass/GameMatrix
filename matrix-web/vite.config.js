import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendTarget = env.BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:3000'

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 5173,
      // Permite requisições vindas de túneis (Cloudflare Tunnel *.trycloudflare.com, etc.)
      allowedHosts: true,
      watch: {
        usePolling: true
      },
      proxy: {
        '/api': {
          target: backendTarget,
          changeOrigin: true
        },
        '/socket.io': {
          target: backendTarget,
          ws: true,
          changeOrigin: true
        }
      }
    }
  }
})

