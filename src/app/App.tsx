/**
 * 文件作用：装配 bazi-pai-pan v1 tab 化骨架首页。
 * 系统位置：app/App.tsx
 * 上游依赖：domain/config/defaults, features/*
 * 下游影响：应用入口
 * 约束：负责页面组装、视图切换与最小可用排盘流程编排。
 */

import { useMemo, useState } from 'react'

import { DEFAULT_PAIPAN_RULE_CONFIG } from '../domain/config/defaults.ts'
import { ChartPreviewSection } from '../features/chart/ChartPreviewSection.tsx'
import { RuleConfigSection } from '../features/config/RuleConfigSection.tsx'
import { HistorySection } from '../features/history/HistorySection.tsx'
import { BirthInfoFormSection } from '../features/input/BirthInfoFormSection.tsx'
import type { BirthInfoFormValues } from '../features/input/model.ts'
import { createLiveChart } from './liveState.ts'
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
  const [formValues, setFormValues] = useState<BirthInfoFormValues>(defaultBirthFormValues)

  const liveChart = useMemo(() => createLiveChart(formValues), [formValues])

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
              <BirthInfoFormSection
                defaultValue={formValues}
                onSubmit={(values) => {
                  setFormValues(values)
                  setActiveMainTab('result')
                }}
              />
            </div>
            <div className="space-y-6">
              <QuickActionCard onGoResult={() => setActiveMainTab('result')} />
              <ResultSnapshotCard onGoResult={() => setActiveMainTab('result')} chartTitle={liveChart.summary.title} />
            </div>
          </div>
        ) : null}

        {activeMainTab === 'result' ? (
          <div className="space-y-6">
            <ChartPreviewSection result={liveChart ?? previewChartResult} config={DEFAULT_PAIPAN_RULE_CONFIG} />
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
          现在已经接入第一版真实四柱计算入口。提交出生信息后，会直接进入结果页查看排盘结果。
        </p>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onGoResult}
          className="rounded-full bg-stone-900 px-5 py-3 text-sm font-medium text-white dark:bg-amber-400 dark:text-stone-950"
        >
          查看当前结果
        </button>
        <span className="rounded-full border border-stone-300 px-4 py-3 text-sm text-stone-600 dark:border-white/15 dark:text-stone-300">
          已接入四柱基础排盘
        </span>
      </div>
    </section>
  )
}

function ResultSnapshotCard({ onGoResult, chartTitle }: { onGoResult: () => void; chartTitle: string }) {
  return (
    <section className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-[0_24px_70px_-40px_rgba(68,53,35,0.55)] backdrop-blur-sm dark:border-white/10 dark:bg-stone-950/75">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-stone-950 dark:text-stone-50">最近一次结果摘要</h2>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{chartTitle}</p>
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
        {liveSummaryItems.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-stone-200 bg-stone-50/80 p-4 dark:border-white/10 dark:bg-white/5"
          >
            <div className="text-sm font-medium text-stone-900 dark:text-stone-100">{item.label}</div>
            <div className="mt-1 text-xs text-stone-500 dark:text-stone-400">{item.value}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

const liveSummaryItems = [
  { label: '四柱', value: '已接入' },
  { label: '藏干', value: '已接入' },
  { label: '天干十神', value: '已接入' },
  { label: '流运', value: '继续开发中' },
]

export default App
