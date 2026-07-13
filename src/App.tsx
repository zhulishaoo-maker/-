import { useEffect, useMemo, useState } from 'react'
import { Activity, AlertTriangle, Archive, ArrowLeft, Bot, Boxes, Check, CheckCircle2, ChevronDown, CircleCheck, Code2, Eye, Gauge, GitBranch, LockKeyhole, PanelLeftClose, Pencil, Play, RefreshCw, RotateCcw, ShieldCheck, Sparkles, UnlockKeyhole, WandSparkles, X } from 'lucide-react'
import { VenuePreview } from './components/VenuePreview'
import { PromptComposer } from './components/PromptComposer'
import { CampaignWorkspace } from './components/CampaignWorkspace'
import { componentRegistry } from './components/venue/registry'
import { sampleVenue } from './data/sampleVenue'
import { candidates, type CandidateId } from './data/candidateVenues'
import { pageSchema } from './schema/pageSchema'
import { buildGenerationBrief, defaultComposerState, taskTypes, type ComposerState, type GenerationBrief, type TaskType } from './domain/generationBrief'
import { canSubmitReview, createCandidateBatch, deriveBatchProgress, failCandidate, retryCandidate, transitionCandidate, updateCandidateCopy, type CandidateStatus, type CreativeCandidate } from './domain/assetProduction'

type Tab = 'brief' | 'structure' | 'rules'

type AppView = 'home' | 'results' | 'campaign' | 'venue'

const taskDescriptions: Record<TaskType, string> = {
  开屏: '抓住第一眼注意力',
  营销海报: '快速承接传播与转化',
  'Banner / 资源位': '适配站内核心流量入口',
  营销会场: '搭建完整活动承接链路',
}

export function App() {
  const [view, setView] = useState<AppView>('home')
  const [composer, setComposer] = useState<ComposerState>(defaultComposerState)
  const [brief, setBrief] = useState<GenerationBrief | null>(null)

  const generate = () => {
    setBrief(buildGenerationBrief(composer))
    setView('results')
  }

  if (view === 'venue') return <VenueEditor onBack={() => setView('campaign')} />

  return (
    <main className="marketing-shell">
      <header className="marketing-header">
        <button className="brand" onClick={() => setView('home')}><span>J</span><div><strong>京营造</strong><small>AI MARKETING OS</small></div></button>
        <nav><button className={view !== 'campaign' ? 'active' : ''} onClick={() => setView('home')}>创意工作台</button><button className={view === 'campaign' ? 'active' : ''} onClick={() => setView('campaign')}>活动旅程</button><button>资产中心</button><button>数据洞察</button></nav>
        <div className="agent-online"><i /><span><strong>营销活动智能体</strong><small>在线 · L1 辅助决策</small></span><Bot size={18} /></div>
      </header>

      {view === 'home' ? (
        <div className="creation-home">
          <div className="release-pill"><Sparkles size={13} />京营造 AI 营销智能体工作台已上线 <span>↗</span></div>
          <section className="home-intro">
            <span className="home-kicker"><i />营销活动智能体已就绪</span>
            <h1>Hey，今天想创造什么？</h1>
            <p>输入运营目标，营销活动智能体将调度设计、会场、渠道与数据能力，完成从生产到增长的闭环。</p>
          </section>

          <section className="creation-studio">
            <div className="mode-switch">
              <button className="active"><WandSparkles size={17} /><span><strong>快速生成</strong><small>单项资源，分钟级出稿</small></span></button>
              <button onClick={() => setView('campaign')}><Boxes size={17} /><span><strong>全链路活动</strong><small>跨触点编排与持续优化</small></span><em>进入工作台</em></button>
            </div>
            <PromptComposer value={composer} onChange={setComposer} onSubmit={generate} />
            <div className="task-tabs">
              {taskTypes.map((task) => <button key={task} className={composer.taskType === task ? 'active' : ''} onClick={() => setComposer({ ...composer, taskType: task })}>
                <span>{task === '开屏' ? '01' : task === '营销海报' ? '02' : task === 'Banner / 资源位' ? '03' : '04'}</span><div><strong>{task}</strong><small>{taskDescriptions[task]}</small></div>
              </button>)}
            </div>
          </section>

          <footer className="home-proof"><span>确定性品牌压板</span><i /><span>固定 4 方案</span><i /><span>全流程可追溯</span><i /><span>支持人工接管</span></footer>
        </div>
      ) : view === 'campaign' ? (
        <CampaignWorkspace onBack={() => setView('home')} onVenue={() => setView('venue')} />
      ) : (
        <ResultsView brief={brief!} onBack={() => setView('home')} onVenue={() => setView('venue')} />
      )}
    </main>
  )
}

function ResultsView({ brief, onBack, onVenue }: { brief: GenerationBrief; onBack: () => void; onVenue: () => void }) {
  const [selected, setSelected] = useState(0)
  const [candidates, setCandidates] = useState(() => createCandidateBatch(brief.id))
  const [refining, setRefining] = useState(false)
  const [archiveNotice, setArchiveNotice] = useState(false)
  const selectedCandidate = candidates[selected]
  const batchProgress = deriveBatchProgress(candidates)

  useEffect(() => {
    const timers: number[] = []
    const update = (index: number, status: CandidateStatus, progress: number, delay: number) => {
      timers.push(window.setTimeout(() => setCandidates((current) => current.map((candidate, itemIndex) => itemIndex === index ? transitionCandidate(candidate, status, progress) : candidate)), delay))
    }
    candidates.forEach((_, index) => {
      update(index, 'generating', 18, 180 + index * 120)
      update(index, 'validating', 82, 780 + index * 160)
      if (index === 2) {
        timers.push(window.setTimeout(() => setCandidates((current) => current.map((candidate, itemIndex) => itemIndex === index ? failCandidate(candidate, '主体超出安全区，请重新生成底图') : candidate)), 1380))
      } else update(index, 'ready', 100, 1320 + index * 160)
    })
    return () => timers.forEach(window.clearTimeout)
    // candidates are intentionally initialized once per Brief.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const retry = (index: number) => {
    setCandidates((current) => current.map((candidate, itemIndex) => itemIndex === index ? retryCandidate(candidate) : candidate))
    window.setTimeout(() => setCandidates((current) => current.map((candidate, itemIndex) => itemIndex === index ? transitionCandidate(candidate, 'validating', 84) : candidate)), 650)
    window.setTimeout(() => setCandidates((current) => current.map((candidate, itemIndex) => itemIndex === index ? transitionCandidate(candidate, 'ready', 100) : candidate)), 1250)
  }

  const submitReview = () => {
    if (!canSubmitReview(selectedCandidate)) return
    setCandidates((current) => current.map((candidate, index) => index === selected ? transitionCandidate(candidate, 'reviewing', 100) : candidate))
    window.setTimeout(() => {
      setCandidates((current) => current.map((candidate, index) => index === selected ? transitionCandidate(candidate, 'approved', 100) : candidate))
      setArchiveNotice(true)
    }, 900)
  }

  const saveCopy = (copy: Pick<CreativeCandidate, 'title' | 'subtitle' | 'cta'>) => {
    setCandidates((current) => current.map((candidate, index) => index === selected ? updateCandidateCopy(candidate, copy) : candidate))
    setRefining(false)
  }

  return <div className="results-page production-page">
    <div className="results-heading">
      <button onClick={onBack}><ArrowLeft size={17} />返回创作</button>
      <div><span>PRODUCTION / {brief.id.toUpperCase()}</span><h1>{batchProgress === 100 ? '创意资产生产完成' : '正在生产 4 个创意方案'}</h1><p>{brief.prompt}</p></div>
      <div className="batch-meter"><div><span>批次进度</span><strong>{batchProgress}%</strong></div><i><b style={{ width: `${batchProgress}%` }} /></i><small>{candidates.filter((item) => item.status === 'ready' || item.status === 'approved').length} 就绪 · {candidates.filter((item) => item.status === 'failed').length} 需处理</small></div>
    </div>
    <div className="production-layout">
      <div className="candidate-gallery">
      {candidates.map((candidate, item) => <button key={candidate.id} className={`creative-card variant-${item + 1} status-${candidate.status} ${selected === item ? 'selected' : ''}`} onClick={() => setSelected(item)}>
        {candidate.status === 'queued' || candidate.status === 'generating' || candidate.status === 'validating' ? <span className="generating"><Sparkles /><strong>{candidate.status === 'queued' ? '等待生产' : candidate.status === 'validating' ? '规则检查中' : '生成底图中'}</strong><i><b style={{ width: `${candidate.progress}%` }} /></i><small>{candidate.progress}%</small></span> : candidate.status === 'failed' ? <span className="candidate-failed"><AlertTriangle /><strong>方案需要处理</strong><small>{candidate.error}</small><em onClick={(event) => { event.stopPropagation(); retry(item) }}><RefreshCw size={13} />单图重试</em></span> : <>
          <div className="asset-brand"><b>京东 618</b><small>又好又便宜</small></div>
          <div className="asset-copy"><span>SUMMER {String(item + 1).padStart(2, '0')}</span><h2>{candidate.title}</h2><p>{brief.benefit}</p></div>
          <div className="asset-object"><i /><b /></div>
          {brief.searchOverlay !== '不使用搜索框压板' && <div className="asset-search">京东搜索「{brief.category}」<strong>搜索</strong></div>}
          <span className="candidate-index">0{item + 1}</span>
          <span className={`asset-state ${candidate.status}`}>{candidate.status === 'approved' ? <><Archive size={11} />已归档</> : candidate.status === 'reviewing' ? '审核中' : `v${candidate.version} · 已就绪`}</span>
          {selected === item && <span className="selected-badge"><Check size={13} />已选择</span>}
        </>}
      </button>)}
      </div>
      <AssetInspector candidate={selectedCandidate} brief={brief} onRetry={() => retry(selected)} />
    </div>
    <div className="result-actions"><div><strong>方案 {selected + 1} · v{selectedCandidate.version}</strong><span>{selectedCandidate.status === 'approved' ? '审核通过，资产已进入 Campaign 资产库' : selectedCandidate.status === 'failed' ? '请先重试失败方案' : '品牌压板已锁定，可继续精修文案'}</span></div>{selectedCandidate.status === 'failed' ? <button className="secondary" onClick={() => retry(selected)}><RefreshCw size={14} />单图重试</button> : <><button className="secondary" disabled={!['ready', 'approved'].includes(selectedCandidate.status)} onClick={() => setRefining(true)}><Pencil size={14} />精修文案</button><button className="primary" disabled={!canSubmitReview(selectedCandidate)} onClick={brief.taskType === '营销会场' && selectedCandidate.status === 'approved' ? onVenue : submitReview}>{selectedCandidate.status === 'reviewing' ? '审核中…' : selectedCandidate.status === 'approved' ? (brief.taskType === '营销会场' ? '进入会场编辑器' : '已归档资产') : '提交审核'}</button></>}</div>
    {refining && <CopyRefinement candidate={selectedCandidate} onClose={() => setRefining(false)} onSave={saveCopy} />}
    {archiveNotice && <div className="archive-toast"><CheckCircle2 size={18} /><span><strong>审核通过，资产已归档</strong><small>{brief.id} / candidate-0{selected + 1} / v{selectedCandidate.version}</small></span><button onClick={() => setArchiveNotice(false)}><X size={14} /></button></div>}
  </div>
}

function AssetInspector({ candidate, brief, onRetry }: { candidate: CreativeCandidate; brief: GenerationBrief; onRetry: () => void }) {
  const checksPassed = candidate.rules.filter((rule) => rule.passed).length
  return <aside className="asset-inspector">
    <div className="inspector-title"><span>方案 0{candidate.index + 1}</span><strong>确定性规则检查</strong><small>底图与品牌固定层分离生产</small></div>
    <div className={`inspector-score ${candidate.status === 'failed' ? 'warning' : ''}`}><span>{candidate.status === 'failed' ? <AlertTriangle /> : <ShieldCheck />}</span><div><strong>{candidate.status === 'failed' ? '需要重新生成底图' : `${checksPassed} / ${candidate.rules.length} 项规则通过`}</strong><small>{candidate.status === 'failed' ? candidate.error : '可提交审核'}</small></div></div>
    <div className="rule-list">{candidate.rules.map((rule) => <div key={rule.id}><span className={rule.passed ? 'passed' : 'failed'}>{rule.passed ? <Check size={12} /> : <X size={12} />}</span><p><strong>{rule.label}</strong><small>{rule.detail}</small></p>{rule.locked && <em><LockKeyhole size={10} />锁定</em>}</div>)}</div>
    <dl className="asset-metadata"><div><dt>任务类型</dt><dd>{brief.taskType}</dd></div><div><dt>压板版本</dt><dd>JD-CAMPAIGN v3.2</dd></div><div><dt>资产版本</dt><dd>v{candidate.version}</dd></div></dl>
    {candidate.status === 'failed' && <button className="inspector-retry" onClick={onRetry}><RefreshCw size={14} />重新生成此方案</button>}
  </aside>
}

function CopyRefinement({ candidate, onClose, onSave }: { candidate: CreativeCandidate; onClose: () => void; onSave: (copy: Pick<CreativeCandidate, 'title' | 'subtitle' | 'cta'>) => void }) {
  const [title, setTitle] = useState(candidate.title)
  const [subtitle, setSubtitle] = useState(candidate.subtitle)
  const [cta, setCta] = useState(candidate.cta)
  const valid = title.trim().length > 0 && title.trim().length <= 12 && cta.trim().length > 0 && cta.trim().length <= 6
  return <div className="refine-backdrop" onMouseDown={onClose}><section className="refine-panel" onMouseDown={(event) => event.stopPropagation()}>
    <header><span><Pencil size={16} /><strong>精修方案 0{candidate.index + 1}</strong></span><button onClick={onClose}><X size={18} /></button></header>
    <div className="locked-layer"><LockKeyhole size={15} /><span><strong>京东大促品牌压板已锁定</strong><small>Logo、搜索框和安全区不参与生成与编辑</small></span></div>
    <label><span>主标题 <em>{title.length}/12</em></span><input value={title} onChange={(event) => setTitle(event.target.value)} /></label>
    <label><span>副标题 <em>{subtitle.length}/24</em></span><input value={subtitle} maxLength={24} onChange={(event) => setSubtitle(event.target.value)} /></label>
    <label><span>行动按钮 <em>{cta.length}/6</em></span><input value={cta} onChange={(event) => setCta(event.target.value)} /></label>
    {!valid && <p className="copy-error"><AlertTriangle size={13} />主标题不超过 12 字，行动按钮不超过 6 字</p>}
    <footer><button onClick={onClose}>取消</button><button disabled={!valid} onClick={() => onSave({ title: title.trim(), subtitle: subtitle.trim(), cta: cta.trim() })}>保存为 v{candidate.version + 1}</button></footer>
  </section></div>
}

function VenueEditor({ onBack }: { onBack: () => void }) {
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
          <div className="breadcrumb"><button className="editor-back" onClick={onBack}><ArrowLeft size={14} />工作台</button><b>/</b><strong>{sampleVenue.metadata.title}</strong><em>v003</em></div>
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
