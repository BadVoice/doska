import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueDevTools from 'vite-plugin-vue-devtools';
import tailwind from 'tailwindcss';
import path from 'path';
import autoprefixer from 'autoprefixer';

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
  },
  plugins: [vue(), VueDevTools()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/qwep/api/v1': {
        target: 'https://test.qrq.ru',
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: (path) => path.replace(/^\/qwep\/api\/v1/, '/qwep/api/v1'),
      },
      '/core/api/v1': {
        target: 'https://test.qrq.ru',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
