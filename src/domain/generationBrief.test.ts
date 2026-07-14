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

  it('uses the operator edited sentence copy in the final prompt', () => {
    const state = {
      ...defaultComposerState,
      promptCopy: { ...defaultComposerState.promptCopy, prefix: '请为', afterCampaign: '快速设计一组', afterBenefit: '；并应用' },
    }
    expect(composePrompt(state)).toBe('请为清凉季快速设计一组开屏，主推个护美妆，核心权益是满 300 减 50；并应用京东 618 品牌压板和京东搜索框压板，整体采用清透冰感风格，输出3:4 · 750×1000。')
  })
})
