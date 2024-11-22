import { defineConfig } from 'vite'
import { resolve } from 'path'
import {ViteEjsPlugin} from "vite-plugin-ejs";

export default defineConfig({
  plugins: [ViteEjsPlugin(
    {title: 'My vue project!'},
    {
      ejs: {
        // ejs options goes here.
        beautify: true,
      },
    }
  )]
}) 