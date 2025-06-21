import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import autoprefixer from 'autoprefixer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    autoprefixer(),
  ],
  server: {
    port: 3000,
    host: true,
    strictPort: true,
    open: true,
    allowedHosts: [
      'demining.tum.de',
    ]
  }
})
