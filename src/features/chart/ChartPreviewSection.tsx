import { useMemo, useState } from 'react'

import type {
  BaziChartResult,
  DaYunNode,
  LiuNianNode,
  LiuRiItem,
  LiuShiItem,
  LiuYueItem,
  PillarDetail,
} from '../../domain/bazi/types.ts'
import type { PaipanRuleConfig } from '../../domain/config/types.ts'
import { DAY_BOUNDARY_LABELS, MONTH_BOUNDARY_LABELS, YEAR_BOUNDARY_LABELS } from '../../shared/constants/paipan.ts'
import { cn } from '../../shared/lib/cn.ts'
import { SectionCard } from '../../shared/ui/SectionCard.tsx'

interface ChartPreviewSectionProps {
  result: BaziChartResult
  config: PaipanRuleConfig
}

const pillarOrder: Array<PillarDetail['key']> = ['year', 'month', 'day', 'hour']
const rows = [
  { key: 'main-star', label: '主星', render: (pillar: PillarDetail) => pillar.mainStar ?? '—' },
  { key: 'stem', label: '天干', render: (pillar: PillarDetail) => pillar.pillar?.stem ?? '—', emphasis: 'stem' as const },
  { key: 'stem-god', label: '天干十神', render: (pillar: PillarDetail) => pillar.stemTenGod ?? '—' },
  { key: 'branch', label: '地支', render: (pillar: PillarDetail) => pillar.pillar?.branch ?? '—', emphasis: 'branch' as const },
  { key: 'branch-god', label: '地支十神', render: (pillar: PillarDetail) => pillar.branchTenGod ?? '—' },
  { key: 'hidden-stems', label: '藏干', render: (pillar: PillarDetail) => formatHiddenStems(pillar), multiline: true },
  { key: 'sub-stars', label: '副星', render: (pillar: PillarDetail) => (pillar.subStars.length ? pillar.subStars.join(' / ') : '—'), multiline: true },
  { key: 'na-yin', label: '纳音', render: (pillar: PillarDetail) => pillar.naYin ?? '—' },
  { key: 'empty', label: '空亡', render: (pillar: PillarDetail) => (pillar.emptyBranches.length ? pillar.emptyBranches.join(' / ') : '—') },
]

export function ChartPreviewSection({ result, config }: ChartPreviewSectionProps) {
  const pillars = pillarOrder.map((key) => result.pillars[key])
  const [activeDayunIndex, setActiveDayunIndex] = useState(0)
  const [activeLiuNianIndex, setActiveLiuNianIndex] = useState(0)
  const [activeLiuYueIndex, setActiveLiuYueIndex] = useState(0)
  const [activeLiuRiIndex, setActiveLiuRiIndex] = useState(0)

  const activeDayun: DaYunNode | undefined = result.dayun[activeDayunIndex]
  const liunian = useMemo(() => activeDayun?.liunian ?? result.liunian, [activeDayun, result.liunian])

  const activeLiuNian: LiuNianNode | undefined = liunian[activeLiuNianIndex]
  const liuyue = useMemo(() => activeLiuNian?.liuyue ?? result.liuyue, [activeLiuNian, result.liuyue])

  const activeLiuYue: LiuYueItem | undefined = liuyue[activeLiuYueIndex]
  const liuri = useMemo(() => activeLiuYue?.liuri ?? result.liuri, [activeLiuYue, result.liuri])

  const activeLiuRi: LiuRiItem | undefined = liuri[activeLiuRiIndex]
  const liushi = useMemo(() => activeLiuRi?.liushi ?? result.liushi, [activeLiuRi, result.liushi])

  return (
    <div className="space-y-6">
      <SectionCard title="排盘结果" description="参考传统排盘软件：上面是四柱主盘，下面按行展示各层流运。">
        <div className="space-y-5">
          <div className="overflow-hidden rounded-[20px] border border-stone-300 bg-white shadow-[0_12px_30px_-24px_rgba(68,53,35,0.45)] dark:border-white/15 dark:bg-stone-950">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-center">
                <thead>
                  <tr className="bg-stone-100 dark:bg-white/[0.04]">
                    <th className="min-w-28 border-b border-r border-stone-300 px-4 py-3 text-sm font-semibold text-stone-500 dark:border-white/15 dark:text-stone-400">项目</th>
                    {pillars.map((pillar) => (
                      <th key={`${pillar.key}-column`} className={cn('min-w-36 border-b border-stone-300 px-5 py-3 text-base font-semibold text-stone-950 dark:border-white/15 dark:text-stone-50', pillar.key !== 'hour' && 'border-r border-stone-300 dark:border-white/15', pillar.key === 'day' && 'bg-amber-100/70 dark:bg-amber-500/12')}>
                        <div className="flex flex-col items-center gap-1">
                          <span>{pillar.label}</span>
                          {pillar.key === 'day' ? <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-medium tracking-[0.12em] text-white dark:bg-amber-400 dark:text-stone-950">日主</span> : null}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, rowIndex) => (
                    <tr key={row.key} className={rowIndex % 2 === 0 ? 'bg-white dark:bg-stone-950' : 'bg-stone-50/60 dark:bg-white/[0.02]'}>
                      <th className="border-b border-r border-stone-300 px-4 py-3 text-sm font-medium text-stone-500 dark:border-white/15 dark:text-stone-400">{row.label}</th>
                      {pillars.map((pillar) => (
                        <td key={`${pillar.key}-${row.key}`} className={cn('border-b border-stone-200 px-4 py-3 text-sm text-stone-700 dark:border-white/10 dark:text-stone-200', pillar.key !== 'hour' && 'border-r border-stone-300 dark:border-white/15', row.emphasis === 'stem' && 'py-5 text-[2rem] font-semibold leading-none tracking-[0.2em] text-stone-950 dark:text-stone-50', row.emphasis === 'branch' && 'py-5 text-[2rem] font-semibold leading-none tracking-[0.2em] text-stone-950 dark:text-stone-50', row.multiline && 'leading-7', pillar.key === 'day' && 'bg-amber-50/40 dark:bg-amber-500/[0.06]')}>
                          {row.render(pillar)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-stone-600 dark:text-stone-300">
            <MetaPill>{YEAR_BOUNDARY_LABELS[config.yearBoundaryRule]}</MetaPill>
            <MetaPill>{MONTH_BOUNDARY_LABELS[config.monthBoundaryRule]}</MetaPill>
            <MetaPill>{DAY_BOUNDARY_LABELS[config.dayBoundaryRule]}</MetaPill>
          </div>
        </div>
      </SectionCard>

      <SelectableLuckRow
        title="大运"
        items={result.dayun}
        activeIndex={activeDayunIndex}
        onSelect={(index) => {
          setActiveDayunIndex(index)
          setActiveLiuNianIndex(0)
          setActiveLiuYueIndex(0)
          setActiveLiuRiIndex(0)
        }}
      />
      <SelectableLuckRow
        title="流年"
        items={liunian}
        activeIndex={activeLiuNianIndex}
        onSelect={(index) => {
          setActiveLiuNianIndex(index)
          setActiveLiuYueIndex(0)
          setActiveLiuRiIndex(0)
        }}
      />
      <SelectableLuckRow
        title="流月"
        items={liuyue}
        activeIndex={activeLiuYueIndex}
        onSelect={(index) => {
          setActiveLiuYueIndex(index)
          setActiveLiuRiIndex(0)
        }}
      />
      <SelectableLuckRow title="流日" items={liuri} activeIndex={activeLiuRiIndex} onSelect={setActiveLiuRiIndex} dense />
      <StaticLuckRow title="流时" items={liushi} dense compact />

      <section className="rounded-[18px] border border-stone-300 bg-white p-5 shadow-[0_10px_26px_-24px_rgba(68,53,35,0.4)] dark:border-white/12 dark:bg-stone-950">
        <h3 className="text-base font-semibold text-stone-950 dark:text-stone-50">干支关系</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {result.relations.map((item) => (
            <div key={item.label} className="rounded-[14px] border border-stone-300 bg-stone-50/70 px-4 py-4 dark:border-white/15 dark:bg-white/[0.03]">
              <div className="text-xs text-stone-500 dark:text-stone-400">{item.label}</div>
              <div className="mt-2 text-base font-semibold text-stone-900 dark:text-stone-100">{item.value}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function SelectableLuckRow({
  title,
  items,
  activeIndex,
  onSelect,
  dense = false,
}: {
  title: string
  items: Array<DaYunNode | LiuNianNode | LiuYueItem | LiuRiItem>
  activeIndex: number
  onSelect: (index: number) => void
  dense?: boolean
}) {
  return (
    <section className="rounded-[18px] border border-stone-300 bg-white p-5 shadow-[0_10px_26px_-24px_rgba(68,53,35,0.4)] dark:border-white/12 dark:bg-stone-950">
      <h3 className="text-base font-semibold text-stone-950 dark:text-stone-50">{title}</h3>
      {items.length === 0 ? <div className="mt-4 text-sm text-stone-500 dark:text-stone-400">暂无{title}</div> : (
        <div className={cn('mt-4 flex flex-wrap gap-2', dense && 'gap-1.5')}>
          {items.map((item, index) => (
            <button
              key={`${item.label}-${index}`}
              type="button"
              onClick={() => onSelect(index)}
              className={cn(
                'rounded-[16px] border px-2.5 py-2 text-center transition',
                dense ? 'min-w-[52px]' : 'min-w-[68px]',
                index === activeIndex
                  ? 'border-amber-400 bg-amber-50 dark:border-amber-400 dark:bg-amber-500/10'
                  : 'border-stone-300 bg-stone-50/70 dark:border-white/15 dark:bg-white/[0.03]',
              )}
            >
              <LuckTileTop label={item.label} meta={item.meta} />
              <LuckGanZhi stem={item.stem ?? null} branch={item.branch ?? null} />
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

function StaticLuckRow({
  title,
  items,
  compact = false,
  dense = false,
}: {
  title: string
  items: LiuShiItem[]
  compact?: boolean
  dense?: boolean
}) {
  return (
    <section className="rounded-[18px] border border-stone-300 bg-white p-5 shadow-[0_10px_26px_-24px_rgba(68,53,35,0.4)] dark:border-white/12 dark:bg-stone-950">
      <h3 className="text-base font-semibold text-stone-950 dark:text-stone-50">{title}</h3>
      {items.length === 0 ? <div className="mt-4 text-sm text-stone-500 dark:text-stone-400">暂无{title}</div> : (
        <div className={cn('mt-4 flex flex-wrap gap-2', compact && 'gap-1.5', dense && 'gap-1.5')}>
          {items.map((item, index) => (
            <div
              key={`${item.label}-${index}`}
              className={cn(
                'rounded-[16px] border border-stone-300 bg-stone-50/70 px-2.5 py-2 text-center dark:border-white/15 dark:bg-white/[0.03]',
                compact ? 'min-w-[52px]' : 'min-w-[68px]',
              )}
            >
              <LuckTileTop label={item.label} meta={item.meta} />
              <LuckGanZhi stem={item.stem ?? null} branch={item.branch ?? null} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

function LuckTileTop({ label, meta }: { label: string; meta?: string }) {
  return (
    <div className="mb-1 text-[11px] leading-none text-stone-500 dark:text-stone-400">
      {label}
      {meta ? <span className="ml-1">{meta}</span> : null}
    </div>
  )
}

function LuckGanZhi({ stem, branch }: { stem: string | null; branch: string | null }) {
  return (
    <div className="flex flex-col items-center leading-none text-stone-950 dark:text-stone-50">
      <span className="text-lg font-semibold">{stem ?? '—'}</span>
      <span className="mt-1 text-lg font-semibold">{branch ?? '—'}</span>
    </div>
  )
}

function MetaPill({ children }: { children: string }) {
  return <span className="rounded-full border border-stone-300 bg-stone-50 px-3 py-1 dark:border-white/15 dark:bg-white/[0.03]">{children}</span>
}
function formatHiddenStems(pillar: PillarDetail) {
  if (pillar.hiddenStems.length === 0) return '—'
  return pillar.hiddenStems.map((item) => item.stem).join(' / ')
}
