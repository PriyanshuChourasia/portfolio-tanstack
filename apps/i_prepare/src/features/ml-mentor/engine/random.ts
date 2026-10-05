/** Shuffle + sample helpers with an injectable rng (deterministic in tests). */
export function shuffle<T>(items: T[], rng: () => number = Math.random): T[] {
  const array = [...items]
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export function randomSample<T>(items: T[], count: number, rng: () => number = Math.random): T[] {
  if (count >= items.length) return shuffle(items, rng)
  return shuffle(items, rng).slice(0, count)
}
