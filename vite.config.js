import { defineConfig } from 'vite'
import { resolve } from 'path'
import {ViteEjsPlugin} from "vite-plugin-ejs";

export default defineConfig({
  plugins: [
    ViteEjsPlugin(),
    {
        name: 'reload-on-ejs-change',
        handleHotUpdate({ file, server }) {
            if (file.endsWith('.ejs')) {
                server.ws.send({
                    type: 'full-reload',
                    path: '*'
                });
                return [];
            }
        },
    }
  ],
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true
  },
  base: '/',
  server: {
    open: true,
    watch: {
        usePolling: true
    },
    hmr: {
        overlay: true
    }
  }
}) 