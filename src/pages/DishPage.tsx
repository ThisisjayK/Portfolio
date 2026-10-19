// One page per dish on the cooking menu (Jayanth, 2026-10-18), at /cooking/<key>. Same frame as
// the letter pages: one fixed screen, one centred column that scrolls, the grid hop on the way
// in and out. Top to bottom: the name and the close cross (back to the cooking menu), the
// photo, a mono line for serves and time, the backstory, the ingredients, the method.
// Anything Jayanth hasn't written yet shows as "[Needs your answer: …]".
import { useLayoutEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import CloseCross from '../components/CloseCross'
import RevealText from '../components/RevealText'
import { hopIn } from '../components/pageHop'
import type { Dish } from '../content/dishes'
import './LetterPage.css'
import './DishPage.css'

const pad = (n: number) => String(n).padStart(2, '0')
const ask = (what: string) => `[Needs your answer: ${what}]`

export default function DishPage({ dish }: { dish: Dish }) {
  const shell = useRef<HTMLDivElement>(null)
  const scroller = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
    scroller.current?.focus({ preventScroll: true })
    if (reduced || !shell.current) return
    return hopIn(shell.current)
  }, [dish, reduced])

  const backstory = dish.backstory?.length ? dish.backstory : [ask('the backstory of this dish')]

  return (
    <div ref={shell} className="lp-shell">
      <article ref={scroller} className="lp" aria-labelledby="dish-title" tabIndex={-1}>
        <div className="lp-column">
          <div className="lp-head">
            <h1 id="dish-title" className="display lp-title" data-hop>
              {dish.name}
            </h1>
            <CloseCross
              slug="cooking"
              to="/cooking"
              label="Close, back to the cooking menu"
              state={{ fromDish: dish.key }}
            />
          </div>

          <img className="dish-photo" src={dish.img} alt={dish.name} data-hop />

          <p className="dish-meta mono" data-hop>
            {dish.meta ?? ask('serves and time')}
          </p>

          {backstory.map((p, k) => (
            <RevealText key={k} className="lp-text" text={p} data-hop />
          ))}

          <h2 className="dish-section mono">Ingredients</h2>
          {dish.ingredients?.length ? (
            <ul className="dish-ingredients">
              {dish.ingredients.map((g, k) => (
                <li key={k}>
                  <span className="dish-amount mono">{g.amount ?? ''}</span>
                  <span>{g.item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="lp-text">{ask('the ingredients, with amounts')}</p>
          )}

          <h2 className="dish-section mono">Method</h2>
          {dish.steps?.length ? (
            <ol className="dish-steps">
              {dish.steps.map((step, k) => (
                <li key={k}>
                  <span className="dish-step-num mono" aria-hidden="true">
                    {pad(k + 1)}
                  </span>
                  <p className="dish-step-text">{step}</p>
                </li>
              ))}
            </ol>
          ) : (
            <p className="lp-text">{ask('the steps')}</p>
          )}
        </div>
      </article>
    </div>
  )
}
