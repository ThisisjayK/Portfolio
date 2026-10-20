// A floating book that turns slowly (Jayanth, 2026-10-19, after a recording of a rotating
// book mock-up). Built in CSS 3D: the front is straightened from Jayanth's own photo; the back
// and spine are straightened from the publisher's mock-up (the cover text wraps around the
// spine) and recoloured to match his front; the page edges are drawn. It bobs gently, casts a
// soft shadow and pauses under the pointer. Reduced motion: held still at an angle.
import './Book3D.css'

export default function Book3D({ cover, back, spine, alt }: { cover: string; back: string; spine: string; alt: string }) {
  return (
    <div className="book3d" role="img" aria-label={alt}>
      <div className="book3d-float">
        <div className="book3d-tilt">
          <div className="book3d-spin">
            <img className="book3d-face book3d-front" src={cover} alt="" draggable={false} />
            <img className="book3d-face book3d-back" src={back} alt="" draggable={false} />
            <img className="book3d-face book3d-spine" src={spine} alt="" draggable={false} />
            <div className="book3d-face book3d-pages book3d-right" />
            <div className="book3d-face book3d-pages book3d-top" />
            <div className="book3d-face book3d-pages book3d-bottom" />
          </div>
        </div>
      </div>
      <div className="book3d-shadow" aria-hidden="true" />
    </div>
  )
}
