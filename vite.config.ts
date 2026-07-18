/// <reference types="vitest" />

import { defineConfig } from 'vitest/config'
import tailwindcss from '@tailwindcss/vite'
import Vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  define: {
    'import.meta.vitest': 'false',
  },
  plugins: process.env.TEST
    ? []
    : [
        tailwindcss(),
        Vue(),
        AutoImport({
          imports: ['vue', '@vueuse/core'],
          dts: 'src/web/auto-imports.d.ts',
        }),
        Components({
          dirs: ['src/web/components'],
          dts: 'src/web/components.d.ts',
        }),
      ],
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:8787',
    },
  },
  test: {
    includeSource: ['src/shared/tools/**/*.ts'],
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('locale')) return 'locale'
          if (id.includes('node_modules') && !id.endsWith('.css')) return 'vendor'
        },
      },
    },
  },
})
