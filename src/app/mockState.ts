/**
 * 文件作用：组装 v1 骨架页面所需的初始状态与 mock 数据。
 * 系统位置：app/mockState.ts
 * 上游依赖：domain/*, features/input/model
 * 下游影响：app/App
 * 约束：只提供结构化示例，不伪造复杂排盘算法输出。
 * 备注：真实计算接入后，应逐步替换这些占位数据。
 */

import type { AuxiliaryStar, BaziChartResult, PillarDetail } from '../domain/bazi/types.ts'
import { DEFAULT_PAIPAN_RULE_CONFIG } from '../domain/config/defaults.ts'
import type { PaipanHistoryRecord } from '../domain/history/types.ts'
import type { BirthProfile } from '../domain/profile/types.ts'
import type { BirthInfoFormValues } from '../features/input/model.ts'

function createPendingPillar(key: PillarDetail['key'], label: PillarDetail['label']): PillarDetail {
  return {
    key,
    label,
    pillar: null,
    hiddenStems: [],
    stemTenGod: key === 'day' ? '日主' : null,
    branchTenGod: null,
    mainStar: null,
    subStars: [],
    naYin: null,
    emptyBranches: [],
    status: 'pending',
  }
}

function createPendingStars(names: string[]): AuxiliaryStar[] {
  return names.map((name) => ({
    name,
    value: null,
    status: 'pending',
  }))
}

const previewProfileA: BirthProfile = {
  id: 'profile-a',
  name: '结构样例 A',
  label: '本地草稿',
  calendarType: 'solar',
  birthDate: '1994-06-18',
  birthTime: '08:30',
  gender: 'female',
  note: '用于验证历史记录实体结构。',
  createdAt: '2026-03-20 21:14',
  updatedAt: '2026-03-22 09:10',
}

const previewProfileB: BirthProfile = {
  id: 'profile-b',
  name: '结构样例 B',
  label: '未知时辰',
  calendarType: 'lunar',
  birthDate: '1988-09-12',
  birthTime: null,
  gender: 'male',
  isLeapMonth: false,
  createdAt: '2026-03-19 08:40',
  updatedAt: '2026-03-21 18:32',
}

export const defaultBirthFormValues: BirthInfoFormValues = {
  name: '结构样例 A',
  label: '本地草稿',
  calendarType: 'solar',
  birthDate: '1994-06-18',
  birthTime: '08:30',
  isUnknownTime: false,
  gender: 'female',
  isLeapMonth: false,
  note: '当前页面只做输入模型与布局骨架，下一步再接真实算法。',
}

export const previewChartResult: BaziChartResult = {
  dayMaster: null,
  pillars: {
    year: createPendingPillar('year', '年柱'),
    month: createPendingPillar('month', '月柱'),
    day: createPendingPillar('day', '日柱'),
    hour: createPendingPillar('hour', '时柱'),
  },
  fiveElements: {
    wood: null,
    fire: null,
    earth: null,
    metal: null,
    water: null,
  },
  professionPanel: {
    primaryStars: createPendingStars(['主星', '天元坐星', '日主强弱']),
    secondaryStars: createPendingStars(['副星', '地支十神', '纳音']),
    deityMarkers: createPendingStars(['神煞', '空亡', '特殊标记']),
  },
  highlights: [
    '四柱、藏干、十神、五行统计已完成领域类型定义，可直接作为算法输出接口。',
    '结果区域当前只消费结构化数据，不依赖组件内部拼装逻辑。',
    '主星 / 副星 / 纳音 / 空亡 等专业字段已预留展示位。',
  ],
  summary: {
    status: 'pending',
    title: '结构预览',
    message: '真实排盘算法尚未接入，当前页面用于验证模块边界、字段结构与结果布局。',
    completeness: [
      { label: '输入与规则建模', ready: true },
      { label: '四柱计算入口', ready: false },
      { label: '藏干与十神计算', ready: false },
      { label: '主星与副星展示', ready: true },
      { label: '五行统计', ready: false },
      { label: '历史记录存储', ready: false },
    ],
  },
}

export const historyRecords: PaipanHistoryRecord[] = [
  {
    id: 'history-a',
    title: '结构样例 A',
    tags: ['草稿', '公历输入'],
    status: 'draft',
    input: previewProfileA,
    config: DEFAULT_PAIPAN_RULE_CONFIG,
    resultSummary: previewChartResult.summary,
    createdAt: '2026-03-20 21:14',
    updatedAt: '2026-03-22 09:10',
  },
  {
    id: 'history-b',
    title: '结构样例 B',
    tags: ['未知时辰', '农历输入'],
    status: 'saved',
    input: previewProfileB,
    config: DEFAULT_PAIPAN_RULE_CONFIG,
    resultSummary: {
      status: 'partial',
      title: '待补计算',
      message: '已保留原始输入与规则配置，待后续四柱算法接入后生成快照。',
      completeness: [
        { label: '输入快照', ready: true },
        { label: '规则快照', ready: true },
        { label: '结果快照', ready: false },
      ],
    },
    createdAt: '2026-03-19 08:40',
    updatedAt: '2026-03-21 18:32',
  },
]
