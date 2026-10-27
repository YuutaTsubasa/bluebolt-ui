import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// The repo root is the demo app; the library itself lives in src/lib.
export default defineConfig({
  plugins: [svelte()],
  base: './',
  server: { port: 5178 },
});
