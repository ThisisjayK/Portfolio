import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const DOCS_DIR = path.resolve(rootDir, "docs")

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".txt": "text/plain; charset=utf-8",
}

// Dev-only: serve the static teardown decks (docs/<name>/) the way GitHub Pages
// serves them in production. Without this, the dev server's SPA fallback
// answers /kick/ with the app itself, so the InfiniteMenu link never reaches
// the real deck and the relative path keeps compounding (/kick/kick/kick/...).
function serveDecks() {
  return {
    name: "serve-decks",
    apply: "serve",
    configureServer(server: import("vite").ViteDevServer) {
      const decks = fs.existsSync(DOCS_DIR)
        ? fs
            .readdirSync(DOCS_DIR, { withFileTypes: true })
            .filter(
              (d) =>
                d.isDirectory() &&
                fs.existsSync(path.join(DOCS_DIR, d.name, "index.html")),
            )
            .map((d) => d.name)
        : []

      server.middlewares.use((req, res, next) => {
        const rawUrl = (req.url || "").split("?")[0]
        let url: string
        try {
          url = decodeURIComponent(rawUrl)
        } catch {
          return next()
        }
        const seg = url.split("/")[1]
        if (!seg || !decks.includes(seg)) return next()

        // /kick -> /kick/ so the deck's relative asset paths resolve.
        if (url === "/" + seg) {
          res.statusCode = 301
          res.setHeader("Location", url + "/")
          return res.end()
        }

        let filePath = path.join(DOCS_DIR, url)
        if (url.endsWith("/")) filePath = path.join(filePath, "index.html")

        // Never escape the docs directory.
        const rel = path.relative(DOCS_DIR, filePath)
        if (rel.startsWith("..") || path.isAbsolute(rel)) return next()
        if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile())
          return next()

        res.setHeader(
          "Content-Type",
          MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream",
        )
        fs.createReadStream(filePath).pipe(res)
      })
    },
  }
}

// Dev serves from root ("/"); the production build uses relative asset paths
// ("./") so the bundle works from https://USER.github.io/Portfolio/.
// It builds into ./docs (the folder GitHub Pages serves) without wiping
// docs/kick, docs/favicon.svg, etc. (emptyOutDir:false); the prebuild
// script clears only docs/assets so stale hashed bundles don't pile up.
export default defineConfig(({ command }) => ({
  base: command === "build" ? "./" : "/",
  plugins: [react(), serveDecks()],
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
