/**
 * 文件作用：渲染更接近真实排盘工具的结果页骨架。
 * 系统位置：features/chart/ChartPreviewSection.tsx
 * 上游依赖：domain/bazi, domain/config, shared/constants/paipan, shared/ui/SectionCard
 * 下游影响：后续真实结果页、本命盘展示、流运展示
 * 约束：只展示结构和状态，不伪造真实排盘算法结果。
 */

import type { AuxiliaryStar, BaziChartResult, PillarDetail } from '../../domain/bazi/types.ts'
import type { PaipanRuleConfig } from '../../domain/config/types.ts'
import {
  DAY_BOUNDARY_LABELS,
  FIVE_ELEMENT_LABELS,
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

  return (
    <div className="space-y-6">
      <SectionCard
        title="排盘结果"
        description="顶部先是四柱主盘，继续补专业字段展示位。等算法接入后，主星、副星、纳音、空亡等都能直接落进来。"
      >
        <div className="space-y-5">
          <div className="overflow-hidden rounded-[28px] border border-stone-200 bg-stone-50/70 dark:border-white/10 dark:bg-white/[0.03]">
            <div className="grid border-b border-stone-200 bg-white/80 text-center dark:border-white/10 dark:bg-white/[0.04] md:grid-cols-[120px_repeat(4,minmax(0,1fr))]">
              <Cell muted>柱位</Cell>
              {pillars.map((pillar) => (
                <Cell key={`${pillar.key}-head`} strong>
                  {pillar.label}
                </Cell>
              ))}
            </div>

            <div className="grid border-b border-stone-200 text-center dark:border-white/10 md:grid-cols-[120px_repeat(4,minmax(0,1fr))]">
              <Cell muted>天干</Cell>
              {pillars.map((pillar) => (
                <LargeValueCell
                  key={`${pillar.key}-stem`}
                  highlight={pillar.key === 'day'}
                  value={pillar.pillar?.stem ?? '—'}
                />
              ))}
            </div>

            <div className="grid border-b border-stone-200 text-center dark:border-white/10 md:grid-cols-[120px_repeat(4,minmax(0,1fr))]">
              <Cell muted>地支</Cell>
              {pillars.map((pillar) => (
                <LargeValueCell
                  key={`${pillar.key}-branch`}
                  highlight={pillar.key === 'day'}
                  value={pillar.pillar?.branch ?? '—'}
                />
              ))}
            </div>

            <div className="grid border-b border-stone-200 text-center dark:border-white/10 md:grid-cols-[120px_repeat(4,minmax(0,1fr))]">
              <Cell muted>主星</Cell>
              {pillars.map((pillar) => (
                <Cell key={`${pillar.key}-main-star`}>{pillar.mainStar ?? '待计算'}</Cell>
              ))}
            </div>

            <div className="grid border-b border-stone-200 text-center dark:border-white/10 md:grid-cols-[120px_repeat(4,minmax(0,1fr))]">
              <Cell muted>副星</Cell>
              {pillars.map((pillar) => (
                <Cell key={`${pillar.key}-sub-star`}>{pillar.subStars.length ? pillar.subStars.join(' / ') : '待计算'}</Cell>
              ))}
            </div>

            <div className="grid border-b border-stone-200 text-center dark:border-white/10 md:grid-cols-[120px_repeat(4,minmax(0,1fr))]">
              <Cell muted>天干十神</Cell>
              {pillars.map((pillar) => (
                <Cell key={`${pillar.key}-god`}>{pillar.stemTenGod ?? '待计算'}</Cell>
              ))}
            </div>

            <div className="grid border-b border-stone-200 text-center dark:border-white/10 md:grid-cols-[120px_repeat(4,minmax(0,1fr))]">
              <Cell muted>地支十神</Cell>
              {pillars.map((pillar) => (
                <Cell key={`${pillar.key}-branch-god`}>{pillar.branchTenGod ?? '待计算'}</Cell>
              ))}
            </div>

            <div className="grid border-b border-stone-200 text-center dark:border-white/10 md:grid-cols-[120px_repeat(4,minmax(0,1fr))]">
              <Cell muted>藏干</Cell>
              {pillars.map((pillar) => (
                <Cell key={`${pillar.key}-hidden`}>{formatHiddenStems(pillar)}</Cell>
              ))}
            </div>

            <div className="grid border-b border-stone-200 text-center dark:border-white/10 md:grid-cols-[120px_repeat(4,minmax(0,1fr))]">
              <Cell muted>纳音</Cell>
              {pillars.map((pillar) => (
                <Cell key={`${pillar.key}-nayin`}>{pillar.naYin ?? '待计算'}</Cell>
              ))}
            </div>

            <div className="grid border-b border-stone-200 text-center dark:border-white/10 md:grid-cols-[120px_repeat(4,minmax(0,1fr))]">
              <Cell muted>空亡</Cell>
              {pillars.map((pillar) => (
                <Cell key={`${pillar.key}-empty`}>{pillar.emptyBranches.length ? pillar.emptyBranches.join(' / ') : '待计算'}</Cell>
              ))}
            </div>

            <div className="grid text-center md:grid-cols-[120px_repeat(4,minmax(0,1fr))]">
              <Cell muted>状态</Cell>
              {pillars.map((pillar) => (
                <Cell key={`${pillar.key}-status`} subtle>
                  {pillar.status === 'known'
                    ? '已就绪'
                    : pillar.status === 'unknown'
                      ? '未知时辰'
                      : '待计算'}
                </Cell>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-xs text-stone-600 dark:text-stone-300">
            <MetaPill>{YEAR_BOUNDARY_LABELS[config.yearBoundaryRule]}</MetaPill>
            <MetaPill>{MONTH_BOUNDARY_LABELS[config.monthBoundaryRule]}</MetaPill>
            <MetaPill>{DAY_BOUNDARY_LABELS[config.dayBoundaryRule]}</MetaPill>
            <MetaPill>{result.summary.title}</MetaPill>
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <SectionCard title="五行统计">
          <div className="space-y-4">
            {Object.entries(result.fiveElements).map(([element, count]) => (
              <div key={element} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-stone-800 dark:text-stone-200">
                    {FIVE_ELEMENT_LABELS[element as keyof typeof result.fiveElements]}
                  </span>
                  <span className="text-stone-500 dark:text-stone-400">
                    {count === null ? '待计算' : `${count} 项`}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-stone-100 dark:bg-white/10">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-400"
                    style={{ width: count === null ? '10%' : `${Math.min(count * 20, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="专业字段面板">
          <div className="grid gap-4 md:grid-cols-3">
            <StarPanel title="主星" items={result.professionPanel.primaryStars} />
            <StarPanel title="副星" items={result.professionPanel.secondaryStars} />
            <StarPanel title="神煞 / 标记" items={result.professionPanel.deityMarkers} />
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <SectionCard title="藏干与十神细节">
          <div className="grid gap-3 sm:grid-cols-2">
            {pillars.map((pillar) => (
              <article
                key={`${pillar.key}-detail`}
                className="rounded-[22px] border border-stone-200 bg-stone-50/80 p-4 dark:border-white/10 dark:bg-white/5"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-semibold text-stone-950 dark:text-stone-50">{pillar.label}</h3>
                  <span className="text-xs text-stone-500 dark:text-stone-400">
                    {pillar.pillar ? `${pillar.pillar.stem}${pillar.pillar.branch}` : '待计算'}
                  </span>
                </div>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <dt className="text-stone-500 dark:text-stone-400">天干十神</dt>
                    <dd className="text-right text-stone-700 dark:text-stone-200">{pillar.stemTenGod ?? '待计算'}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <dt className="text-stone-500 dark:text-stone-400">地支十神</dt>
                    <dd className="text-right text-stone-700 dark:text-stone-200">{pillar.branchTenGod ?? '待计算'}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <dt className="text-stone-500 dark:text-stone-400">藏干明细</dt>
                    <dd className="text-right text-stone-700 dark:text-stone-200">{formatHiddenStemDetail(pillar)}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="结果摘要">
          <div className="space-y-4">
            <div className="rounded-[20px] border border-amber-200 bg-amber-50/80 p-4 text-sm leading-7 text-stone-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-50">
              {result.summary.message}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {result.summary.completeness.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-2xl border border-stone-200 bg-stone-50/80 px-4 py-3 text-sm dark:border-white/10 dark:bg-white/5"
                >
                  <span className="text-stone-700 dark:text-stone-200">{item.label}</span>
                  <span
                    className={cn(
                      'rounded-full px-3 py-1 text-xs font-medium',
                      item.ready
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200'
                        : 'bg-stone-100 text-stone-600 dark:bg-white/10 dark:text-stone-300',
                    )}
                  >
                    {item.ready ? '已接入' : '待接入'}
                  </span>
                </div>
              ))}
            </div>
            <div className="space-y-3 text-sm leading-7 text-stone-600 dark:text-stone-300">
              {result.highlights.map((item) => (
                <div
                  key={item}
                  className="rounded-[20px] border border-stone-200 bg-stone-50/80 px-4 py-3 dark:border-white/10 dark:bg-white/5"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  )
}

function Cell({
  children,
  muted = false,
  strong = false,
  subtle = false,
}: {
  children: string
  muted?: boolean
  strong?: boolean
  subtle?: boolean
}) {
  return (
    <div
      className={cn(
        'flex min-h-14 items-center justify-center px-3 py-3 text-sm',
        muted && 'bg-stone-100/80 font-medium text-stone-500 dark:bg-white/[0.04] dark:text-stone-400',
        strong && 'font-semibold text-stone-950 dark:text-stone-50',
        subtle && 'text-xs text-stone-500 dark:text-stone-400',
        !muted && !strong && !subtle && 'text-stone-700 dark:text-stone-200',
      )}
    >
      {children}
    </div>
  )
}

function LargeValueCell({ value, highlight = false }: { value: string; highlight?: boolean }) {
  return (
    <div
      className={cn(
        'flex min-h-20 items-center justify-center px-3 py-4 text-3xl font-semibold tracking-[0.12em] text-stone-950 dark:text-stone-50',
        highlight && 'bg-amber-50/80 dark:bg-amber-500/10',
      )}
    >
      {value}
    </div>
  )
}

function MetaPill({ children }: { children: string }) {
  return (
    <span className="rounded-full border border-stone-300 px-3 py-1 dark:border-white/15">{children}</span>
  )
}

function StarPanel({ title, items }: { title: string; items: AuxiliaryStar[] }) {
  return (
    <article className="rounded-[22px] border border-stone-200 bg-stone-50/80 p-4 dark:border-white/10 dark:bg-white/5">
      <h3 className="text-base font-semibold text-stone-950 dark:text-stone-50">{title}</h3>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item.name} className="flex items-center justify-between gap-3 text-sm">
            <span className="text-stone-600 dark:text-stone-300">{item.name}</span>
            <span className="font-medium text-stone-900 dark:text-stone-100">{item.value ?? '待计算'}</span>
          </div>
        ))}
      </div>
    </article>
  )
}

function formatHiddenStems(pillar: PillarDetail) {
  if (pillar.hiddenStems.length === 0) {
    return '待计算'
  }

  return pillar.hiddenStems.map((item) => item.stem).join(' / ')
}

function formatHiddenStemDetail(pillar: PillarDetail) {
  if (pillar.hiddenStems.length === 0) {
    return '待计算'
  }

  return pillar.hiddenStems
    .map((item) => `${item.stem}${item.tenGodToDayMaster ? `（${item.tenGodToDayMaster}）` : ''}`)
    .join(' / ')
}
