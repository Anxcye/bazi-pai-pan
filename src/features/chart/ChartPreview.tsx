/**
 * 文件作用：排盘结果预览占位组件。
 * 系统位置：src/features/chart/ChartPreview.tsx
 * 上游依赖：src/types/bazi
 * 下游影响：结果页演进
 * 约束：当前只做结构占位，不做真实计算。
 */

export function ChartPreview() {
  return (
    <section style={{ marginTop: 24 }}>
      <h2>排盘结果</h2>
      <p>下一步接入历法底座和四柱计算入口。</p>
    </section>
  )
}
