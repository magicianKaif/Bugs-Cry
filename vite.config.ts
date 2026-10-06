import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig, transformWithEsbuild } from "vite"

// https://vite.dev/config/
export default defineConfig({
  base: './',
  optimizeDeps: {
    esbuildOptions: {
      loader: { '.js': 'jsx' },
    },
  },
  plugins: [
    {
      name: 'jsx-in-js',
      enforce: 'pre',
      async transform(code, id) {
        if (id.includes('/src/') && id.endsWith('.js')) {
          return transformWithEsbuild(code, id, { loader: 'jsx' })
        }
      },
    },
    react({ include: /\.[jt]sx?$/ }),
  ],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
