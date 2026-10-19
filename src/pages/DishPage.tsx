// One page per dish on the cooking menu (Jayanth, 2026-10-18), at /cooking/<key>. Same frame as
// the letter pages: one fixed screen, one centred column that scrolls, the grid hop on the way
// in and out. Top to bottom: the name and the close cross (back to the cooking menu), the
// picture with its ingredients labelled by arrows (DishFigure). Ingredients only, no recipe
// or backstory (Jayanth, 2026-10-19).
import { useLayoutEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import CloseCross from '../components/CloseCross'
import DishFigure from '../components/DishFigure'
import { hopIn } from '../components/pageHop'
import type { Dish } from '../content/dishes'
import './LetterPage.css'
import './DishPage.css'

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

  return (
    <div ref={shell} className="lp-shell">
      <article ref={scroller} className="lp" aria-labelledby="dish-title" tabIndex={-1}>
        <div className="lp-column">
          <div className="lp-head">
            <h1 id="dish-title" className="display lp-title dish-title" data-hop>
              {dish.name}
            </h1>
            <CloseCross
              slug="cooking"
              to="/cooking"
              label="Close, back to the cooking menu"
              state={{ fromDish: dish.key }}
            />
          </div>

          <DishFigure dish={dish} />
        </div>
      </article>
    </div>
  )
}
