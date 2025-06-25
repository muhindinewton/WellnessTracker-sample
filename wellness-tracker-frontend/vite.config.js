import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/', // 👈 important for Flask to serve assets correctly
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist', // default is fine
    emptyOutDir: true,
  },
})
