/// <reference types="vitest" />

import path from 'path'
import { defineConfig } from 'vitest/config'
import Vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Unocss from 'unocss/vite'

export default defineConfig({
  resolve: {
    alias: {
      '@hankit/tools': path.resolve(import.meta.dirname, 'packages/tools/src/index.ts'),
    },
  },
  define: {
    'import.meta.vitest': 'false',
  },
  plugins: process.env.TEST
    ? []
    : [
        Vue(),
        AutoImport({
          imports: ['vue', '@vueuse/core'],
          dts: 'src/web/auto-imports.d.ts',
        }),
        Components({
          dirs: ['src/web/components'],
          dts: 'src/web/components.d.ts',
        }),
        Unocss(),
      ],
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:8787',
    },
  },
  test: {
    includeSource: ['packages/*/src/**/*.ts'],
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('locale')) return 'locale'
          if (id.includes('polyphones.json')) return 'polyphones'
          if (id.includes('node_modules') && !id.endsWith('.css')) return 'vendor'
        },
      },
    },
  },
})
