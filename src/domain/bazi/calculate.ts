import { Lunar, Solar } from 'lunar-javascript'

import type {
  BaziChartResult,
  EarthlyBranch,
  HeavenlyStem,
  HiddenStemEntry,
  LuckSequenceItem,
  PillarDetail,
} from './types.ts'
import type { PaipanRuleConfig } from '../config/types.ts'
import type { BirthProfileDraft } from '../profile/types.ts'

const hiddenStemMap: Record<string, HeavenlyStem[]> = {
  子: ['癸'],
  丑: ['己', '癸', '辛'],
  寅: ['甲', '丙', '戊'],
  卯: ['乙'],
  辰: ['戊', '乙', '癸'],
  巳: ['丙', '戊', '庚'],
  午: ['丁', '己'],
  未: ['己', '丁', '乙'],
  申: ['庚', '壬', '戊'],
  酉: ['辛'],
  戌: ['戊', '辛', '丁'],
  亥: ['壬', '甲'],
}

const stemElementMap: Record<HeavenlyStem, 'wood' | 'fire' | 'earth' | 'metal' | 'water'> = {
  甲: 'wood',
  乙: 'wood',
  丙: 'fire',
  丁: 'fire',
  戊: 'earth',
  己: 'earth',
  庚: 'metal',
  辛: 'metal',
  壬: 'water',
  癸: 'water',
}

const clashPairs = new Set(['子午', '丑未', '寅申', '卯酉', '辰戌', '巳亥'])
const combinePairs = new Set(['子丑', '寅亥', '卯戌', '辰酉', '巳申', '午未'])
const harmPairs = new Set(['子未', '丑午', '寅巳', '卯辰', '申亥', '酉戌'])

function buildSolar(profile: BirthProfileDraft) {
  const [year, month, day] = profile.birthDate.split('-').map(Number)
  const time = profile.birthTime ?? '12:00'
  const [hour, minute] = time.split(':').map(Number)

  return Solar.fromYmdHms(year, month, day, hour, minute, 0)
}

function buildLunar(profile: BirthProfileDraft) {
  const [year, month, day] = profile.birthDate.split('-').map(Number)
  const time = profile.birthTime ?? '12:00'
  const [hour, minute] = time.split(':').map(Number)

  return Lunar.fromYmdHms(year, month, day, hour, minute, 0)
}

function getLunar(profile: BirthProfileDraft) {
  return profile.calendarType === 'solar' ? buildSolar(profile).getLunar() : buildLunar(profile)
}

function splitGanzhi(value: string) {
  return {
    stem: value.charAt(0) as HeavenlyStem,
    branch: value.charAt(1) as EarthlyBranch,
  }
}

function buildHiddenStems(branch: string): HiddenStemEntry[] {
  const stems = hiddenStemMap[branch] ?? []
  return stems.map((stem, index) => ({
    stem,
    element: stemElementMap[stem],
    position: index + 1,
    tenGodToDayMaster: null,
  }))
}

function buildPillar(key: PillarDetail['key'], label: string, value: string, stemTenGod: string | null): PillarDetail {
  const pillar = splitGanzhi(value)
  return {
    key,
    label,
    pillar,
    hiddenStems: buildHiddenStems(pillar.branch),
    stemTenGod: (stemTenGod as PillarDetail['stemTenGod']) ?? null,
    branchTenGod: null,
    mainStar: null,
    subStars: [],
    naYin: null,
    emptyBranches: [],
    status: 'known',
  }
}

function pairKey(a: string, b: string) {
  return [a, b].sort().join('')
}

function buildRelations(branches: string[]) {
  const clashes: string[] = []
  const combines: string[] = []
  const harms: string[] = []

  for (let i = 0; i < branches.length; i += 1) {
    for (let j = i + 1; j < branches.length; j += 1) {
      const key = pairKey(branches[i], branches[j])
      if (clashPairs.has(key)) clashes.push(`${branches[i]}-${branches[j]}`)
      if (combinePairs.has(key)) combines.push(`${branches[i]}-${branches[j]}`)
      if (harmPairs.has(key)) harms.push(`${branches[i]}-${branches[j]}`)
    }
  }

  return [
    { label: '天干关系', value: '继续补' },
    { label: '地支关系', value: branches.join(' / ') },
    { label: '相冲', value: clashes.length ? clashes.join('，') : '无' },
    { label: '相刑', value: '继续补' },
    { label: '相合', value: combines.length ? combines.join('，') : '无' },
    { label: '相害', value: harms.length ? harms.join('，') : '无' },
    { label: '相破', value: '继续补' },
  ]
}

function toLuckItems(items: Array<{ label: string; value: string; meta?: string }>): LuckSequenceItem[] {
  return items
}

export function calculateBaziChart(profile: BirthProfileDraft, _config: PaipanRuleConfig): BaziChartResult {
  const lunar = getLunar(profile)
  const ec = lunar.getEightChar()

  const year = buildPillar('year', '年柱', ec.getYear(), ec.getYearShiShenGan?.() ?? null)
  const month = buildPillar('month', '月柱', ec.getMonth(), ec.getMonthShiShenGan?.() ?? null)
  const day = buildPillar('day', '日柱', ec.getDay(), ec.getDayShiShenGan?.() ?? '日主')
  const hour = buildPillar('hour', '时柱', ec.getTime(), ec.getTimeShiShenGan?.() ?? null)

  if (!profile.birthTime) {
    hour.status = 'unknown'
  }

  const yun = ec.getYun?.(profile.gender === 'male' ? 1 : 0)
  const daYun = yun?.getDaYun?.(8) ?? []
  const dayun = toLuckItems(
    daYun.slice(1).map((item: { getGanZhi(): string; getStartAge(): number }) => ({
      label: `大运`,
      value: item.getGanZhi(),
      meta: `${item.getStartAge()}岁`,
    })),
  )

  const firstDaYun = daYun[1]
  const liuNian = firstDaYun?.getLiuNian?.(6) ?? []
  const liunian = toLuckItems(
    liuNian.map((item: { getYear(): number; getGanZhi(): string }) => ({
      label: String(item.getYear()),
      value: item.getGanZhi(),
    })),
  )

  const currentMonth = lunar.getMonthInGanZhi?.() ?? '—'
  const currentDay = lunar.getDayInGanZhi?.() ?? '—'
  const currentTime = lunar.getTimeInGanZhi?.() ?? '—'

  const liuyue = toLuckItems([{ label: '当前流月', value: currentMonth }])
  const liuri = toLuckItems([{ label: '当前流日', value: currentDay }])
  const liushi = toLuckItems([{ label: '当前流时', value: currentTime }])

  const relations = buildRelations([
    year.pillar?.branch ?? '',
    month.pillar?.branch ?? '',
    day.pillar?.branch ?? '',
    hour.pillar?.branch ?? '',
  ])

  return {
    dayMaster: day.pillar?.stem ?? null,
    pillars: { year, month, day, hour },
    fiveElements: {
      wood: null,
      fire: null,
      earth: null,
      metal: null,
      water: null,
    },
    professionPanel: {
      primaryStars: [],
      secondaryStars: [],
      deityMarkers: [],
    },
    dayun,
    liunian,
    liuyue,
    liuri,
    liushi,
    relations,
    highlights: [
      '已接入第一版真实四柱计算入口。',
      '当前基于 lunar-javascript 生成年柱、月柱、日柱、时柱、基础大运和首组流年。',
    ],
    summary: {
      status: 'partial',
      title: '已生成四柱与基础流运',
      message: '四柱、藏干、基础大运与首组流年已接入；更完整的流月、流日、流时与关系规则继续补。',
      completeness: [
        { label: '四柱计算', ready: true },
        { label: '天干十神', ready: true },
        { label: '藏干', ready: true },
        { label: '大运', ready: dayun.length > 0 },
        { label: '流年', ready: liunian.length > 0 },
        { label: '干支关系', ready: true },
      ],
    },
  }
}
