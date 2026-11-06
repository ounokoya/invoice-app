import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'

// base : le site est servi par GitHub Pages sous /invoice-app/
export default defineConfig({ base: '/invoice-app/', plugins: [svelte(), tailwindcss()] })
