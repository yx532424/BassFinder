import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const variablesPath = path.resolve(__dirname, 'src/styles/_variables.scss').replace(/\\/g, '/')
const mixinsPath = path.resolve(__dirname, 'src/styles/_mixins.scss').replace(/\\/g, '/')

export default {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "${variablesPath}"; @import "${mixinsPath}";`
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173
  }
}
