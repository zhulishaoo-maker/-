export const taskTypes = ['开屏', '营销海报', 'Banner / 资源位', '营销会场'] as const
export type TaskType = (typeof taskTypes)[number]

export type ComposerState = {
  taskType: TaskType
  campaign: string
  category: string
  benefit: string
  brandOverlay: string
  searchOverlay: string
  style: string
  ratio: string
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
}

export function composePrompt(state: ComposerState) {
  return `为${state.campaign}创建${state.taskType}，主推${state.category}，核心权益${state.benefit}。使用${state.brandOverlay}与${state.searchOverlay}，整体采用${state.style}风格，输出${state.ratio}规格。`
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
