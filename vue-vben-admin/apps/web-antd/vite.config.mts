import { defineConfig } from '@vben/vite-config';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      server: {
        proxy: {
          '/api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            target: 'http://gxcah.com:8077',
            ws: true,
          },
          '/v1': {
            changeOrigin: true,
            target: 'http://gxcah.com:8077',
          },
        },
      },
    },
  };
});
