/**
 * 文件作用：定义历史记录与排盘快照实体。
 * 系统位置：domain/history/types.ts
 * 上游依赖：domain/profile, domain/config, domain/bazi
 * 下游影响：features/history, storage, 后续快照保存逻辑
 * 约束：历史记录只描述已保存数据，不负责保存策略和存储实现。
 * 备注：v1 先覆盖输入、配置、结果摘要三个维度。
 */

import type { PaipanResultSummary } from '../bazi/types.ts'
import type { PaipanRuleConfig } from '../config/types.ts'
import type { BirthProfile } from '../profile/types.ts'

export type HistoryRecordStatus = 'draft' | 'saved' | 'computed'

export interface PaipanHistoryRecord {
  id: string
  title: string
  tags: string[]
  status: HistoryRecordStatus
  input: BirthProfile
  config: PaipanRuleConfig
  resultSummary: PaipanResultSummary
  createdAt: string
  updatedAt: string
}
