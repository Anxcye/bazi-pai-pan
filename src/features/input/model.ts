/**
 * 文件作用：定义出生信息表单模型，并负责映射到领域输入模型。
 * 系统位置：features/input/model.ts
 * 上游依赖：domain/profile
 * 下游影响：features/input/BirthInfoFormSection, 后续 application 层提交流程
 * 约束：这里只做表单状态到领域模型的转换，不做计算。
 * 备注：UI 层允许空字符串，映射后统一转成领域层的 null / undefined。
 */

import type { BirthProfileDraft, CalendarType, Gender } from '../../domain/profile/types.ts'

export interface BirthInfoFormValues {
  name: string
  label: string
  calendarType: CalendarType
  birthDate: string
  birthTime: string
  isUnknownTime: boolean
  gender: Gender
  isLeapMonth: boolean
  note: string
}

export function toBirthProfileDraft(values: BirthInfoFormValues): BirthProfileDraft {
  const name = values.name.trim()
  const label = values.label.trim()
  const note = values.note.trim()

  return {
    name: name || undefined,
    label: label || undefined,
    calendarType: values.calendarType,
    birthDate: values.birthDate,
    birthTime: values.isUnknownTime || !values.birthTime ? null : values.birthTime,
    gender: values.gender,
    isLeapMonth: values.calendarType === 'lunar' ? values.isLeapMonth : undefined,
    note: note || undefined,
  }
}
