// "Some Drake artifacts I own:" at the end of the Drake page (Jayanth, 2026-10-19): a numbered
// list, each with its picture. 01 is the book; the owl chain and Nocta shoes come next.
import { artifacts } from '../content/drake'
import Book3D from './Book3D'
import './DrakeArtifacts.css'

export default function DrakeArtifacts() {
  return (
    <section className="artifacts" aria-labelledby="artifacts-title" data-hop>
      <h2 id="artifacts-title" className="display artifacts-title">
        Some Drake artifacts I own:
      </h2>
      <ol className="artifacts-list">
        {artifacts.map((a, n) => (
          <li key={a.name} className="artifact">
            <p className="artifact-head">
              <span className="artifact-num mono" aria-hidden="true">
                {String(n + 1).padStart(2, '0')}
              </span>
              <span className="artifact-name">{a.name}</span>
              <span className="artifact-detail">{a.detail}</span>
            </p>
            {a.spin ? (
              <Book3D cover={a.img} back={a.spin.back} spine={a.spin.spine} alt={a.alt} />
            ) : (
              <img className="artifact-img" src={a.img} alt={a.alt} />
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}
