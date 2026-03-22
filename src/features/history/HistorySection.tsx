/**
 * 文件作用：渲染历史记录占位区域。
 * 系统位置：features/history/HistorySection.tsx
 * 上游依赖：domain/history, shared/constants/paipan, shared/ui/SectionCard
 * 下游影响：后续 storage 层、历史列表筛选与回填能力
 * 约束：当前只展示记录实体结构，不接本地存储读写。
 * 备注：记录列表明确区分输入快照和计算状态，便于后续自动保存。
 */

import type { PaipanHistoryRecord } from '../../domain/history/types.ts'
import { DAY_BOUNDARY_LABELS } from '../../shared/constants/paipan.ts'
import { cn } from '../../shared/lib/cn.ts'
import { SectionCard } from '../../shared/ui/SectionCard.tsx'

interface HistorySectionProps {
  records: PaipanHistoryRecord[]
}

export function HistorySection({ records }: HistorySectionProps) {
  return (
    <SectionCard
      eyebrow="History"
      title="历史记录占位"
      description="先把历史实体和列表结构固定下来，后续 storage 层只需要负责保存、读取与筛选。"
      footer={
        <p className="text-sm leading-6 text-stone-600 dark:text-stone-300">
          默认策略：完成排盘后自动保存输入、规则配置和结果摘要。当前列表使用 mock 快照，仅验证实体结构。
        </p>
      }
    >
      <div className="space-y-4">
        {records.map((record) => (
          <article
            key={record.id}
            className="rounded-[24px] border border-stone-200 bg-white p-5 dark:border-white/10 dark:bg-stone-900"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-semibold text-stone-950 dark:text-stone-50">{record.title}</h3>
                  <span
                    className={cn(
                      'rounded-full px-3 py-1 text-xs font-medium',
                      record.status === 'computed'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200'
                        : 'bg-stone-100 text-stone-600 dark:bg-white/10 dark:text-stone-300',
                    )}
                  >
                    {record.status === 'draft'
                      ? '草稿'
                      : record.status === 'saved'
                        ? '已保存'
                        : '已计算'}
                  </span>
                </div>
                <p className="text-sm text-stone-600 dark:text-stone-300">
                  {record.input.birthDate} / {record.input.birthTime ?? '未知时辰'} /{' '}
                  {record.input.calendarType === 'solar' ? '公历' : '农历'}
                </p>
              </div>

              <div className="text-right text-xs text-stone-500 dark:text-stone-400">
                <p>更新于 {record.updatedAt}</p>
                <p className="mt-1">{DAY_BOUNDARY_LABELS[record.config.dayBoundaryRule]}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {record.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-stone-300 px-3 py-1 text-xs text-stone-600 dark:border-white/15 dark:text-stone-300"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-4 rounded-2xl bg-stone-100/80 p-4 text-sm leading-6 text-stone-600 dark:bg-white/5 dark:text-stone-300">
              <p className="font-medium text-stone-900 dark:text-stone-100">{record.resultSummary.title}</p>
              <p className="mt-1">{record.resultSummary.message}</p>
            </div>
          </article>
        ))}
      </div>
    </SectionCard>
  )
}
