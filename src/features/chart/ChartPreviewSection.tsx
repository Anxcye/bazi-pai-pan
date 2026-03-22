/**
 * 文件作用：渲染更接近传统排盘软件的大表格式结果页骨架。
 * 系统位置：features/chart/ChartPreviewSection.tsx
 * 上游依赖：domain/bazi, domain/config, shared/constants/paipan, shared/ui/SectionCard
 * 下游影响：后续真实结果页、本命盘展示、流运展示
 * 约束：先做专业表格式结构，真实计算接入前不过度展示未实现区块。
 */

import type { BaziChartResult, PillarDetail } from '../../domain/bazi/types.ts'
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

export function ChartPreviewSection({ result, config }: ChartPreviewSectionProps) {
  const pillars = pillarOrder.map((key) => result.pillars[key])

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
      emphasis: true,
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
      emphasis: true,
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
    {
      key: 'status',
      label: '状态',
      render: (pillar: PillarDetail) =>
        pillar.status === 'known' ? '已就绪' : pillar.status === 'unknown' ? '未知时辰' : '未排盘',
      subtle: true,
    },
  ]

  return (
    <SectionCard title="排盘结果" description="按传统排盘软件的读法组织：横向看四柱，纵向看字段。">
      <div className="space-y-4">
        <div className="overflow-hidden rounded-[24px] border border-stone-300 bg-white dark:border-white/10 dark:bg-stone-950">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-center">
              <thead>
                <tr className="bg-stone-100 dark:bg-white/[0.04]">
                  <th className="min-w-28 border-b border-r border-stone-200 px-4 py-3 text-sm font-semibold text-stone-500 dark:border-white/10 dark:text-stone-400">
                    项目
                  </th>
                  {pillars.map((pillar) => (
                    <th
                      key={`${pillar.key}-column`}
                      className={cn(
                        'min-w-36 border-b border-stone-200 px-5 py-3 text-base font-semibold text-stone-950 dark:border-white/10 dark:text-stone-50',
                        pillar.key !== 'hour' && 'border-r',
                        pillar.key !== 'hour' && 'border-stone-200 dark:border-white/10',
                        pillar.key === 'day' && 'bg-amber-50/80 dark:bg-amber-500/10',
                      )}
                    >
                      {pillar.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.key}>
                    <th className="border-b border-r border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-stone-400">
                      {row.label}
                    </th>
                    {pillars.map((pillar) => (
                      <td
                        key={`${pillar.key}-${row.key}`}
                        className={cn(
                          'border-b border-stone-200 px-4 py-3 text-sm text-stone-700 dark:border-white/10 dark:text-stone-200',
                          pillar.key !== 'hour' && 'border-r border-stone-200 dark:border-white/10',
                          row.emphasis &&
                            'py-4 text-3xl font-semibold tracking-[0.18em] text-stone-950 dark:text-stone-50',
                          row.multiline && 'leading-7',
                          row.subtle && 'text-xs text-stone-500 dark:text-stone-400',
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
  )
}

function MetaPill({ children }: { children: string }) {
  return (
    <span className="rounded-full border border-stone-300 px-3 py-1 dark:border-white/15">{children}</span>
  )
}

function formatHiddenStems(pillar: PillarDetail) {
  if (pillar.hiddenStems.length === 0) {
    return '—'
  }

  return pillar.hiddenStems.map((item) => item.stem).join(' / ')
}
