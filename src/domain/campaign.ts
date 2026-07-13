export type JourneyStatus = 'active' | 'ready' | 'watching'

export type JourneyStage = {
  id: 'exposure' | 'interest' | 'arrival' | 'conversion' | 'sharing'
  name: string
  objective: string
  assets: number
  metric: string
  value: string
  status: JourneyStatus
}

export type AgentRun = {
  id: string
  agent: string
  task: string
  status: 'done' | 'running' | 'review'
  evidence: string
}

export const campaignStages: JourneyStage[] = [
  { id: 'exposure', name: '曝光', objective: '建立活动认知', assets: 7, metric: '曝光', value: '128.4万', status: 'active' },
  { id: 'interest', name: '兴趣', objective: '激发点击与探索', assets: 12, metric: 'CTR', value: '6.42%', status: 'active' },
  { id: 'arrival', name: '到达', objective: '承接流量意图', assets: 3, metric: '到达率', value: '82.6%', status: 'watching' },
  { id: 'conversion', name: '转化', objective: '权益驱动下单', assets: 5, metric: '支付转化', value: '4.18%', status: 'ready' },
  { id: 'sharing', name: '再传播', objective: '促进分享回流', assets: 4, metric: '分享率', value: '1.36%', status: 'ready' },
]

export const agentRuns: AgentRun[] = [
  { id: 'design', agent: '设计智能体', task: '生成 4 组清凉季主视觉并完成品牌压板', status: 'done', evidence: '4 个资产 · 校验通过' },
  { id: 'venue', agent: '会场运营智能体', task: '优化首楼利益点与防晒商品排序', status: 'running', evidence: '预计提升加购率 3.2%' },
  { id: 'channel', agent: '渠道运营智能体', task: '匹配开屏、首页 Banner 与品类资源位', status: 'done', evidence: '7 个资源位 · 频控正常' },
  { id: 'data', agent: '数据分析智能体', task: '诊断点击正常但会场到达率下降', status: 'review', evidence: '置信度 87% · 建议实验' },
  { id: 'governance', agent: '治理智能体', task: '复核权益、价格、授权与品牌一致性', status: 'done', evidence: '0 个阻断项' },
]

export function totalCampaignAssets(stages = campaignStages) {
  return stages.reduce((sum, stage) => sum + stage.assets, 0)
}
