import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Base path para GitHub Pages: https://baio99.github.io/BetsyInvitacion/
  base: '/BetsyInvitacion/',
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})