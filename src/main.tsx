import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App"
import "./index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Clear the boot loader (declared in index.html) once React has painted. Two
// rAFs wait for the first real frame rather than just the render call, so the
// loader fades out over the mounted UI instead of over a still-blank root.
const boot = document.getElementById("boot")
if (boot) {
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      boot.classList.add("boot--done")
      window.setTimeout(() => boot.remove(), 600)
    }),
  )
}
