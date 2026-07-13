import { useMemo, useState } from 'react'
import { Activity, Bot, Check, ChevronDown, CircleCheck, Code2, Eye, Gauge, GitBranch, LockKeyhole, PanelLeftClose, Play, RotateCcw, ShieldCheck, Sparkles, UnlockKeyhole } from 'lucide-react'
import { VenuePreview } from './components/VenuePreview'
import { componentRegistry } from './components/venue/registry'
import { sampleVenue } from './data/sampleVenue'
import { candidates, type CandidateId } from './data/candidateVenues'
import { pageSchema } from './schema/pageSchema'

type Tab = 'brief' | 'structure' | 'rules'

export function App() {
  const [tab, setTab] = useState<Tab>('structure')
  const [selectedId, setSelectedId] = useState('grid-01')
  const [previewMode, setPreviewMode] = useState<'mobile' | 'wide'>('mobile')
  const [candidateId, setCandidateId] = useState<CandidateId>('balanced')
  const [venue, setVenue] = useState(() => structuredClone(sampleVenue))
  const [candidateOpen, setCandidateOpen] = useState(false)
  const [reviewState, setReviewState] = useState<'draft' | 'checking' | 'submitted'>('draft')
  const candidate = candidates.find((item) => item.id === candidateId)!
  const validation = useMemo(() => pageSchema.safeParse(venue), [venue])
  const selected = venue.components.find((item) => item.id === selectedId)!

  const chooseCandidate = (id: CandidateId) => {
    const next = candidates.find((item) => item.id === id)!
    setCandidateId(id)
    setVenue(structuredClone(next.venue))
    setCandidateOpen(false)
    setReviewState('draft')
  }

  const toggleLock = () => {
    setVenue((current) => ({
      ...current,
      components: current.components.map((item) => item.id === selectedId ? { ...item, locked: !item.locked } : item),
    }))
    setReviewState('draft')
  }

  const submitReview = () => {
    if (!validation.success || reviewState !== 'draft') return
    setReviewState('checking')
    window.setTimeout(() => setReviewState('submitted'), 700)
  }

  return (
    <div className="app-shell">
      <aside className="rail">
        <div className="mark">VP<span>AI</span></div>
        <nav>
          <button className="active" aria-label="会场"><PanelLeftClose /></button>
          <button aria-label="AI 智能体"><Bot /></button>
          <button aria-label="实验"><GitBranch /></button>
          <button aria-label="指标"><Gauge /></button>
        </nav>
        <div className="rail-status"><span />L0</div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div className="breadcrumb"><span>活动会场</span><b>/</b><strong>{sampleVenue.metadata.title}</strong><em>v003</em></div>
          <div className="top-actions">
            <span className="save-state"><CircleCheck size={14} />已保存</span>
            <button className="ghost"><Eye size={16} />预览</button>
            <button className={`review-button ${reviewState}`} onClick={submitReview} disabled={!validation.success || reviewState !== 'draft'}>
              {reviewState === 'submitted' ? <Check size={15} /> : <Play size={15} fill="currentColor" />}
              {reviewState === 'draft' ? '提交审核' : reviewState === 'checking' ? '规则复检中' : '已提交审核'}
            </button>
          </div>
        </header>

        <section className="control-panel">
          <div className="panel-head">
            <div><span className="kicker">CAMPAIGN BLUEPRINT</span><h1>夏日美妆狂欢</h1></div>
            <div className="candidate-picker">
              <button className="ai-pill" onClick={() => setCandidateOpen((open) => !open)}><Sparkles size={15} />AI {candidate.name} <ChevronDown size={14} /></button>
              {candidateOpen && <div className="candidate-menu">
                {candidates.map((item) => <button key={item.id} className={candidateId === item.id ? 'active' : ''} onClick={() => chooseCandidate(item.id)}>
                  <span>{item.label}</span><div><strong>{item.name}</strong><small>预期 {item.expectedLift} · 信心 {item.confidence}%</small></div>{candidateId === item.id && <Check size={14} />}
                </button>)}
              </div>}
            </div>
          </div>

          <div className="tabs">
            {([['brief', '活动 Brief'], ['structure', '页面结构'], ['rules', '规则与护栏']] as const).map(([key, label]) => (
              <button key={key} className={tab === key ? 'active' : ''} onClick={() => setTab(key)}>{label}</button>
            ))}
          </div>

          {tab === 'structure' && <>
            <div className="schema-summary">
              <div><Code2 /><span><small>PAGE SCHEMA</small><strong>v{sampleVenue.schemaVersion}</strong></span></div>
              <div><ShieldCheck /><span><small>校验状态</small><strong>{validation.success ? '全部通过' : '存在错误'}</strong></span></div>
              <div><Activity /><span><small>埋点覆盖</small><strong>3 / 3</strong></span></div>
            </div>
            <div className="component-list">
              {venue.components.map((component, index) => {
                const meta = componentRegistry[component.type]
                return <button key={component.id} className={selectedId === component.id ? 'selected' : ''} onClick={() => setSelectedId(component.id)}>
                  <span className="drag">{String(index + 1).padStart(2, '0')}</span>
                  <span className="component-icon">{component.type === 'benefit-hero' ? '日' : component.type === 'coupon-strip' ? '券' : '品'}</span>
                  <span className="component-meta"><strong>{meta.label}</strong><small>{component.trackingId}</small></span>
                  <em className={meta.risk}>{meta.risk === 'high' ? '核心' : '可调权'}</em>
                  {component.locked && <LockKeyhole size={14} />}
                </button>
              })}
            </div>
            <div className="inspector">
              <span className="kicker">SELECTED COMPONENT</span><h3>{componentRegistry[selected.type].label}</h3>
              <div className="inspector-row"><span>组件 ID</span><code>{selected.id}</code></div>
              <div className="inspector-row"><span>AI 权限</span><strong>{selected.locked ? '不可改动' : '护栏内可调整'}</strong></div>
              <button className="lock-action" onClick={toggleLock}>{selected.locked ? <UnlockKeyhole size={14} /> : <LockKeyhole size={14} />}{selected.locked ? '解锁组件' : '锁定组件'}</button>
            </div>
          </>}

          {tab === 'brief' && <div className="brief-card"><span className="kicker">AI INTERPRETED INTENT</span><blockquote>“夏日美妆狂欢，满 300 减 50，主推防晒和控油。”</blockquote><dl><div><dt>人群</dt><dd>{sampleVenue.metadata.audience}</dd></div><div><dt>策略</dt><dd>GMV 40% · 转化 30% · 加购 15% · 点击 15%</dd></div></dl></div>}
          {tab === 'rules' && <div className="rules-card"><div><ShieldCheck /><span><strong>权益真实性</strong><small>已通过· 2 项权益</small></span></div><div><ShieldCheck /><span><strong>价格与库存</strong><small>已通过· 286 个商品</small></span></div><div><ShieldCheck /><span><strong>素材授权</strong><small>已通过· 42 份素材</small></span></div></div>}
        </section>

        <section className="preview-stage">
          <div className="stage-toolbar"><span><i />实时预览</span><div><button className={previewMode === 'mobile' ? 'active' : ''} onClick={() => setPreviewMode('mobile')}>移动端</button><button className={previewMode === 'wide' ? 'active' : ''} onClick={() => setPreviewMode('wide')}>宽屏</button></div><code>{venue.pageVersionId}</code></div>
          <div className="candidate-score"><span>{candidate.label}</span><div><small>AI CANDIDATE</small><strong>{candidate.name}</strong></div><b>{candidate.expectedLift}</b><em>{candidate.confidence}% 信心</em></div>
          <div className={`device-frame ${previewMode}`}><div className="device-top"><span /><b /><span /></div><div className="device-screen"><VenuePreview venue={venue} /></div></div>
          <div className="stage-note"><Sparkles size={16} /><span><strong>AI 编排说明</strong>{candidate.rationale}</span><button onClick={() => chooseCandidate('balanced')} aria-label="恢复均衡版"><RotateCcw size={14} /></button></div>
        </section>
      </div>
    </div>
  )
}
