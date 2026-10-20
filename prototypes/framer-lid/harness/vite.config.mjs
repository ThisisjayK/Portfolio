// Local test bed for HeadLidLift.tsx. Not part of what goes into Framer.
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { fileURLToPath } from "node:url"

const here = p => fileURLToPath(new URL(p, import.meta.url))

export default defineConfig({
  root: here("."),
  publicDir: here(".."),
  plugins: [react()],
  resolve: { alias: { framer: here("./framer-stub.ts") } },
  server: { port: 4322, strictPort: true },
})
