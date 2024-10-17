import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import viteCompression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
    react(),
    viteCompression({ 
      algorithm: 'brotliCompress',
      disable: false,
    
    })
  ],

  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler'
      }
    }
  }
});
