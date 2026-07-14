import { useEffect, useId, useRef, useState } from 'react'
import { ArrowUp, ChevronDown, ImagePlus, Layers3, Sparkles } from 'lucide-react'
import type { ComposerState } from '../domain/generationBrief'
import { filterSlotOptions, moveSlotHighlight, resolveSlotValue } from '../domain/editableSlot'

type Props = {
  value: ComposerState
  onChange: (value: ComposerState) => void
  onSubmit: () => void
}

const options = {
  campaign: ['清凉季', '京东 618', '超级品牌日', '新品首发'],
  category: ['个护美妆', '3C 数码', '家电家居', '食品生鲜'],
  benefit: ['满 300 减 50', '每满 200 减 30', '限时 8 折', '爆品直降'],
  brandOverlay: ['京东 618 品牌压板', '京东年货节品牌压板', '京东超级品牌日压板'],
  searchOverlay: ['京东搜索框压板', '京东搜索框压板 · 浅色', '不使用搜索框压板'],
  style: ['清透冰感', '高饱和未来感', '极简高级', '热烈大促'],
  ratio: ['3:4 · 750×1000', '16:9 · 1920×1080', '1:1 · 1000×1000', '会场首屏 · 750×920'],
} satisfies Record<Exclude<keyof ComposerState, 'taskType'>, string[]>

const labels: Record<keyof typeof options, string> = {
  campaign: '活动主题', category: '主推品类', benefit: '核心权益', brandOverlay: '品牌压板',
  searchOverlay: '搜索框压板', style: '视觉风格', ratio: '尺寸比例',
}

function Slot({ field, value, onChange }: { field: keyof typeof options; value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(value)
  const [highlighted, setHighlighted] = useState(-1)
  const initialValue = useRef(value)
  const listId = useId()
  const filtered = filterSlotOptions(options[field], draft)

  useEffect(() => setDraft(value), [value])

  const commit = (next = draft) => {
    const resolved = resolveSlotValue(next, initialValue.current)
    setDraft(resolved)
    onChange(resolved)
    setOpen(false)
    setHighlighted(-1)
  }

  return (
    <span className={`prompt-slot editable-slot ${open ? 'open' : ''}`}>
      <input
        aria-label={labels[field]}
        aria-autocomplete="list"
        aria-controls={listId}
        aria-expanded={open}
        aria-activedescendant={highlighted >= 0 ? `${listId}-${highlighted}` : undefined}
        role="combobox"
        value={draft}
        maxLength={field === 'ratio' ? 30 : 24}
        style={{ width: `${Math.max(5, Math.min(25, draft.length + 2))}em` }}
        onFocus={() => { initialValue.current = value; setOpen(true) }}
        onChange={(event) => { setDraft(event.target.value); setOpen(true); setHighlighted(-1) }}
        onBlur={() => commit()}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault()
            setOpen(true)
            setHighlighted((current) => moveSlotHighlight(current, event.key === 'ArrowDown' ? 1 : -1, filtered.length))
          } else if (event.key === 'Enter') {
            event.preventDefault()
            commit(highlighted >= 0 ? filtered[highlighted] : draft)
          } else if (event.key === 'Escape') {
            event.preventDefault()
            setDraft(initialValue.current)
            setOpen(false)
            setHighlighted(-1)
          }
        }}
      />
      <ChevronDown size={14} aria-hidden="true" />
      {open && <span className="slot-options" id={listId} role="listbox" aria-label={`${labels[field]}推荐项`}>
        {filtered.length > 0 ? filtered.map((option, index) => <button
          type="button"
          id={`${listId}-${index}`}
          role="option"
          aria-selected={highlighted === index}
          className={highlighted === index ? 'highlighted' : ''}
          key={option}
          onMouseDown={(event) => { event.preventDefault(); commit(option) }}
        >{option}</button>) : <em>按 Enter 使用“{draft}”</em>}
      </span>}
    </span>
  )
}

export function PromptComposer({ value, onChange, onSubmit }: Props) {
  const set = (field: keyof ComposerState, next: string) => onChange({ ...value, [field]: next })
  return (
    <section className="prompt-composer" aria-label="生成要求">
      <div className="composer-sentence">
        <span>为</span><Slot field="campaign" value={value.campaign} onChange={(next) => set('campaign', next)} />
        <span>创建一组</span><strong>{value.taskType}</strong><span>，主推</span>
        <Slot field="category" value={value.category} onChange={(next) => set('category', next)} />
        <span>，核心权益是</span><Slot field="benefit" value={value.benefit} onChange={(next) => set('benefit', next)} />
        <span>。应用</span><Slot field="brandOverlay" value={value.brandOverlay} onChange={(next) => set('brandOverlay', next)} />
        <span>和</span><Slot field="searchOverlay" value={value.searchOverlay} onChange={(next) => set('searchOverlay', next)} />
        <span>，整体采用</span><Slot field="style" value={value.style} onChange={(next) => set('style', next)} />
        <span>风格，输出</span><Slot field="ratio" value={value.ratio} onChange={(next) => set('ratio', next)} /><span>。</span>
      </div>
      <div className="composer-actions">
        <div>
          <button><ImagePlus size={16} />上传参考图</button>
          <button><Layers3 size={16} />页面大纲</button>
          <span><Sparkles size={13} />将固定生成 4 个候选方案</span>
        </div>
        <button className="send-button" onClick={onSubmit} aria-label="开始生成"><ArrowUp size={21} /></button>
      </div>
    </section>
  )
}
