import { describe, expect, it } from 'vitest'
import { sampleVenue } from '../data/sampleVenue'
import { candidates } from '../data/candidateVenues'
import { pageSchema } from './pageSchema'

describe('pageSchema', () => {
  it('accepts a valid versioned venue', () => {
    expect(pageSchema.parse(sampleVenue).pageVersionId).toBe('pv-summer-003')
  })

  it('rejects an unregistered component', () => {
    const invalid = {
      ...sampleVenue,
      components: [...sampleVenue.components, { id: 'x', type: 'html', props: {}, locked: false, trackingId: 'x' }],
    }
    expect(pageSchema.safeParse(invalid).success).toBe(false)
  })

  it('keeps every AI candidate inside the page contract', () => {
    expect(candidates.every((candidate) => pageSchema.safeParse(candidate.venue).success)).toBe(true)
  })
})
