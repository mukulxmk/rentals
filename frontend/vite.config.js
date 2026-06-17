import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import viteCompression from 'vite-plugin-compression';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
    // VitePWA({
    //   registerType: "autoUpdate",


    //   workbox: {
    //     runtimeCaching: [
    //       {
    //         urlPattern: /\/listings/,
    //         handler: "StaleWhileRevalidate",

    //         options: {
    //           cacheName: "listings-cache",

    //           expiration: {
    //             maxEntries: 10,
    //             maxAgeSeconds: 60 * 30,
    //           },
    //         },
    //       },
    //     ],
    //   },

    //   manifest: {
    //     name: "StayFinder",
    //     short_name: "StayFinder",
    //     start_url: "/",
    //     display: "standalone",
    //     background_color: "#ffffff",
    //     theme_color: "#ffffff",

    //     icons: [
    //       {
    //         src: "/pwa-192.png",
    //         sizes: "192x192",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/pwa-512.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //       },
    //     ],
    //   },
    // })
  ],
  build: {
    assetsInlineLimit: 0, 
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          maps: ['leaflet', 'maplibre-gl'],
          animations: ['gsap', '@gsap/react']
        },
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.').at(1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'img';
          } else if (/woff|woff2|eot|ttf|otf/i.test(extType)) {
            extType = 'fonts';
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        }
      }
    }
  }
});
