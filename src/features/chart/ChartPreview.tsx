/**
 * 文件作用：排盘结果预览组件，展示当前录入摘要与占位盘结构。
 * 系统位置：src/features/chart/ChartPreview.tsx
 * 上游依赖：src/storage/useBaziStore
 * 下游影响：结果页演进
 * 约束：当前只做结构占位，不做真实计算。
 */

import { useBaziStore } from '../../storage/useBaziStore'

export function ChartPreview() {
  const latestChart = useBaziStore((state) => state.latestChart)

  if (!latestChart) {
    return (
      <section className="rounded-2xl border border-dashed border-[var(--border)] p-8 text-center text-[var(--text)]">
        <p className="text-lg">提交出生信息后，这里会展示排盘结果</p>
      </section>
    )
  }

  const { input, pillars, submittedAt } = latestChart

  return (
    <section className="space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-[var(--text-h)]">排盘结果</h2>

      <div className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
        <InfoRow label="提交时间" value={new Date(submittedAt).toLocaleString()} />
        <InfoRow label="历法" value={input.calendarType === 'solar' ? '公历' : '农历'} />
        <InfoRow label="出生日期" value={input.birthDate || '未填写'} />
        <InfoRow label="出生时间" value={input.birthTime || '未知时辰'} />
        <InfoRow label="时区" value={input.timezone} />
        <InfoRow label="性别" value={input.gender} />
        {input.birthPlace && <InfoRow label="出生地" value={input.birthPlace} />}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <PillarCard label="年柱" value={pillars.year.ganzhi} />
        <PillarCard label="月柱" value={pillars.month.ganzhi} />
        <PillarCard label="日柱" value={pillars.day.ganzhi} />
        <PillarCard label="时柱" value={pillars.hour?.ganzhi ?? '未知时辰'} />
      </div>
    </section>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-[var(--border)] py-1.5">
      <span className="text-[var(--text)]">{label}</span>
      <span className="font-medium text-[var(--text-h)]">{value}</span>
    </div>
  )
}

function PillarCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-[var(--border)] bg-[var(--accent-bg)] px-4 py-5">
      <span className="text-xs tracking-wide text-[var(--text)]">{label}</span>
      <span className="mt-2 text-2xl font-bold text-[var(--text-h)]">{value}</span>
    </div>
  )
}
