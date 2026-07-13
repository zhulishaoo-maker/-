export type CandidateStatus = 'queued' | 'generating' | 'validating' | 'ready' | 'failed' | 'refining' | 'reviewing' | 'approved'

export type RuleCheck = {
  id: 'brand-overlay' | 'search-overlay' | 'safe-area' | 'copy-length' | 'dimensions'
  label: string
  detail: string
  passed: boolean
  locked?: boolean
}

export type CreativeCandidate = {
  id: string
  index: number
  status: CandidateStatus
  progress: number
  version: number
  title: string
  subtitle: string
  cta: string
  rules: RuleCheck[]
  error?: string
}

const titles = ['冰爽开场', '清凉好物', '盛夏焕新', '热爱降温']

export function createCandidateBatch(batchId: string): CreativeCandidate[] {
  return titles.map((title, index) => ({
    id: `${batchId}-candidate-${index + 1}`,
    index,
    status: 'queued',
    progress: 0,
    version: 1,
    title,
    subtitle: '清凉一夏，好物即刻拥有',
    cta: '立即抢购',
    rules: createRuleChecks(),
  }))
}

export function createRuleChecks(): RuleCheck[] {
  return [
    { id: 'brand-overlay', label: '京东大促品牌压板', detail: 'JD 618 / v3.2', passed: true, locked: true },
    { id: 'search-overlay', label: '京东搜索框压板', detail: '底部安全区内', passed: true, locked: true },
    { id: 'safe-area', label: '主体安全区', detail: '边距 ≥ 32px', passed: true },
    { id: 'copy-length', label: '营销文案', detail: '标题 ≤ 12 字', passed: true },
    { id: 'dimensions', label: '尺寸与清晰度', detail: '750 × 1000 / 2x', passed: true },
  ]
}

export function transitionCandidate(candidate: CreativeCandidate, status: CandidateStatus, progress: number): CreativeCandidate {
  return { ...candidate, status, progress: Math.max(0, Math.min(100, progress)), error: status === 'failed' ? candidate.error : undefined }
}

export function failCandidate(candidate: CreativeCandidate, error: string): CreativeCandidate {
  return { ...candidate, status: 'failed', progress: 68, error }
}

export function retryCandidate(candidate: CreativeCandidate): CreativeCandidate {
  return { ...candidate, status: 'generating', progress: 12, version: candidate.version + 1, error: undefined }
}

export function updateCandidateCopy(candidate: CreativeCandidate, copy: Pick<CreativeCandidate, 'title' | 'subtitle' | 'cta'>): CreativeCandidate {
  const copyPassed = copy.title.trim().length > 0 && copy.title.trim().length <= 12 && copy.cta.trim().length > 0 && copy.cta.trim().length <= 6
  return {
    ...candidate,
    ...copy,
    version: candidate.version + 1,
    status: 'ready',
    rules: candidate.rules.map((rule) => rule.id === 'copy-length' ? { ...rule, passed: copyPassed, detail: copyPassed ? '标题 ≤ 12 字 · CTA ≤ 6 字' : '文案超出限制' } : rule),
  }
}

export function canSubmitReview(candidate: CreativeCandidate) {
  return candidate.status === 'ready' && candidate.rules.every((rule) => rule.passed)
}

export function deriveBatchProgress(candidates: CreativeCandidate[]) {
  return Math.round(candidates.reduce((sum, candidate) => sum + candidate.progress, 0) / candidates.length)
}

