// Site-wide UI state shared by the nav, the hero and the cards:
//  - which floating card is open (Work or Contact), if any
//  - whether the visitor has "zoomed into" the pink (the nav and card colour change)
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type CardName = 'work' | 'contact'

type Ctx = {
  card: CardName | null
  openCard: (name: CardName) => void
  closeCard: () => void
  onPink: boolean
  setOnPink: (v: boolean) => void
}

const CardsContext = createContext<Ctx | null>(null)

export function CardsProvider({ children }: { children: ReactNode }) {
  const [card, setCard] = useState<CardName | null>(null)
  const [onPink, setOnPink] = useState(false)
  const openCard = useCallback((name: CardName) => setCard(name), [])
  const closeCard = useCallback(() => setCard(null), [])
  const value = useMemo(() => ({ card, openCard, closeCard, onPink, setOnPink }), [card, openCard, closeCard, onPink])
  return <CardsContext.Provider value={value}>{children}</CardsContext.Provider>
}

export function useCards() {
  const ctx = useContext(CardsContext)
  if (!ctx) throw new Error('useCards must be used inside CardsProvider')
  return ctx
}

/** Old /work and /contact links: show the home page with that card open. */
export function OpenCardOnMount({ name, children }: { name: CardName; children: ReactNode }) {
  const { openCard } = useCards()
  useEffect(() => {
    openCard(name)
  }, [name, openCard])
  return <>{children}</>
}
