// Written by us, never by Tara: it is put back on every build, so a changed copy is ignored.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Files Tara adds in public/ (and the owner's images, added after the build) are copied as they are.
  publicDir: 'public',
  build: { outDir: 'dist', emptyOutDir: true, assetsDir: 'build', sourcemap: false },
  logLevel: 'warn',
});
