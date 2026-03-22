/**
 * 文件作用：生成占位排盘结果，作为真实算法接入前的稳定入口。
 * 系统位置：src/domain/bazi/createChartPreview.ts
 * 上游依赖：src/types/bazi
 * 下游影响：features/input, features/chart, storage
 * 约束：当前不实现真实命理计算，只返回固定结构占位值。
 * 备注：后续可替换为真实四柱计算而不改 UI 调用方式。
 */

import type { BaziChart, BirthInput } from '../../types/bazi'

const EMPTY_PILLAR = { gan: '—', zhi: '—', ganzhi: '待计算' }

export function createChartPreview(input: BirthInput): BaziChart {
  return {
    input,
    submittedAt: new Date().toISOString(),
    pillars: {
      year: EMPTY_PILLAR,
      month: EMPTY_PILLAR,
      day: EMPTY_PILLAR,
      hour: input.birthTime ? EMPTY_PILLAR : null,
    },
  }
}
