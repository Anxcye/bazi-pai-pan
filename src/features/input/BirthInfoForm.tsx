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
    <section>
      <h2>出生信息</h2>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gap: 12 }}>
        <label>
          历法
          <select {...register('calendarType')}>
            <option value="solar">公历</option>
            <option value="lunar">农历</option>
          </select>
        </label>
        <label>
          出生日期
          <input type="date" {...register('birthDate')} />
        </label>
        <label>
          出生时间
          <input type="time" {...register('birthTime')} />
        </label>
        <label>
          时区
          <input {...register('timezone')} placeholder="Asia/Shanghai" />
        </label>
        <label>
          性别
          <select {...register('gender')}>
            <option value="male">男</option>
            <option value="female">女</option>
            <option value="other">其他</option>
          </select>
        </label>
        <label>
          出生地
          <input {...register('birthPlace')} placeholder="可选" />
        </label>
        <button type="submit">开始排盘</button>
      </form>
    </section>
  )
}
