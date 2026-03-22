/**
 * 文件作用：渲染出生信息录入区域。
 * 系统位置：features/input/BirthInfoFormSection.tsx
 * 上游依赖：features/input/model, shared/constants/paipan, shared/ui/SectionCard
 * 下游影响：后续排盘入口、资料保存与历史记录
 * 约束：组件只处理交互与输入映射，不承载排盘算法。
 * 备注：当前仅展示结构和标准化预览，不触发真实计算。
 */

import { useForm, useWatch } from 'react-hook-form'

import { CALENDAR_OPTIONS, GENDER_OPTIONS } from '../../shared/constants/paipan.ts'
import { SectionCard } from '../../shared/ui/SectionCard.tsx'
import { toBirthProfileDraft, type BirthInfoFormValues } from './model.ts'

interface BirthInfoFormSectionProps {
  defaultValue: BirthInfoFormValues
  onSubmit?: (values: BirthInfoFormValues) => void
}

export function BirthInfoFormSection({ defaultValue, onSubmit }: BirthInfoFormSectionProps) {
  const { control, register, handleSubmit } = useForm<BirthInfoFormValues>({
    defaultValues: defaultValue,
  })

  const values = useWatch({ control, defaultValue })
  const normalizedDraft = toBirthProfileDraft({ ...defaultValue, ...values })

  return (
    <SectionCard
      eyebrow="Input"
      title="出生信息表单"
      description="先完成录入层骨架和表单到领域输入模型的映射，后续只需要把提交动作接到真实排盘入口。"
      footer={
        <div className="rounded-2xl bg-stone-100/80 p-4 text-sm text-stone-600 dark:bg-white/5 dark:text-stone-300">
          <p className="font-medium text-stone-900 dark:text-stone-100">标准化预览</p>
          <p className="mt-2">
            {normalizedDraft.calendarType === 'solar' ? '公历' : '农历'} {normalizedDraft.birthDate}{' '}
            {normalizedDraft.birthTime ?? '未知时辰'} / {normalizedDraft.gender === 'male' ? '男' : '女'}
            {normalizedDraft.isLeapMonth ? ' / 闰月' : ''}
          </p>
        </div>
      }
    >
      <form className="grid gap-5 lg:grid-cols-2" onSubmit={handleSubmit((formValues) => onSubmit?.(formValues))}>
        <label className="space-y-2">
          <span className="text-sm font-medium text-stone-800 dark:text-stone-200">姓名</span>
          <input
            {...register('name')}
            className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-amber-400 dark:border-white/10 dark:bg-stone-900 dark:text-stone-100"
            placeholder="可选，用于历史记录识别"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-stone-800 dark:text-stone-200">标签</span>
          <input
            {...register('label')}
            className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-amber-400 dark:border-white/10 dark:bg-stone-900 dark:text-stone-100"
            placeholder="如：练习样例 / 家庭档案"
          />
        </label>

        <fieldset className="space-y-3 lg:col-span-2">
          <legend className="text-sm font-medium text-stone-800 dark:text-stone-200">历法类型</legend>
          <div className="grid gap-3 md:grid-cols-2">
            {CALENDAR_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer gap-3 rounded-2xl border border-stone-200 bg-stone-50/80 p-4 transition hover:border-amber-300 dark:border-white/10 dark:bg-white/5"
              >
                <input
                  {...register('calendarType')}
                  type="radio"
                  value={option.value}
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

        <label className="space-y-2">
          <span className="text-sm font-medium text-stone-800 dark:text-stone-200">出生日期</span>
          <input
            {...register('birthDate')}
            type="date"
            className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-amber-400 dark:border-white/10 dark:bg-stone-900 dark:text-stone-100"
          />
        </label>

        <div className="space-y-2">
          <span className="text-sm font-medium text-stone-800 dark:text-stone-200">出生时间</span>
          <input
            {...register('birthTime')}
            type="time"
            disabled={values.isUnknownTime}
            className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-amber-400 disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-400 dark:border-white/10 dark:bg-stone-900 dark:text-stone-100 dark:disabled:bg-white/5"
          />
          <label className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-300">
            <input {...register('isUnknownTime')} type="checkbox" className="h-4 w-4 rounded border-stone-300" />
            <span>未知时辰</span>
          </label>
        </div>

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-stone-800 dark:text-stone-200">性别</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {GENDER_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700 transition hover:border-amber-300 dark:border-white/10 dark:bg-stone-900 dark:text-stone-200"
              >
                <input
                  {...register('gender')}
                  type="radio"
                  value={option.value}
                  className="h-4 w-4 border-stone-300 text-amber-600"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="space-y-2">
          <span className="text-sm font-medium text-stone-800 dark:text-stone-200">补充信息</span>
          <label className="flex items-center gap-2 rounded-2xl border border-dashed border-stone-300 bg-stone-50/80 px-4 py-3 text-sm text-stone-600 dark:border-white/15 dark:bg-white/5 dark:text-stone-300">
            <input
              {...register('isLeapMonth')}
              type="checkbox"
              disabled={values.calendarType !== 'lunar'}
              className="h-4 w-4 rounded border-stone-300"
            />
            <span>闰月输入（仅农历启用）</span>
          </label>
        </div>

        <label className="space-y-2 lg:col-span-2">
          <span className="text-sm font-medium text-stone-800 dark:text-stone-200">备注</span>
          <textarea
            {...register('note')}
            rows={4}
            className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm leading-6 text-stone-900 outline-none transition focus:border-amber-400 dark:border-white/10 dark:bg-stone-900 dark:text-stone-100"
            placeholder="v1 先保留备注位，后续接历史记录与快照保存。"
          />
        </label>

        <div className="lg:col-span-2">
          <button
            type="submit"
            className="inline-flex items-center rounded-full bg-stone-900 px-5 py-3 text-sm font-medium text-white opacity-90 dark:bg-amber-500 dark:text-stone-950"
          >
            开始排盘
          </button>
        </div>
      </form>
    </SectionCard>
  )
}
