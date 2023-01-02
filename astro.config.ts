import { defineConfig } from 'astro/config'
import node from '@astrojs/node'

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  vite: {
    build: {
      // I don't like inlined assets
      assetsInlineLimit: 0
    }
  }
})
