/**
 * 文件作用：渲染排盘规则配置区域。
 * 系统位置：features/config/RuleConfigSection.tsx
 * 上游依赖：domain/config, shared/constants/paipan, shared/ui/SectionCard
 * 下游影响：后续计算入口与偏好设置持久化
 * 约束：当前只提供配置骨架和默认值，不在组件里解释具体算法。
 * 备注：有争议的日界规则已用单独枚举建模。
 */

import type { PaipanRuleConfig } from '../../domain/config/types.ts'
import {
  DAY_BOUNDARY_OPTIONS,
  MONTH_BOUNDARY_OPTIONS,
  YEAR_BOUNDARY_OPTIONS,
} from '../../shared/constants/paipan.ts'
import { SectionCard } from '../../shared/ui/SectionCard.tsx'

interface RuleConfigSectionProps {
  value: PaipanRuleConfig
}

export function RuleConfigSection({ value }: RuleConfigSectionProps) {
  return (
    <SectionCard
      eyebrow="Rules"
      title="规则配置"
      description="规则口径集中在配置层，后续 calendar / bazi 模块只读取这里的枚举值，不直接依赖 UI 控件。"
    >
      <div className="space-y-6">
        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-stone-800 dark:text-stone-200">日界规则</legend>
          <div className="grid gap-3">
            {DAY_BOUNDARY_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex gap-3 rounded-2xl border border-stone-200 bg-stone-50/80 p-4 dark:border-white/10 dark:bg-white/5"
              >
                <input
                  type="radio"
                  name="day-boundary-rule"
                  defaultChecked={option.value === value.dayBoundaryRule}
                  className="mt-1 h-4 w-4 border-stone-300 text-amber-600"
                />
                <span className="space-y-1">
                  <span className="block text-sm font-medium text-stone-900 dark:text-stone-100">
                    {option.label}
                  </span>
                  <span className="block text-sm leading-6 text-stone-600 dark:text-stone-300">
                    {option.description}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-4 lg:grid-cols-2">
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-stone-800 dark:text-stone-200">年界规则</legend>
            {YEAR_BOUNDARY_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex gap-3 rounded-2xl border border-stone-200 bg-white p-4 dark:border-white/10 dark:bg-stone-900"
              >
                <input
                  type="radio"
                  name="year-boundary-rule"
                  defaultChecked={option.value === value.yearBoundaryRule}
                  className="mt-1 h-4 w-4 border-stone-300 text-amber-600"
                />
                <span className="space-y-1">
                  <span className="block text-sm font-medium text-stone-900 dark:text-stone-100">
                    {option.label}
                  </span>
                  <span className="block text-sm leading-6 text-stone-600 dark:text-stone-300">
                    {option.description}
                  </span>
                </span>
              </label>
            ))}
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-stone-800 dark:text-stone-200">月界规则</legend>
            {MONTH_BOUNDARY_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex gap-3 rounded-2xl border border-stone-200 bg-white p-4 dark:border-white/10 dark:bg-stone-900"
              >
                <input
                  type="radio"
                  name="month-boundary-rule"
                  defaultChecked={option.value === value.monthBoundaryRule}
                  className="mt-1 h-4 w-4 border-stone-300 text-amber-600"
                />
                <span className="space-y-1">
                  <span className="block text-sm font-medium text-stone-900 dark:text-stone-100">
                    {option.label}
                  </span>
                  <span className="block text-sm leading-6 text-stone-600 dark:text-stone-300">
                    {option.description}
                  </span>
                </span>
              </label>
            ))}
          </fieldset>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <label className="flex items-start gap-3 rounded-2xl border border-dashed border-stone-300 bg-stone-50/80 p-4 text-sm text-stone-600 dark:border-white/15 dark:bg-white/5 dark:text-stone-300">
            <input
              type="checkbox"
              defaultChecked={value.trueSolarTimeEnabled}
              disabled
              className="mt-1 h-4 w-4 rounded border-stone-300"
            />
            <span>
              <span className="block font-medium text-stone-900 dark:text-stone-100">真太阳时</span>
              <span className="mt-1 block leading-6">模型已预留，v1 暂不接入实际换算。</span>
            </span>
          </label>

          <div className="rounded-2xl border border-stone-200 bg-white p-4 dark:border-white/10 dark:bg-stone-900">
            <p className="text-sm font-medium text-stone-900 dark:text-stone-100">展示开关</p>
            <div className="mt-3 space-y-2 text-sm text-stone-600 dark:text-stone-300">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked={value.displayOptions.showHiddenStems} className="h-4 w-4" />
                <span>显示藏干</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked={value.displayOptions.showTenGods} className="h-4 w-4" />
                <span>显示十神</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked={value.displayOptions.showFiveElements} className="h-4 w-4" />
                <span>显示五行统计</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked={value.displayOptions.showLuckCycles} className="h-4 w-4" />
                <span>显示流运骨架</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  )
}
