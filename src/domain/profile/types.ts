/**
 * 文件作用：定义出生资料、排盘输入的领域模型。
 * 系统位置：domain/profile/types.ts
 * 上游依赖：无
 * 下游影响：features/input, domain/history, 后续排盘计算入口
 * 约束：只描述输入与资料实体，不承载 UI 表单状态或计算逻辑。
 * 备注：birthTime 允许为 null，用于“未知时辰”模式。
 */

export type CalendarType = 'solar' | 'lunar'

export type Gender = 'male' | 'female'

export interface BirthInput {
  calendarType: CalendarType
  birthDate: string
  birthTime: string | null
  gender: Gender
  isLeapMonth?: boolean
  note?: string
}

export interface BirthProfileDraft extends BirthInput {
  name?: string
  label?: string
}

export interface BirthProfile extends BirthProfileDraft {
  id: string
  createdAt: string
  updatedAt: string
}
