import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import wasm from 'vite-plugin-wasm'

export default defineConfig(({ mode }) => ({
  // GitHub Pages serves project sites from /<repository>/. Keep local and
  // alternative deployments rooted at / so the demo remains portable.
  base: mode === 'pages' ? '/conflictzero/' : '/',
  plugins: [wasm(), react()],
}))
