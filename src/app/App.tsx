/**
 * 文件作用：装配 bazi-pai-pan v1 tab 化骨架首页。
 * 系统位置：app/App.tsx
 * 上游依赖：domain/config/defaults, features/*
 * 下游影响：应用入口
 * 约束：这里只负责页面组装与本地视图切换，不承载排盘计算和持久化逻辑。
 */

import { useState } from 'react'

import { DEFAULT_PAIPAN_RULE_CONFIG } from '../domain/config/defaults.ts'
import { ChartPreviewSection } from '../features/chart/ChartPreviewSection.tsx'
import { RuleConfigSection } from '../features/config/RuleConfigSection.tsx'
import { HistorySection } from '../features/history/HistorySection.tsx'
import { BirthInfoFormSection } from '../features/input/BirthInfoFormSection.tsx'
import { defaultBirthFormValues, historyRecords, previewChartResult } from './mockState.ts'

type MainTabKey = 'paipan' | 'result' | 'history' | 'settings'

const mainTabs: Array<{ key: MainTabKey; label: string }> = [
  { key: 'paipan', label: '排盘' },
  { key: 'result', label: '结果' },
  { key: 'history', label: '历史' },
  { key: 'settings', label: '设置' },
]

function App() {
  const [activeMainTab, setActiveMainTab] = useState<MainTabKey>('paipan')

  return (
    <main className="min-h-screen px-4 py-6 text-stone-900 sm:px-6 lg:px-8 lg:py-8 dark:text-stone-100">
      <div className="mx-auto max-w-7xl space-y-5">
        <section className="rounded-[24px] border border-white/70 bg-white/80 p-2 shadow-[0_24px_70px_-40px_rgba(68,53,35,0.55)] backdrop-blur-sm dark:border-white/10 dark:bg-stone-950/75">
          <div className="grid gap-2 md:grid-cols-4">
            {mainTabs.map((tab) => {
              const isActive = tab.key === activeMainTab

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveMainTab(tab.key)}
                  className={[
                    'rounded-[18px] px-4 py-3 text-sm font-medium transition',
                    isActive
                      ? 'bg-stone-900 text-white dark:bg-amber-400 dark:text-stone-950'
                      : 'bg-transparent text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-white/5',
                  ].join(' ')}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </section>

        {activeMainTab === 'paipan' ? (
          <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
            <div className="space-y-6">
              <BirthInfoFormSection defaultValue={defaultBirthFormValues} />
            </div>
            <div className="space-y-6">
              <QuickActionCard onGoResult={() => setActiveMainTab('result')} />
              <ResultSnapshotCard onGoResult={() => setActiveMainTab('result')} />
            </div>
          </div>
        ) : null}

        {activeMainTab === 'result' ? (
          <div className="space-y-6">
            <ChartPreviewSection result={previewChartResult} config={DEFAULT_PAIPAN_RULE_CONFIG} />
            <LuckOverviewSection />
            <ResultDetailSection onGoSettings={() => setActiveMainTab('settings')} />
          </div>
        ) : null}

        {activeMainTab === 'history' ? <HistorySection records={historyRecords} /> : null}

        {activeMainTab === 'settings' ? <RuleConfigSection value={DEFAULT_PAIPAN_RULE_CONFIG} /> : null}
      </div>
    </main>
  )
}

function QuickActionCard({ onGoResult }: { onGoResult: () => void }) {
  return (
    <section className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-[0_24px_70px_-40px_rgba(68,53,35,0.55)] backdrop-blur-sm dark:border-white/10 dark:bg-stone-950/75">
      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-stone-950 dark:text-stone-50">先把排盘动作做顺</h2>
        <p className="text-sm leading-7 text-stone-600 dark:text-stone-300">
          这一页只保留输入和必要提示，让人先完成一次排盘。结果、历史、设置都放到各自 tab，不在首页抢注意力。
        </p>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onGoResult}
          className="rounded-full bg-stone-900 px-5 py-3 text-sm font-medium text-white dark:bg-amber-400 dark:text-stone-950"
        >
          查看结果页结构
        </button>
        <span className="rounded-full border border-stone-300 px-4 py-3 text-sm text-stone-600 dark:border-white/15 dark:text-stone-300">
          下一步接“开始排盘”按钮逻辑
        </span>
      </div>
    </section>
  )
}

function ResultSnapshotCard({ onGoResult }: { onGoResult: () => void }) {
  return (
    <section className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-[0_24px_70px_-40px_rgba(68,53,35,0.55)] backdrop-blur-sm dark:border-white/10 dark:bg-stone-950/75">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-stone-950 dark:text-stone-50">最近一次结果摘要</h2>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">当前仍是结构预览状态</p>
        </div>
        <button
          type="button"
          onClick={onGoResult}
          className="rounded-full border border-stone-300 px-4 py-2 text-sm text-stone-700 dark:border-white/15 dark:text-stone-200"
        >
          打开结果
        </button>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {previewChartResult.summary.completeness.slice(0, 4).map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-stone-200 bg-stone-50/80 p-4 dark:border-white/10 dark:bg-white/5"
          >
            <div className="text-sm font-medium text-stone-900 dark:text-stone-100">{item.label}</div>
            <div className="mt-1 text-xs text-stone-500 dark:text-stone-400">
              {item.ready ? '已接入' : '待接入'}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function LuckOverviewSection() {
  const blocks = [
    { title: '大运', hint: '从起运年龄开始展开十步大运' },
    { title: '流年', hint: '按年份查看当前运势骨架与干支结果' },
    { title: '流月 / 流日 / 流时', hint: '适合后续做联动切换与快速查看' },
  ]

  return (
    <section className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-[0_24px_70px_-40px_rgba(68,53,35,0.55)] backdrop-blur-sm dark:border-white/10 dark:bg-stone-950/75">
      <div className="mb-5 space-y-2">
        <h2 className="text-xl font-semibold text-stone-950 dark:text-stone-50">流运</h2>
        <p className="text-sm leading-7 text-stone-600 dark:text-stone-300">
          结果页顶部先看四柱，流运放在下面展开就够了，不需要再做二级菜单。
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {blocks.map((block) => (
          <article
            key={block.title}
            className="rounded-[24px] border border-stone-200 bg-stone-50/80 p-5 dark:border-white/10 dark:bg-white/5"
          >
            <h3 className="text-base font-semibold text-stone-950 dark:text-stone-50">{block.title}</h3>
            <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-stone-300">{block.hint}</p>
            <div className="mt-4 rounded-2xl border border-dashed border-stone-300 px-4 py-3 text-xs text-stone-500 dark:border-white/15 dark:text-stone-400">
              待接入真实流运结果
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function ResultDetailSection({ onGoSettings }: { onGoSettings: () => void }) {
  return (
    <section className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-[0_24px_70px_-40px_rgba(68,53,35,0.55)] backdrop-blur-sm dark:border-white/10 dark:bg-stone-950/75">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <article className="rounded-[24px] border border-stone-200 bg-stone-50/80 p-5 dark:border-white/10 dark:bg-white/5">
          <h3 className="text-lg font-semibold text-stone-950 dark:text-stone-50">输入快照与规则口径</h3>
          <ul className="mt-4 space-y-3 text-sm text-stone-600 dark:text-stone-300">
            <li>这里适合展示本次排盘使用的原始出生信息。</li>
            <li>也适合展示当前采用的年界 / 月界 / 日界规则。</li>
            <li>后续可以补“时辰未知”或“闰月输入”的特殊标记。</li>
          </ul>
        </article>

        <article className="rounded-[24px] border border-stone-200 bg-stone-50/80 p-5 dark:border-white/10 dark:bg-white/5">
          <h3 className="text-lg font-semibold text-stone-950 dark:text-stone-50">规则配置入口</h3>
          <p className="mt-3 text-sm leading-7 text-stone-600 dark:text-stone-300">
            规则配置不用挤在结果顶部，放到单独设置页更清爽。这里保留跳转入口和说明就够了。
          </p>
          <button
            type="button"
            onClick={onGoSettings}
            className="mt-5 rounded-full border border-stone-300 px-4 py-2 text-sm text-stone-700 dark:border-white/15 dark:text-stone-200"
          >
            去设置页
          </button>
        </article>
      </div>
    </section>
  )
}

export default App
