// Runs before `npm run dev` and `npm run build` via npm's pre* hooks.
//
// 1. Clears docs/assets. The build uses emptyOutDir:false so it does not wipe
//    docs/favicon.svg and the other files copied from public/, which means stale
//    hashed bundles would otherwise pile up there forever.
//
// 2. Copies the compiled resume into public/ under the name the site links to.
//    resume/resume.pdf is the one tracked copy; public/jayanth-resume.pdf is
//    generated and gitignored. Before this, the public/ copy was made by hand,
//    so editing resume.tex and forgetting to re-copy silently shipped a stale
//    resume while every link kept working.
import { copyFileSync, existsSync, mkdirSync, rmSync } from "node:fs"

rmSync("docs/assets", { recursive: true, force: true })

const RESUME_SRC = "resume/resume.pdf"
const RESUME_OUT = "public/jayanth-resume.pdf"

if (existsSync(RESUME_SRC)) {
  mkdirSync("public", { recursive: true })
  copyFileSync(RESUME_SRC, RESUME_OUT)
  console.log(`sync-assets: ${RESUME_SRC} -> ${RESUME_OUT}`)
} else {
  // Not fatal: the LaTeX source may not have been compiled on this machine. The
  // resume link would 404, which is loud enough to notice, and far better than
  // failing every build for someone who only touched CSS.
  console.warn(
    `sync-assets: ${RESUME_SRC} not found, leaving ${RESUME_OUT} untouched. ` +
      `Recompile resume/resume.tex if the resume link 404s.`,
  )
}
