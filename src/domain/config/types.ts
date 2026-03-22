/**
 * 文件作用：定义排盘规则配置与展示开关模型。
 * 系统位置：domain/config/types.ts
 * 上游依赖：无
 * 下游影响：features/config, domain/history, 后续 calendar/bazi 计算模块
 * 约束：规则枚举集中在这里维护，避免散落在组件和算法实现中。
 * 备注：真太阳时在 v1 先预留模型，不实现实际换算。
 */

export type DayBoundaryRule = 'midnight' | 'zi-hour' | 'split-zi-hour'

export type YearBoundaryRule = 'lichun'

export type MonthBoundaryRule = 'jieqi'

export interface PaipanDisplayOptions {
  showHiddenStems: boolean
  showTenGods: boolean
  showFiveElements: boolean
  showLuckCycles: boolean
}

export interface PaipanRuleConfig {
  yearBoundaryRule: YearBoundaryRule
  monthBoundaryRule: MonthBoundaryRule
  dayBoundaryRule: DayBoundaryRule
  trueSolarTimeEnabled: boolean
  displayOptions: PaipanDisplayOptions
}
