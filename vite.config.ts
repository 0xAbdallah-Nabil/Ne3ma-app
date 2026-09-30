import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [ 'icon-192.png', 'icon-512.png' ],
      workbox: {
        globPatterns: [ '**/*.{js,css,html,png,svg,json}' ],
      },
      manifest: {
        name: 'حاسبة المنتجات',
        short_name: 'الحاسبة',
        description: 'حساب إجمالي أسعار المنتجات',
        lang: 'ar',
        dir: 'rtl',
        theme_color: '#0f172a',
        background_color: '#f1f5f9',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'ne3ma-icon.png', sizes: '192x192', type: 'image/png' },
          { src: 'ne3ma-icon.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
    }),
  ],
})