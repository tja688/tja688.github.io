import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // This repository is a GitHub Pages user site, so production assets live at the root.
  base: '/',
});
