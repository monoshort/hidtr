import { defineConfig } from "vite";
import { cpSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve("web");
const out = resolve("dist");

function copyScripts() {
  return {
    name: "copy-scripts",
    closeBundle() {
      for (const file of ["content.js", "ht-links.js", "ht-article-reader.js", "search-index.js", "topic-illustrations.js", "mens-diagram.js", "topic-page.js", "app.js"]) {
        cpSync(resolve(root, file), resolve(out, file));
      }
    },
  };
}

export default defineConfig({
  root: "web",
  publicDir: "public",
  base: process.env.VITE_BASE || "/",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      "/api/ht-search": {
        target: "https://search.hiddentreasures.org",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ht-search/, "/elasticsearch/search-nl/_search"),
      },
    },
  },
  plugins: [copyScripts()],
});
