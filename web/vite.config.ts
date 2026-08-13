import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Local default "/". CI passes --base /Geothermal/ for GitHub Pages.
export default defineConfig({
  plugins: [react()],
})
