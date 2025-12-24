import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
        host: true,
        port: 3000, // Your desired port
        allowedHosts: [
          'rpmcompintel.dev.elevancehealth.com','rpmcompintel.preprod.elevancehealth.com','rpmcompintel.elevancehealth.com'
        ]
      },
  preview: {
    host: true,
    port: 3000, // Add this for preview mode
    allowedHosts: [
      'rpmcompintel.dev.elevancehealth.com',
      'rpmcompintel.preprod.elevancehealth.com',
      'rpmcompintel.elevancehealth.com'
    ]
  }
})
