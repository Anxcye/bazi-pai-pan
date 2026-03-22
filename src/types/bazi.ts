/**
 * 文件作用：八字排盘基础类型定义。
 * 系统位置：src/types/bazi.ts
 * 上游依赖：无
 * 下游影响：features/input, features/chart, domain/bazi, storage
 * 约束：仅放领域类型，不放 UI 类型。
 * 备注：后续按规格书继续扩展。
 */

export type CalendarType = 'solar' | 'lunar'
export type Gender = 'male' | 'female' | 'other'
export type DayBoundaryRule = 'midnight' | 'zi-hour' | 'split-zi-hour'

export interface BirthInput {
  calendarType: CalendarType
  birthDate: string
  birthTime: string | null
  timezone: string
  gender: Gender
  birthPlace?: string
  longitude?: number
  latitude?: number
  useTrueSolarTime?: boolean
  dayBoundaryRule?: DayBoundaryRule
  isDstAware?: boolean
  note?: string
}

export interface Pillar {
  gan: string
  zhi: string
  ganzhi: string
}

export interface BaziChart {
  input: BirthInput
  submittedAt: string
  pillars: {
    year: Pillar
    month: Pillar
    day: Pillar
    hour: Pillar | null
  }
}
