
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: 1574,
    strictPort: true,
    watch: {
      usePolling: true,
      interval: 1000,
    },
    allowedHosts: [
      'crestline.sts-test.site',        // your new domain
      'localhost',           // optional, for local dev
      'www.crestline.sts-test.site',           // optional, for local dev
    ],
    hmr: {
      protocol: 'ws',
      host: 'crestline.sts-test.site',  // match your browser access
    },
  },
});