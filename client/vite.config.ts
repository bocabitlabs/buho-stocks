/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
// https://vitejs.dev/config/
import svgr from "vite-plugin-svgr";
import eslint from "vite-plugin-eslint";
export default ({ command, mode }) => {
  return defineConfig({
    plugins: [
      react(),
      viteTsconfigPaths(),
      svgr(),
      eslint(),
    ],
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.ts",
      deps: {
        inline: ["vitest-canvas-mock"],
      },
      threads: false,
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
    define: { "process.env.NODE_ENV": `"${mode}"` },
  });
};
