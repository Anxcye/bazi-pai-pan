/**
 * 文件作用：渲染更接近传统排盘软件的大表格式结果页骨架。
 * 系统位置：features/chart/ChartPreviewSection.tsx
 * 上游依赖：domain/bazi, domain/config, shared/constants/paipan, shared/ui/SectionCard
 * 下游影响：后续真实结果页、本命盘展示、流运展示
 * 约束：保留主盘 + 下半区专业模块，但避免大段空占位破坏观感。
 */

import type { AuxiliaryStar, BaziChartResult, PillarDetail } from '../../domain/bazi/types.ts'
import type { PaipanRuleConfig } from '../../domain/config/types.ts'
import {
  DAY_BOUNDARY_LABELS,
  MONTH_BOUNDARY_LABELS,
  YEAR_BOUNDARY_LABELS,
} from '../../shared/constants/paipan.ts'
import { cn } from '../../shared/lib/cn.ts'
import { SectionCard } from '../../shared/ui/SectionCard.tsx'

interface ChartPreviewSectionProps {
  result: BaziChartResult
  config: PaipanRuleConfig
}

const pillarOrder: Array<PillarDetail['key']> = ['year', 'month', 'day', 'hour']

const rows = [
  {
    key: 'main-star',
    label: '主星',
    render: (pillar: PillarDetail) => pillar.mainStar ?? '—',
  },
  {
    key: 'stem',
    label: '天干',
    render: (pillar: PillarDetail) => pillar.pillar?.stem ?? '—',
    emphasis: 'stem' as const,
  },
  {
    key: 'stem-god',
    label: '天干十神',
    render: (pillar: PillarDetail) => pillar.stemTenGod ?? '—',
  },
  {
    key: 'branch',
    label: '地支',
    render: (pillar: PillarDetail) => pillar.pillar?.branch ?? '—',
    emphasis: 'branch' as const,
  },
  {
    key: 'branch-god',
    label: '地支十神',
    render: (pillar: PillarDetail) => pillar.branchTenGod ?? '—',
  },
  {
    key: 'hidden-stems',
    label: '藏干',
    render: (pillar: PillarDetail) => formatHiddenStems(pillar),
    multiline: true,
  },
  {
    key: 'sub-stars',
    label: '副星',
    render: (pillar: PillarDetail) => (pillar.subStars.length ? pillar.subStars.join(' / ') : '—'),
    multiline: true,
  },
  {
    key: 'na-yin',
    label: '纳音',
    render: (pillar: PillarDetail) => pillar.naYin ?? '—',
  },
  {
    key: 'empty',
    label: '空亡',
    render: (pillar: PillarDetail) => (pillar.emptyBranches.length ? pillar.emptyBranches.join(' / ') : '—'),
  },
]

export function ChartPreviewSection({ result, config }: ChartPreviewSectionProps) {
  const pillars = pillarOrder.map((key) => result.pillars[key])

  return (
    <div className="space-y-6">
      <SectionCard title="排盘结果" description="参考传统排盘软件：上面是四柱主盘，下面接专业信息区。">
        <div className="space-y-5">
          <div className="overflow-hidden rounded-[20px] border border-stone-300 bg-white shadow-[0_12px_30px_-24px_rgba(68,53,35,0.45)] dark:border-white/15 dark:bg-stone-950">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-center">
                <thead>
                  <tr className="bg-stone-100 dark:bg-white/[0.04]">
                    <th className="min-w-28 border-b border-r border-stone-300 px-4 py-3 text-sm font-semibold text-stone-500 dark:border-white/15 dark:text-stone-400">
                      项目
                    </th>
                    {pillars.map((pillar) => (
                      <th
                        key={`${pillar.key}-column`}
                        className={cn(
                          'min-w-36 border-b border-stone-300 px-5 py-3 text-base font-semibold text-stone-950 dark:border-white/15 dark:text-stone-50',
                          pillar.key !== 'hour' && 'border-r border-stone-300 dark:border-white/15',
                          pillar.key === 'day' && 'bg-amber-100/70 dark:bg-amber-500/12',
                        )}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span>{pillar.label}</span>
                          {pillar.key === 'day' ? (
                            <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-medium tracking-[0.12em] text-white dark:bg-amber-400 dark:text-stone-950">
                              日主
                            </span>
                          ) : null}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, rowIndex) => (
                    <tr
                      key={row.key}
                      className={rowIndex % 2 === 0 ? 'bg-white dark:bg-stone-950' : 'bg-stone-50/60 dark:bg-white/[0.02]'}
                    >
                      <th className="border-b border-r border-stone-300 px-4 py-3 text-sm font-medium text-stone-500 dark:border-white/15 dark:text-stone-400">
                        {row.label}
                      </th>
                      {pillars.map((pillar) => (
                        <td
                          key={`${pillar.key}-${row.key}`}
                          className={cn(
                            'border-b border-stone-200 px-4 py-3 text-sm text-stone-700 dark:border-white/10 dark:text-stone-200',
                            pillar.key !== 'hour' && 'border-r border-stone-300 dark:border-white/15',
                            row.emphasis === 'stem' &&
                              'py-5 text-[2rem] font-semibold leading-none tracking-[0.2em] text-stone-950 dark:text-stone-50',
                            row.emphasis === 'branch' &&
                              'py-5 text-[2rem] font-semibold leading-none tracking-[0.2em] text-stone-950 dark:text-stone-50',
                            row.multiline && 'leading-7',
                            pillar.key === 'day' && 'bg-amber-50/40 dark:bg-amber-500/[0.06]',
                          )}
                        >
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

      <div className="grid gap-4 xl:grid-cols-2">
        <InfoPanel title="五行分析" items={buildSimpleList(['木', '火', '土', '金', '水'])} />
        <InfoPanel title="十神分析" items={buildSimpleList(['比肩', '劫财', '食神', '伤官'])} />
        <InfoPanel title="排盘信息" items={buildConfigList(config)} />
        <InfoPanel title="大运信息" items={buildStarList(result.professionPanel.primaryStars)} />
      </div>
    </div>
  )
}

function MetaPill({ children }: { children: string }) {
  return (
    <span className="rounded-full border border-stone-300 bg-stone-50 px-3 py-1 dark:border-white/15 dark:bg-white/[0.03]">
      {children}
    </span>
  )
}

function InfoPanel({ title, items }: { title: string; items: Array<{ label: string; value: string }> }) {
  return (
    <section className="rounded-[18px] border border-stone-300 bg-white p-5 shadow-[0_10px_26px_-24px_rgba(68,53,35,0.4)] dark:border-white/12 dark:bg-stone-950">
      <h3 className="text-base font-semibold text-stone-950 dark:text-stone-50">{title}</h3>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-4 border-b border-stone-200 pb-2 text-sm last:border-b-0 last:pb-0 dark:border-white/10">
            <span className="text-stone-500 dark:text-stone-400">{item.label}</span>
            <span className="font-medium text-stone-800 dark:text-stone-200">{item.value}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function buildSimpleList(labels: string[]) {
  return labels.map((label) => ({ label, value: '—' }))
}

function buildConfigList(config: PaipanRuleConfig) {
  return [
    { label: '年界', value: YEAR_BOUNDARY_LABELS[config.yearBoundaryRule] },
    { label: '月界', value: MONTH_BOUNDARY_LABELS[config.monthBoundaryRule] },
    { label: '日界', value: DAY_BOUNDARY_LABELS[config.dayBoundaryRule] },
    { label: '真太阳时', value: config.trueSolarTimeEnabled ? '开启' : '关闭' },
  ]
}

function buildStarList(items: AuxiliaryStar[]) {
  return items.map((item) => ({ label: item.name, value: item.value ?? '—' }))
}

function formatHiddenStems(pillar: PillarDetail) {
  if (pillar.hiddenStems.length === 0) {
    return '—'
  }

  return pillar.hiddenStems.map((item) => item.stem).join(' / ')
}
