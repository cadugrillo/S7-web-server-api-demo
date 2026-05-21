import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import path from 'path'

/**
 * Vite configuration for the simatic-s7-webserver-api React demo.
 *
 * The simatic library is built for Node.js — it imports 'https', 'crypto', 'stream',
 * etc.  We need browser-compatible shims for those modules so the library works in
 * the browser.  This mirrors the custom-webpack.config.js in the Angular sibling app.
 *
 * Two-layer approach:
 *   1. resolve.alias  — hard-map 'https' and 'http' to their browserify equivalents
 *                       (these are the modules the simatic library uses for HTTP calls)
 *   2. nodePolyfills  — handles all remaining Node.js built-ins (crypto, buffer, etc.)
 */
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    nodePolyfills({
      globals: { Buffer: true, global: true, process: true },
      include: ['buffer', 'crypto', 'stream', 'util', 'url', 'assert', 'os', 'zlib', 'path'],
      protocolImports: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Explicit browser polyfills for the two modules Vite v8 externalizes by default
      'https': 'https-browserify',
      'http':  'stream-http',
    },
  },
})
