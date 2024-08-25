/// <reference types="vitest" />
import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";
import eslint from "vite-plugin-eslint";
import { VitePWA } from "vite-plugin-pwa";

export default ({ command, mode }) => {
  return defineConfig({
    plugins: [
    react(),
    viteTsconfigPaths(),
    svgr(),
    eslint(),
      VitePWA({
        includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
        manifest: {
          name: 'Buho Stocks',
          short_name: 'Buho Stocks: Stocks and dividends',
          description: 'Stocks and portfolio manager',
          theme_color: '#ffffff',
          icons: [
            {
              src: '/icons/favicon-96x96.png',
              sizes: '96x96',
              type: 'image/png'
            },
            {
              src: '/icons/apple-icon-144x144.png',
              sizes: '144x144',
              type: 'image/png'
            },
            {
              src: '/icons/apple-icon-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '/icons/apple-icon-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        },
          devOptions: {
            enabled: process.env.NODE_ENV === 'development',
            /* when using generateSW the PWA plugin will switch to classic */
            type: 'module',
            navigateFallback: 'index.html',
          }
      })
    ],
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./vitest.setup.mjs",
      deps: {
        // inline: ["vitest-canvas-mock"],
        optimizer: {
          web: {
            include: ['vitest-canvas-mock'],
          },
        },
      },
      environmentOptions: {
        jsdom: {
          resources: "usable",
        },
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
    server: {
      port: 3000,
    },
    preview: {
      port: 3000,
    },
    define: { "process.env.NODE_ENV": `"${mode}"`,
   },
  });
};
