/**
 * 文件作用：应用主壳层，组织首页和后续页面区域。
 * 系统位置：src/app/AppShell.tsx
 * 上游依赖：features/input, features/chart
 * 下游影响：src/App.tsx
 * 约束：只负责布局与页面装配，不承载排盘算法。
 */

import { BirthInfoForm } from '../features/input/BirthInfoForm'
import { ChartPreview } from '../features/chart/ChartPreview'

export function AppShell() {
  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
      <h1>八字排盘</h1>
      <p>先把输入、排盘入口和结果骨架搭起来。</p>
      <BirthInfoForm />
      <ChartPreview />
    </main>
  )
}
