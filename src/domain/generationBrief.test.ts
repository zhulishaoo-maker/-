import { describe, expect, it } from 'vitest'
import { buildGenerationBrief, composePrompt, defaultComposerState } from './generationBrief'

describe('GenerationBrief', () => {
  it('always creates four outputs', () => {
    const brief = buildGenerationBrief(defaultComposerState, new Date('2026-07-13T00:00:00Z'))
    expect(brief.outputCount).toBe(4)
    expect(brief.id).toBe('brief-1783900800000')
  })

  it('keeps slots synchronized with the natural language prompt', () => {
    const state = { ...defaultComposerState, benefit: '每满 200 减 30', style: '高饱和未来感' }
    const prompt = composePrompt(state)
    expect(prompt).toContain('每满 200 减 30')
    expect(prompt).toContain('高饱和未来感')
    expect(prompt).toContain('京东搜索框压板')
  })
})
