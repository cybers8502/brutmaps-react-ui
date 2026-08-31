import {defineConfig, loadEnv} from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), 'VITE');

  return {
    plugins: [react()],
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
    build: {
      outDir: '../wp-brutmaps/wp-content/themes/brutmaps/publish',
    },
    define: {
      'import.meta.env.VITE_SITE_URI': JSON.stringify(env.VITE_SITE_URI),
    },
  };
});
