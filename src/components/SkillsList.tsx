// The Skills page's list (Jayanth, 2026-10-19): numbered groups between thin rules, like the
// cooking menu, each name with its items under it (two columns on desktop). Text only, so the grid hop
// and screen readers get it as plain lists. Content in src/content/skills.ts.
import { languages, skillGroups } from '../content/skills'
import './SkillsList.css'

const groups = [...skillGroups, languages]

export default function SkillsList() {
  return (
    <ol className="skills" aria-label="Skills">
      {groups.map((g, i) => (
        <li key={g.name} className="skills-group">
          <span className="skills-num mono" aria-hidden="true" data-hop>
            {String(i + 1).padStart(2, '0')}
          </span>
          <h2 className="skills-name" data-hop>
            {g.name}
          </h2>
          <ul className="skills-items" data-hop>
            {g.items.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  )
}
