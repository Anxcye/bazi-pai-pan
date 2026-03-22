/**
 * 文件作用：渲染更接近真实排盘工具的结果页骨架。
 * 系统位置：features/chart/ChartPreviewSection.tsx
 * 上游依赖：domain/bazi, domain/config, shared/constants/paipan, shared/ui/SectionCard
 * 下游影响：后续真实结果页、本命盘展示、流运展示
 * 约束：未实现的专业字段先隐藏，不用大量“待计算”占位破坏页面质感。
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

  return (
    <div className="space-y-6">
      <SectionCard title="排盘结果" description="顶部先看四柱主盘。其他专业字段等真实算法接入后再逐步展开。">
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
                <Cell key={`${pillar.key}-main-star`}>{pillar.mainStar ?? '—'}</Cell>
              ))}
            </div>

            <div className="grid border-b border-stone-200 text-center dark:border-white/10 md:grid-cols-[120px_repeat(4,minmax(0,1fr))]">
              <Cell muted>副星</Cell>
              {pillars.map((pillar) => (
                <Cell key={`${pillar.key}-sub-star`}>{pillar.subStars.length ? pillar.subStars.join(' / ') : '—'}</Cell>
              ))}
            </div>

            <div className="grid border-b border-stone-200 text-center dark:border-white/10 md:grid-cols-[120px_repeat(4,minmax(0,1fr))]">
              <Cell muted>藏干</Cell>
              {pillars.map((pillar) => (
                <Cell key={`${pillar.key}-hidden`}>{formatHiddenStems(pillar)}</Cell>
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
                      : '未排盘'}
                </Cell>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-xs text-stone-600 dark:text-stone-300">
            <MetaPill>{YEAR_BOUNDARY_LABELS[config.yearBoundaryRule]}</MetaPill>
            <MetaPill>{MONTH_BOUNDARY_LABELS[config.monthBoundaryRule]}</MetaPill>
            <MetaPill>{DAY_BOUNDARY_LABELS[config.dayBoundaryRule]}</MetaPill>
          </div>
        </div>
      </SectionCard>
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

function formatHiddenStems(pillar: PillarDetail) {
  if (pillar.hiddenStems.length === 0) {
    return '—'
  }

  return pillar.hiddenStems.map((item) => item.stem).join(' / ')
}
