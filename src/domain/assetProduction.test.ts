import { describe, expect, it } from 'vitest'
import { canSubmitReview, createCandidateBatch, deriveBatchProgress, failCandidate, retryCandidate, transitionCandidate, updateCandidateCopy } from './assetProduction'

describe('creative asset production', () => {
  it('creates exactly four independent candidate slots', () => {
    const candidates = createCandidateBatch('batch-1')
    expect(candidates).toHaveLength(4)
    expect(new Set(candidates.map((candidate) => candidate.id)).size).toBe(4)
    expect(candidates.every((candidate) => candidate.status === 'queued')).toBe(true)
  })

  it('retries only the failed candidate with a new version', () => {
    const original = createCandidateBatch('batch-1')
    const failed = failCandidate(original[2], 'timeout')
    const retried = retryCandidate(failed)
    expect(retried.status).toBe('generating')
    expect(retried.version).toBe(2)
    expect(retried.error).toBeUndefined()
    expect(original[0].status).toBe('queued')
  })

  it('blocks review when editable copy violates limits', () => {
    const ready = transitionCandidate(createCandidateBatch('batch-1')[0], 'ready', 100)
    expect(canSubmitReview(ready)).toBe(true)
    const invalid = updateCandidateCopy(ready, { title: '这是一个明显超过十二个汉字长度限制的标题', subtitle: '夏日好物', cta: '立即抢购' })
    expect(canSubmitReview(invalid)).toBe(false)
  })

  it('derives batch progress from candidate progress', () => {
    const candidates = createCandidateBatch('batch-1').map((candidate, index) => transitionCandidate(candidate, 'generating', index * 25))
    expect(deriveBatchProgress(candidates)).toBe(38)
  })
})
