import { useState } from 'react'
import { Activity, ArrowDown, ArrowUpRight, Bot, Check, ChevronRight, CircleAlert, Clock3, Pause, Play, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react'
import { agentRuns, campaignStages, totalCampaignAssets } from '../domain/campaign'

type Props = { onBack: () => void; onVenue: () => void }

export function CampaignWorkspace({ onBack, onVenue }: Props) {
  const [approved, setApproved] = useState(false)
  const [selectedStage, setSelectedStage] = useState('arrival')
  return <div className="campaign-workspace">
    <div className="campaign-titlebar">
      <div><button onClick={onBack}>创意工作台</button><ChevronRight size={13} /><span>清凉季全域增长 Campaign</span></div>
      <div className="campaign-actions"><span><i />运行中 · L1</span><button><Pause size={14} />暂停自动任务</button><button className="dark"><Play size={14} />提交投放审批</button></div>
    </div>

    <section className="campaign-hero">
      <div><span className="campaign-code">CAMPAIGN / JD-SUMMER-2607</span><h1>清凉季全域增长</h1><p>让营销活动智能体围绕 GMV 增长目标，持续协调创意、资源位、会场与实验。</p></div>
      <div className="campaign-metrics">
        <div><small>GMV</small><strong>¥ 286.4万</strong><em><TrendingUp />+12.8%</em></div>
        <div><small>支付转化率</small><strong>4.18%</strong><em><TrendingUp />+0.46pp</em></div>
        <div><small>资产 / 资源</small><strong>{totalCampaignAssets()}</strong><em className="neutral">5 阶段</em></div>
        <div><small>护栏状态</small><strong>正常</strong><em className="safe"><ShieldCheck />0 阻断</em></div>
      </div>
    </section>

    <section className="journey-section">
      <div className="section-title"><div><span>01</span><h2>用户旅程</h2></div><p>创意、资源位和会场共享统一 Campaign 标识</p></div>
      <div className="journey-flow">
        {campaignStages.map((stage, index) => <button key={stage.id} className={`${stage.status} ${selectedStage === stage.id ? 'selected' : ''}`} onClick={() => setSelectedStage(stage.id)}>
          <div className="stage-top"><span>0{index + 1}</span><i /><em>{stage.assets} 个资产</em></div>
          <h3>{stage.name}</h3><p>{stage.objective}</p>
          <div><small>{stage.metric}</small><strong>{stage.value}</strong></div>
          {index < campaignStages.length - 1 && <ChevronRight className="flow-arrow" />}
        </button>)}
      </div>
    </section>

    <div className="campaign-grid">
      <section className="orchestrator-panel">
        <div className="section-title"><div><span>02</span><h2>营销活动智能体</h2></div><em><i />正在编排</em></div>
        <div className="orchestrator-message"><Bot /><div><span>10:42 · 基于近 30 分钟数据</span><h3>会场到达率下降，建议启动承接组合实验</h3><p>开屏与 Banner 点击率保持稳定，但会场到达率较基线下降 6.3%。数据分析智能体判断问题集中在首屏加载与利益点匹配，建议以 10% 流量测试会场 B 版本。</p></div></div>
        <div className="evidence-row"><div><ArrowUpRight /><span><small>创意点击率</small><strong>6.42% · 正常</strong></span></div><div><ArrowDown /><span><small>会场到达率</small><strong>82.6% · -6.3%</strong></span></div><div><CircleAlert /><span><small>判断置信度</small><strong>87%</strong></span></div></div>
        <div className="action-intent"><div><Sparkles /><span><small>ACTION INTENT</small><strong>启动「会场首屏 B」10% 小流量实验</strong><p>持续 2 小时 · 最小样本 30,000 · 到达率低于 78% 自动回滚</p></span></div><div>{approved ? <span className="approved"><Check />已批准，等待执行</span> : <><button>查看证据</button><button className="approve" onClick={() => setApproved(true)}>批准实验</button></>}</div></div>
      </section>

      <section className="agent-panel">
        <div className="section-title"><div><span>03</span><h2>专业智能体任务</h2></div><small>5 / 5 在线</small></div>
        <div className="agent-list">{agentRuns.map((run) => <button key={run.id}>
          <span className={`agent-icon ${run.status}`}>{run.status === 'done' ? <Check /> : run.status === 'running' ? <Activity /> : <Clock3 />}</span>
          <span><strong>{run.agent}</strong><p>{run.task}</p><small>{run.evidence}</small></span><ChevronRight />
        </button>)}</div>
      </section>
    </div>

    <section className="touchpoint-strip"><div><span>04</span><h2>触点资产</h2></div>{['开屏 A/B', '首页 Banner', '品类资源位', '营销会场 B', '分享海报'].map((item, index) => <button key={item} onClick={item === '营销会场 B' ? onVenue : undefined}><i className={`touch-${index}`} /><span><strong>{item}</strong><small>{index === 3 ? '实验版本 · 待审批' : '已审核 · 投放中'}</small></span><ChevronRight /></button>)}</section>
  </div>
}
