import { describe, expect, it } from 'vitest'
import { filterSlotOptions, moveSlotHighlight, resolveSlotValue } from './editableSlot'

describe('editable prompt slot', () => {
  it('filters recommendations without rejecting custom text', () => {
    expect(filterSlotOptions(['清凉季', '京东 618', '新品首发'], '京东')).toEqual(['京东 618'])
    expect(filterSlotOptions(['清凉季'], '自定义主题')).toEqual([])
  })

  it('restores the last valid value for empty input', () => {
    expect(resolveSlotValue('  ', '清凉季')).toBe('清凉季')
    expect(resolveSlotValue('盛夏焕新', '清凉季')).toBe('盛夏焕新')
  })

  it('wraps keyboard highlight across recommendations', () => {
    expect(moveSlotHighlight(-1, 1, 3)).toBe(0)
    expect(moveSlotHighlight(2, 1, 3)).toBe(0)
    expect(moveSlotHighlight(0, -1, 3)).toBe(2)
  })
})
