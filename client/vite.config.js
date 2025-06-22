import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 3000,
    host: true,
    strictPort: true,
    open: false,
    allowedHosts: [
      'demining.tum.de',
      'localhost',
      '127.0.0.1',
      '.tum.de',
    ],
    hmr: {
      port: 3000,
    },
    watch: {
      usePolling: true,
      interval: 1000,
    },
  }
})
