import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "node:path"
import { fileURLToPath } from "node:url"

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const DOCS_DIR = path.resolve(rootDir, "docs")

// Dev serves from root ("/"); the production build uses relative asset paths
// ("./") so the bundle works from https://USER.github.io/Portfolio/.
// It builds into ./docs, the folder GitHub Pages serves. emptyOutDir:false
// keeps the build from clearing that folder wholesale; everything in it is
// regenerated anyway (the bundle, plus the files Vite copies from public/), and
// the prebuild script clears docs/assets so stale hashed bundles don't pile up.
export default defineConfig(({ command }) => ({
  base: command === "build" ? "./" : "/",
  plugins: [react()],
  server: {
    watch: {
      // outDir is ./docs, inside the watched root, so a build running while the
      // dev server is up makes the watcher churn on the server's own output:
      // an HMR storm as each emitted file lands, a spurious "vite.config.ts
      // changed, restarting server", and the client left polling a server that
      // restarted under it. Vite appends this to its own defaults (.git,
      // node_modules), so listing it here does not drop those.
      ignored: [`${DOCS_DIR}/**`],
    },
  },
  build: {
    outDir: "docs",
    emptyOutDir: false,
    assetsDir: "assets",
    rollupOptions: {
      // Two HTML entries: the SPA (index.html) and a standalone 404 page that
      // GitHub Pages serves for unknown paths (docs/404.html).
      input: {
        main: path.resolve(rootDir, "index.html"),
        notFound: path.resolve(rootDir, "404.html"),
      },
    },
  },
}))
