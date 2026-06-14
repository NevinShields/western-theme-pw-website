import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        houseWashing: resolve(__dirname, 'house-washing.html'),
        roofCleaning: resolve(__dirname, 'roof-cleaning.html'),
        gutterCleaning: resolve(__dirname, 'gutter-cleaning.html'),
        windowCleaning: resolve(__dirname, 'window-cleaning.html'),
      }
    }
  }
});
