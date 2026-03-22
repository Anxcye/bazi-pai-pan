/**
 * 文件作用：定义八字排盘 v1 所需的核心领域模型。
 * 系统位置：domain/bazi/types.ts
 * 上游依赖：无
 * 下游影响：features/chart, domain/history, 后续 calendar/bazi 计算实现
 * 约束：类型应服务于真实算法接入，避免混入展示文案和组件状态。
 * 备注：当前允许结果字段为 null，用于“结构预览 / 待计算”阶段。
 */

export type HeavenlyStem =
  | '甲'
  | '乙'
  | '丙'
  | '丁'
  | '戊'
  | '己'
  | '庚'
  | '辛'
  | '壬'
  | '癸'

export type EarthlyBranch =
  | '子'
  | '丑'
  | '寅'
  | '卯'
  | '辰'
  | '巳'
  | '午'
  | '未'
  | '申'
  | '酉'
  | '戌'
  | '亥'

export type FiveElement = 'wood' | 'fire' | 'earth' | 'metal' | 'water'

export type TenGod =
  | '比肩'
  | '劫财'
  | '食神'
  | '伤官'
  | '偏财'
  | '正财'
  | '七杀'
  | '正官'
  | '偏印'
  | '正印'

export type PillarKey = 'year' | 'month' | 'day' | 'hour'

export type PillarStatus = 'pending' | 'known' | 'unknown'

export type PaipanResultStatus = 'idle' | 'pending' | 'partial' | 'complete'

export interface GanzhiPillar {
  stem: HeavenlyStem
  branch: EarthlyBranch
}

export interface HiddenStemEntry {
  stem: HeavenlyStem
  element: FiveElement
  position: number
  tenGodToDayMaster: TenGod | null
}

export interface AuxiliaryStar {
  name: string
  value: string | null
  status?: 'ready' | 'pending'
}

export interface PillarDetail {
  key: PillarKey
  label: string
  pillar: GanzhiPillar | null
  hiddenStems: HiddenStemEntry[]
  stemTenGod: TenGod | '日主' | null
  branchTenGod: TenGod | null
  mainStar: string | null
  subStars: string[]
  naYin: string | null
  emptyBranches: string[]
  status: PillarStatus
}

export interface ProfessionPanel {
  primaryStars: AuxiliaryStar[]
  secondaryStars: AuxiliaryStar[]
  deityMarkers: AuxiliaryStar[]
}

export interface LuckSequenceItem {
  label: string
  value: string
  meta?: string
}

export interface BranchRelationItem {
  label: string
  value: string
}

export type FourPillarMap = Record<PillarKey, PillarDetail>

export type FiveElementDistribution = Record<FiveElement, number | null>

export interface PaipanResultSummaryItem {
  label: string
  ready: boolean
}

export interface PaipanResultSummary {
  status: PaipanResultStatus
  title: string
  message: string
  completeness: PaipanResultSummaryItem[]
}

export interface BaziChartResult {
  dayMaster: HeavenlyStem | null
  pillars: FourPillarMap
  fiveElements: FiveElementDistribution
  professionPanel: ProfessionPanel
  dayun: LuckSequenceItem[]
  liunian: LuckSequenceItem[]
  liuyue: LuckSequenceItem[]
  liuri: LuckSequenceItem[]
  liushi: LuckSequenceItem[]
  relations: BranchRelationItem[]
  highlights: string[]
  summary: PaipanResultSummary
}
