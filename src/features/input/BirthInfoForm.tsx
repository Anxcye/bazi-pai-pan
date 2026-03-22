/**
 * 文件作用：出生信息录入表单。
 * 系统位置：src/features/input/BirthInfoForm.tsx
 * 上游依赖：src/types/bazi, src/storage/useBaziStore
 * 下游影响：排盘入口、资料保存
 * 约束：组件只处理交互，不承载排盘算法。
 */

import { useForm } from 'react-hook-form'
import { useBaziStore } from '../../storage/useBaziStore'
import type { BirthInput } from '../../types/bazi'

const defaultValues: BirthInput = {
  calendarType: 'solar',
  birthDate: '',
  birthTime: '',
  timezone: 'Asia/Shanghai',
  gender: 'other',
  useTrueSolarTime: false,
  dayBoundaryRule: 'midnight',
}

const fieldClass =
  'mt-1 block w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--text-h)] shadow-sm transition focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-border)]'

export function BirthInfoForm() {
  const latestInput = useBaziStore((state) => state.latestInput)
  const submitInput = useBaziStore((state) => state.submitInput)

  const { register, handleSubmit } = useForm<BirthInput>({
    defaultValues: latestInput ?? defaultValues,
  })

  const onSubmit = (values: BirthInput) => {
    submitInput({
      ...values,
      birthTime: values.birthTime || null,
    })
  }

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-[var(--text-h)]">出生信息</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-[var(--text)]">
          历法
          <select {...register('calendarType')} className={fieldClass}>
            <option value="solar">公历</option>
            <option value="lunar">农历</option>
          </select>
        </label>
        <label className="block text-sm font-medium text-[var(--text)]">
          出生日期
          <input type="date" {...register('birthDate')} className={fieldClass} />
        </label>
        <label className="block text-sm font-medium text-[var(--text)]">
          出生时间
          <input type="time" {...register('birthTime')} className={fieldClass} />
        </label>
        <label className="block text-sm font-medium text-[var(--text)]">
          时区
          <input {...register('timezone')} placeholder="Asia/Shanghai" className={fieldClass} />
        </label>
        <label className="block text-sm font-medium text-[var(--text)]">
          性别
          <select {...register('gender')} className={fieldClass}>
            <option value="male">男</option>
            <option value="female">女</option>
            <option value="other">其他</option>
          </select>
        </label>
        <label className="block text-sm font-medium text-[var(--text)]">
          出生地
          <input {...register('birthPlace')} placeholder="可选" className={fieldClass} />
        </label>
        <div className="sm:col-span-2">
          <button
            type="submit"
            className="w-full cursor-pointer rounded-lg bg-[var(--accent)] px-5 py-2.5 font-medium text-white shadow transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--accent-border)] focus:ring-offset-2"
          >
            开始排盘
          </button>
        </div>
      </form>
    </section>
  )
}
