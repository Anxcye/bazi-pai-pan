import { Lunar, Solar } from 'lunar-javascript'

import type {
  BaziChartResult,
  EarthlyBranch,
  HeavenlyStem,
  HiddenStemEntry,
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

function getEightChar(profile: BirthProfileDraft) {
  const lunar = profile.calendarType === 'solar' ? buildSolar(profile).getLunar() : buildLunar(profile)
  return lunar.getEightChar()
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

export function calculateBaziChart(profile: BirthProfileDraft, _config: PaipanRuleConfig): BaziChartResult {
  const ec = getEightChar(profile)

  const year = buildPillar('year', '年柱', ec.getYear(), ec.getYearShiShenGan?.() ?? null)
  const month = buildPillar('month', '月柱', ec.getMonth(), ec.getMonthShiShenGan?.() ?? null)
  const day = buildPillar('day', '日柱', ec.getDay(), ec.getDayShiShenGan?.() ?? '日主')
  const hour = buildPillar('hour', '时柱', ec.getTime(), ec.getTimeShiShenGan?.() ?? null)

  if (!profile.birthTime) {
    hour.status = 'unknown'
  }

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
    highlights: [
      '已接入第一版真实四柱计算入口。',
      '当前基于 lunar-javascript 生成年柱、月柱、日柱、时柱与天干十神。',
    ],
    summary: {
      status: 'partial',
      title: '已生成四柱',
      message: '四柱基础结果已接入，流运、关系、纳音、空亡等专业字段继续补。',
      completeness: [
        { label: '四柱计算', ready: true },
        { label: '天干十神', ready: true },
        { label: '藏干', ready: true },
        { label: '流运', ready: false },
        { label: '干支关系', ready: false },
      ],
    },
  }
}
