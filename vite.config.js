import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base: the build works at the site root and under any sub-path.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    // The scene chunk is mostly three.js (~1 MB, ~264 kB gzip) and loads lazily.
    chunkSizeWarningLimit: 1100,
  },
})
