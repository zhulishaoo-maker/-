import type { PageSchema } from '../schema/pageSchema'
import { sampleVenue } from './sampleVenue'

export type CandidateId = 'stable' | 'balanced' | 'explore'

export type Candidate = {
  id: CandidateId
  name: string
  label: string
  confidence: number
  expectedLift: string
  rationale: string
  venue: PageSchema
}

const clone = (): PageSchema => structuredClone(sampleVenue)

const updateProductGrid = (
  venue: PageSchema,
  update: (grid: Extract<PageSchema['components'][number], { type: 'product-grid' }>) => Extract<PageSchema['components'][number], { type: 'product-grid' }>,
) => {
  const index = venue.components.findIndex((component) => component.type === 'product-grid')
  const grid = venue.components[index]
  if (!grid || grid.type !== 'product-grid') throw new Error('Candidate requires a product-grid component')
  venue.components[index] = update(grid)
}

const stable = clone()
stable.pageVersionId = 'pv-summer-stable'
updateProductGrid(stable, (grid) => ({ ...grid, props: { ...grid.props, strategy: 'conversion', title: '热卖稳赢榜' } }))

const explore = clone()
explore.pageVersionId = 'pv-summer-explore'
updateProductGrid(explore, (grid) => ({
  ...grid,
  props: { ...grid.props, strategy: 'exploration', title: '夏日新势力', products: [...grid.props.products].reverse() },
}))

export const candidates: Candidate[] = [
  { id: 'stable', name: '稳健版', label: 'A', confidence: 92, expectedLift: '+1.8%', rationale: '优先历史高转化商品，适合大流量首发。', venue: stable },
  { id: 'balanced', name: '均衡版', label: 'B', confidence: 86, expectedLift: '+3.2%', rationale: '保留热卖基盘，为控油新品分配 20% 探索流量。', venue: sampleVenue },
  { id: 'explore', name: '探索版', label: 'C', confidence: 71, expectedLift: '+4.6%', rationale: '提高新品和高毛利商品权重，波动风险较高。', venue: explore },
]
