import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // PORT env lets tooling assign a port; default 5173 for the launcher.
    port: Number(process.env.PORT) || 5173,
    open: true,
  },
})
