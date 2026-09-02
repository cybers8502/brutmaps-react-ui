/// <reference types="vitest/config" />

import path from 'node:path';
import react from '@vitejs/plugin-react';
import {defineConfig, loadEnv} from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), 'VITE');

  return {
    plugins: [react()],
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/setupTests.ts'],
    },
    resolve: {
      alias: {
        '~': path.resolve(__dirname, 'src'),
      },
      // @brutmaps/api is a `file:` dependency (separate sibling repo, not a
      // workspace) — without dedupe it can pull in its own nested copies of
      // these, causing two live React/Apollo instances at runtime.
      dedupe: ['react', 'react-dom', '@apollo/client', 'graphql'],
    },
    server: {
      open: true,
      port: 3033,
    },
    // The app is served from a WP theme subdirectory, not the domain root —
    // without this, Vite bakes "/" as the base for lazy-chunk CSS/preload
    // URLs, which 404s (dynamic import() of the JS itself is unaffected
    // since it resolves relative to the importing module's own URL).
    base: '/wp-content/themes/brutmaps/publish/',
    build: {
      outDir: '../wp-brutmaps/wp-content/themes/brutmaps/publish',
      // Vite doesn't empty outDir by default when it's outside the project
      // root, so stale hashed files from previous builds pile up otherwise.
      emptyOutDir: true,
      // WP's AssetManager reads this to enqueue the current hashed
      // filenames instead of hardcoding them.
      manifest: true,
    },
    define: {
      'import.meta.env.VITE_SITE_URI': JSON.stringify(env.VITE_SITE_URI),
    },
  };
});
