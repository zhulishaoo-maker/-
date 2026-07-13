import { useEffect, useMemo, useState } from 'react'
import { Activity, ArrowLeft, Bot, Boxes, Check, ChevronDown, CircleCheck, Code2, Eye, Gauge, GitBranch, LockKeyhole, PanelLeftClose, Play, RotateCcw, ShieldCheck, Sparkles, UnlockKeyhole, WandSparkles } from 'lucide-react'
import { VenuePreview } from './components/VenuePreview'
import { PromptComposer } from './components/PromptComposer'
import { CampaignWorkspace } from './components/CampaignWorkspace'
import { componentRegistry } from './components/venue/registry'
import { sampleVenue } from './data/sampleVenue'
import { candidates, type CandidateId } from './data/candidateVenues'
import { pageSchema } from './schema/pageSchema'
import { buildGenerationBrief, defaultComposerState, taskTypes, type ComposerState, type GenerationBrief, type TaskType } from './domain/generationBrief'

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
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 850)
    return () => window.clearTimeout(timer)
  }, [])
  return <div className="results-page">
    <div className="results-heading">
      <button onClick={onBack}><ArrowLeft size={17} />返回创作</button>
      <div><span>GENERATION / {brief.id.toUpperCase()}</span><h1>4 个创意方案已就绪</h1><p>{brief.prompt}</p></div>
      <div className="brief-status"><i /><span><strong>规则校验通过</strong><small>品牌压板 · 安全区 · 文案</small></span></div>
    </div>
    <div className="candidate-gallery">
      {[0, 1, 2, 3].map((item) => <button key={item} className={`creative-card variant-${item + 1} ${selected === item ? 'selected' : ''}`} onClick={() => setSelected(item)}>
        {!ready ? <span className="generating"><Sparkles />生成中</span> : <>
          <div className="asset-brand"><b>京东 618</b><small>又好又便宜</small></div>
          <div className="asset-copy"><span>SUMMER {String(item + 1).padStart(2, '0')}</span><h2>{item === 0 ? '冰爽开场' : item === 1 ? '清凉好物' : item === 2 ? '盛夏焕新' : '热爱降温'}</h2><p>{brief.benefit}</p></div>
          <div className="asset-object"><i /><b /></div>
          {brief.searchOverlay !== '不使用搜索框压板' && <div className="asset-search">京东搜索「{brief.category}」<strong>搜索</strong></div>}
          <span className="candidate-index">0{item + 1}</span>
          {selected === item && <span className="selected-badge"><Check size={13} />已选择</span>}
        </>}
      </button>)}
    </div>
    <div className="result-actions"><div><strong>方案 {selected + 1}</strong><span>品牌规则已锁定，可继续编辑文案与主体画面</span></div><button className="secondary">单图重试</button><button className="primary" onClick={brief.taskType === '营销会场' ? onVenue : undefined}>{brief.taskType === '营销会场' ? '进入会场编辑器' : '确认并进入精修'}</button></div>
  </div>
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
