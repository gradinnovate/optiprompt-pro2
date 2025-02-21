import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    mainFields: ['browser', 'module', 'main'],
  },
  root: path.resolve(__dirname, '.'),
  publicDir: 'public',
  server: {
    port: 5173,
    fs: {
      strict: false,
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      },
      output: {
        format: 'es',
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks: {
          vendor: [
            'react',
            'react-dom',
            'react-router-dom',
            'framer-motion',
          ],
          firebase: ['firebase/app', 'firebase/auth'],
          ui: [
            '@radix-ui/react-dialog',
            '@radix-ui/react-hover-card',
            '@radix-ui/react-separator',
            '@radix-ui/react-slot',
            '@radix-ui/react-tooltip',
          ],
        },
      },
      external: ['electron', 'fs', 'path', 'http', 'net'],
    },
    modulePreload: {
      polyfill: false
    },
    target: ['es2020', 'chrome100', 'safari13'],
    cssTarget: ['chrome100', 'safari13'],
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ['firebase/app', 'firebase/auth'],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
    exclude: ['electron']
  },
  preview: {
    port: 5173,
    open: true
  },
}); 