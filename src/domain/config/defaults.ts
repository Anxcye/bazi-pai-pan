/**
 * 文件作用：提供 v1 排盘规则默认值。
 * 系统位置：domain/config/defaults.ts
 * 上游依赖：domain/config/types
 * 下游影响：app 组装层、features/config、历史记录默认快照
 * 约束：默认值必须与 docs/PAIPAN_SPEC.md 保持一致。
 * 备注：规则变更时需要同步更新规格文档。
 */

import type { PaipanRuleConfig } from './types.ts'

export const DEFAULT_PAIPAN_RULE_CONFIG: PaipanRuleConfig = {
  yearBoundaryRule: 'lichun',
  monthBoundaryRule: 'jieqi',
  dayBoundaryRule: 'midnight',
  trueSolarTimeEnabled: false,
  displayOptions: {
    showHiddenStems: true,
    showTenGods: true,
    showFiveElements: true,
    showLuckCycles: false,
  },
}
