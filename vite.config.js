import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000, // Optional: Raises warning threshold to 1MB
    rollupOptions: {
      output: {
        manualChunks: {
          // Creates separate chunks for heavy libraries
          pdfLibs: ['react-pdf', 'pdfjs-dist'],
        },
      },
    },
  },
});
