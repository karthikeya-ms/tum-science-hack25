import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// import the PostCSS plugin, not the main tailwindcss package
import tailwindPostcss from '@tailwindcss/postcss'
import autoprefixer from 'autoprefixer'

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        tailwindPostcss(),   // ← use @tailwindcss/postcss here
        autoprefixer()
      ]
    }
  }
})
