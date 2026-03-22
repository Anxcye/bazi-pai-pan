/**
 * 文件作用：集中维护排盘相关的静态选项与标签映射。
 * 系统位置：shared/constants/paipan.ts
 * 上游依赖：domain/profile, domain/config, domain/bazi
 * 下游影响：features/input, features/config, features/chart, features/history
 * 约束：这里只放稳定常量，不放运行时状态和算法逻辑。
 * 备注：后续新增规则枚举时，应同步补充对应标签。
 */

import type { FiveElement, PillarKey } from '../../domain/bazi/types.ts'
import type {
  DayBoundaryRule,
  MonthBoundaryRule,
  YearBoundaryRule,
} from '../../domain/config/types.ts'
import type { CalendarType, Gender } from '../../domain/profile/types.ts'

export const CALENDAR_OPTIONS: Array<{
  value: CalendarType
  label: string
  description: string
}> = [
  { value: 'solar', label: '公历', description: '标准公历日期输入，后续统一进入排盘计算。' },
  { value: 'lunar', label: '农历', description: '支持农历与闰月建模，内部仍会标准化处理。' },
]

export const GENDER_OPTIONS: Array<{
  value: Gender
  label: string
}> = [
  { value: 'male', label: '男' },
  { value: 'female', label: '女' },
]

export const DAY_BOUNDARY_OPTIONS: Array<{
  value: DayBoundaryRule
  label: string
  description: string
}> = [
  { value: 'midnight', label: '00:00 换日', description: '默认口径，按本地标准时间零点切日柱。' },
  { value: 'zi-hour', label: '23:00 换日', description: '子初换日，适合对齐部分传统排盘口径。' },
  {
    value: 'split-zi-hour',
    label: '早晚子时',
    description: '保留早子时与晚子时的分段处理空间。',
  },
]

export const YEAR_BOUNDARY_OPTIONS: Array<{
  value: YearBoundaryRule
  label: string
  description: string
}> = [
  { value: 'lichun', label: '立春切年', description: '年柱以立春作为干支年切换点。' },
]

export const MONTH_BOUNDARY_OPTIONS: Array<{
  value: MonthBoundaryRule
  label: string
  description: string
}> = [
  { value: 'jieqi', label: '节气切月', description: '月柱按“节”切换，不直接以农历月代替。' },
]

export const DAY_BOUNDARY_LABELS: Record<DayBoundaryRule, string> = {
  midnight: '00:00 换日',
  'zi-hour': '23:00 换日',
  'split-zi-hour': '早晚子时',
}

export const YEAR_BOUNDARY_LABELS: Record<YearBoundaryRule, string> = {
  lichun: '立春切年',
}

export const MONTH_BOUNDARY_LABELS: Record<MonthBoundaryRule, string> = {
  jieqi: '节气切月',
}

export const PILLAR_LABELS: Record<PillarKey, string> = {
  year: '年柱',
  month: '月柱',
  day: '日柱',
  hour: '时柱',
}

export const FIVE_ELEMENT_LABELS: Record<FiveElement, string> = {
  wood: '木',
  fire: '火',
  earth: '土',
  metal: '金',
  water: '水',
}
