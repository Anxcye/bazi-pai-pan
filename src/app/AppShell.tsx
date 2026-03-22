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
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">八字排盘</h1>
        <p className="mt-2 text-[var(--text)]">录入出生信息，即时生成八字命盘</p>
      </header>
      <div className="space-y-8">
        <BirthInfoForm />
        <ChartPreview />
      </div>
    </main>
  )
}
