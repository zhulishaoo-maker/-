export const taskTypes = ['开屏', '营销海报', 'Banner / 资源位', '营销会场'] as const
export type TaskType = (typeof taskTypes)[number]

export type PromptCopy = {
  prefix: string
  afterCampaign: string
  afterTask: string
  afterCategory: string
  afterBenefit: string
  afterBrandOverlay: string
  afterSearchOverlay: string
  afterStyle: string
  suffix: string
}

export const defaultPromptCopy: PromptCopy = {
  prefix: '为',
  afterCampaign: '创建一组',
  afterTask: '，主推',
  afterCategory: '，核心权益是',
  afterBenefit: '。应用',
  afterBrandOverlay: '和',
  afterSearchOverlay: '，整体采用',
  afterStyle: '风格，输出',
  suffix: '。',
}

export type ComposerState = {
  taskType: TaskType
  campaign: string
  category: string
  benefit: string
  brandOverlay: string
  searchOverlay: string
  style: string
  ratio: string
  promptCopy: PromptCopy
}

export type GenerationBrief = ComposerState & {
  id: string
  outputCount: 4
  prompt: string
  createdAt: string
}

export const defaultComposerState: ComposerState = {
  taskType: '开屏',
  campaign: '清凉季',
  category: '个护美妆',
  benefit: '满 300 减 50',
  brandOverlay: '京东 618 品牌压板',
  searchOverlay: '京东搜索框压板',
  style: '清透冰感',
  ratio: '3:4 · 750×1000',
  promptCopy: defaultPromptCopy,
}

export function composePrompt(state: ComposerState) {
  const copy = state.promptCopy
  return `${copy.prefix}${state.campaign}${copy.afterCampaign}${state.taskType}${copy.afterTask}${state.category}${copy.afterCategory}${state.benefit}${copy.afterBenefit}${state.brandOverlay}${copy.afterBrandOverlay}${state.searchOverlay}${copy.afterSearchOverlay}${state.style}${copy.afterStyle}${state.ratio}${copy.suffix}`
}

export function buildGenerationBrief(state: ComposerState, now = new Date()): GenerationBrief {
  return {
    ...state,
    id: `brief-${now.getTime()}`,
    outputCount: 4,
    prompt: composePrompt(state),
    createdAt: now.toISOString(),
  }
}
