// Stand-in for Framer's `framer` package, which only exists inside Framer.
export const ControlType = new Proxy({} as Record<string, string>, { get: (_, k) => String(k) })
export function addPropertyControls(component: unknown, controls: unknown) {
  ;(component as { propertyControls?: unknown }).propertyControls = controls
}
