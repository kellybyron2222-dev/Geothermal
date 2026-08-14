import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// Local default "/". CI passes --base /Geothermal/ for GitHub Pages.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
