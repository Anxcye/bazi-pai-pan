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
      <section style={{ marginTop: 24 }}>
        <h2>排盘结果</h2>
        <p>提交出生信息后，这里会展示最近一次排盘结果。</p>
      </section>
    )
  }

  const { input, pillars, submittedAt } = latestChart

  return (
    <section style={{ marginTop: 24 }}>
      <h2>排盘结果</h2>
      <div style={{ display: 'grid', gap: 8 }}>
        <div>提交时间：{new Date(submittedAt).toLocaleString()}</div>
        <div>历法：{input.calendarType === 'solar' ? '公历' : '农历'}</div>
        <div>出生日期：{input.birthDate || '未填写'}</div>
        <div>出生时间：{input.birthTime || '未知时辰'}</div>
        <div>时区：{input.timezone}</div>
        <div>性别：{input.gender}</div>
        <div>出生地：{input.birthPlace || '未填写'}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12, marginTop: 16 }}>
        <PillarCard label="年柱" value={pillars.year.ganzhi} />
        <PillarCard label="月柱" value={pillars.month.ganzhi} />
        <PillarCard label="日柱" value={pillars.day.ganzhi} />
        <PillarCard label="时柱" value={pillars.hour?.ganzhi ?? '未知时辰'} />
      </div>
    </section>
  )
}

function PillarCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        border: '1px solid #333',
        borderRadius: 12,
        padding: 16,
        minHeight: 88,
      }}
    >
      <div style={{ fontSize: 14, opacity: 0.7 }}>{label}</div>
      <div style={{ marginTop: 8, fontSize: 20, fontWeight: 700 }}>{value}</div>
    </div>
  )
}
