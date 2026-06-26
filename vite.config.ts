import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/vue') || id.includes('node_modules/vue-router')) {
            return 'vue-runtime';
          }

          if (id.includes('node_modules/gsap')) {
            return 'gsap';
          }

          if (id.includes('node_modules/three')) {
            return 'three';
          }

          return undefined;
        },
      },
    },
  },
});
