export function filterSlotOptions(options: string[], query: string) {
  const normalized = query.trim().toLocaleLowerCase()
  if (!normalized) return options
  return options.filter((option) => option.toLocaleLowerCase().includes(normalized))
}

export function resolveSlotValue(draft: string, fallback: string) {
  return draft.trim() || fallback
}

export function moveSlotHighlight(current: number, direction: 1 | -1, optionCount: number) {
  if (optionCount === 0) return -1
  if (current < 0) return direction === 1 ? 0 : optionCount - 1
  return (current + direction + optionCount) % optionCount
}

