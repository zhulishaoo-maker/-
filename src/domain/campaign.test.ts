import { describe, expect, it } from 'vitest'
import { campaignStages, totalCampaignAssets } from './campaign'

describe('campaign journey', () => {
  it('contains the full five-stage journey', () => {
    expect(campaignStages.map((stage) => stage.id)).toEqual(['exposure', 'interest', 'arrival', 'conversion', 'sharing'])
  })

  it('aggregates assets across all journey stages', () => {
    expect(totalCampaignAssets()).toBe(31)
  })
})
