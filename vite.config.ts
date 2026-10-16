import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Served from https://thisisjayk.github.io/Portfolio/, so every asset path is prefixed.
export default defineConfig({
  base: '/Portfolio/',
  plugins: [react()],
})
