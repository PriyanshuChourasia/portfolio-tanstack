import { useCallback } from 'react'

export function useListField<T>(
  items: Array<T>,
  setItems: (items: Array<T>) => void,
) {
  const add = useCallback(
    (item: T) => setItems([...items, item]),
    [items, setItems],
  )

  const update = useCallback(
    (index: number, patch: Partial<T>) =>
      setItems(
        items.map((item, i) => (i === index ? { ...item, ...patch } : item)),
      ),
    [items, setItems],
  )

  const remove = useCallback(
    (index: number) => setItems(items.filter((_, i) => i !== index)),
    [items, setItems],
  )

  return { items, add, update, remove }
}
