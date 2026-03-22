import dayjs from 'dayjs'
import { Lunar, Solar } from 'lunar-javascript'

import type {
  BaziChartResult,
  DaYunNode,
  EarthlyBranch,
  HeavenlyStem,
  HiddenStemEntry,
  LuckSequenceItem,
  PillarDetail,
  TenGod,
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
  甲: 'wood',乙: 'wood',丙: 'fire',丁: 'fire',戊: 'earth',己: 'earth',庚: 'metal',辛: 'metal',壬: 'water',癸: 'water',
}
const clashPairs = new Set(['子午', '丑未', '寅申', '卯酉', '辰戌', '巳亥'])
const combinePairs = new Set(['子丑', '寅亥', '卯戌', '辰酉', '巳申', '午未'])
const harmPairs = new Set(['子未', '丑午', '寅巳', '卯辰', '申亥', '酉戌'])
const breakPairs = new Set(['子酉', '卯午', '辰丑', '未戌', '寅亥', '巳申'])

function buildSolar(profile: BirthProfileDraft) {
  const [year, month, day] = profile.birthDate.split('-').map(Number)
  const [hour, minute] = (profile.birthTime ?? '12:00').split(':').map(Number)
  return Solar.fromYmdHms(year, month, day, hour, minute, 0)
}
function buildLunar(profile: BirthProfileDraft) {
  const [year, month, day] = profile.birthDate.split('-').map(Number)
  const [hour, minute] = (profile.birthTime ?? '12:00').split(':').map(Number)
  return Lunar.fromYmdHms(year, month, day, hour, minute, 0)
}
function getLunar(profile: BirthProfileDraft) {
  return profile.calendarType === 'solar' ? buildSolar(profile).getLunar() : buildLunar(profile)
}
function splitGanzhi(value: string) {
  return { stem: value.charAt(0) as HeavenlyStem, branch: value.charAt(1) as EarthlyBranch }
}
function buildHiddenStems(branch: string): HiddenStemEntry[] {
  const stems = hiddenStemMap[branch] ?? []
  return stems.map((stem, index) => ({ stem, element: stemElementMap[stem], position: index + 1, tenGodToDayMaster: null }))
}
function toTenGodList(value: string[] | undefined): string[] { return (value ?? []).filter(Boolean) }
function buildPillar(key: PillarDetail['key'], label: string, value: string, stemTenGod: string | null, branchTenGods: string[] | undefined, naYin: string | undefined, xunKong: string | undefined, diShi: string | undefined): PillarDetail {
  const pillar = splitGanzhi(value)
  const gods = toTenGodList(branchTenGods)
  return {
    key, label, pillar,
    hiddenStems: buildHiddenStems(pillar.branch),
    stemTenGod: (stemTenGod as PillarDetail['stemTenGod']) ?? null,
    branchTenGod: (gods[0] as TenGod | undefined) ?? null,
    mainStar: diShi ?? null,
    subStars: gods.slice(1),
    naYin: naYin ?? null,
    emptyBranches: xunKong ? xunKong.split('') : [],
    status: 'known',
  }
}
function pairKey(a: string, b: string) { return [a, b].sort().join('') }
function buildRelations(branches: string[]) {
  const valid = branches.filter(Boolean)
  const clashes: string[] = []; const combines: string[] = []; const harms: string[] = []; const breaks: string[] = []
  for (let i = 0; i < valid.length; i += 1) for (let j = i + 1; j < valid.length; j += 1) {
    const key = pairKey(valid[i], valid[j])
    if (clashPairs.has(key)) clashes.push(`${valid[i]}-${valid[j]}`)
    if (combinePairs.has(key)) combines.push(`${valid[i]}-${valid[j]}`)
    if (harmPairs.has(key)) harms.push(`${valid[i]}-${valid[j]}`)
    if (breakPairs.has(key)) breaks.push(`${valid[i]}-${valid[j]}`)
  }
  return [
    { label: '天干关系', value: '继续补' },
    { label: '地支关系', value: valid.join(' / ') || '—' },
    { label: '相冲', value: clashes.length ? clashes.join('，') : '无' },
    { label: '相刑', value: '继续补' },
    { label: '相合', value: combines.length ? combines.join('，') : '无' },
    { label: '相害', value: harms.length ? harms.join('，') : '无' },
    { label: '相破', value: breaks.length ? breaks.join('，') : '无' },
  ]
}
function toLuckItems(items: Array<{ label: string; value: string; meta?: string }>): LuckSequenceItem[] { return items }
function buildLiuYueFromYear(year: number) {
  return Array.from({ length: 12 }).map((_, index) => {
    const month = index + 1
    const solar = Solar.fromYmd(year, month, 1)
    return { label: `${month}月`, value: solar.getLunar().getMonthInGanZhi() }
  })
}
function buildDayunTree(daYun: Array<{ getGanZhi(): string; getStartAge(): number; getLiuNian(n:number): Array<{getYear(): number; getGanZhi(): string}> }>): DaYunNode[] {
  return daYun.slice(1).map((item) => ({
    label: '大运',
    value: item.getGanZhi(),
    meta: `${item.getStartAge()}岁`,
    liunian: item.getLiuNian(10).map((yearItem) => ({
      label: String(yearItem.getYear()),
      value: yearItem.getGanZhi(),
      liuyue: buildLiuYueFromYear(yearItem.getYear()),
    })),
  }))
}
function buildCurrentDaySequence(baseDate: string) {
  const start = dayjs(baseDate)
  return toLuckItems(Array.from({ length: 6 }).map((_, index) => {
    const current = start.add(index, 'day')
    const solar = Solar.fromYmd(current.year(), current.month() + 1, current.date())
    return { label: current.format('MM-DD'), value: solar.getLunar().getDayInGanZhi() }
  }))
}
function buildCurrentTimeSequence(baseDate: string, baseTime: string | null) {
  const [hour, minute] = (baseTime ?? '12:00').split(':').map(Number)
  const start = dayjs(`${baseDate} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`)
  return toLuckItems(Array.from({ length: 6 }).map((_, index) => {
    const current = start.add(index * 2, 'hour')
    const solar = Solar.fromYmdHms(current.year(), current.month() + 1, current.date(), current.hour(), current.minute(), 0)
    return { label: current.format('HH:mm'), value: solar.getLunar().getTimeInGanZhi() }
  }))
}

export function calculateBaziChart(profile: BirthProfileDraft, _config: PaipanRuleConfig): BaziChartResult {
  const lunar = getLunar(profile)
  const ec = lunar.getEightChar()
  const year = buildPillar('year', '年柱', ec.getYear(), ec.getYearShiShenGan?.() ?? null, ec.getYearShiShenZhi?.(), ec.getYearNaYin?.(), ec.getYearXunKong?.(), ec.getYearDiShi?.())
  const month = buildPillar('month', '月柱', ec.getMonth(), ec.getMonthShiShenGan?.() ?? null, ec.getMonthShiShenZhi?.(), ec.getMonthNaYin?.(), ec.getMonthXunKong?.(), ec.getMonthDiShi?.())
  const day = buildPillar('day', '日柱', ec.getDay(), ec.getDayShiShenGan?.() ?? '日主', ec.getDayShiShenZhi?.(), ec.getDayNaYin?.(), ec.getDayXunKong?.(), ec.getDayDiShi?.())
  const hour = buildPillar('hour', '时柱', ec.getTime(), ec.getTimeShiShenGan?.() ?? null, ec.getTimeShiShenZhi?.(), ec.getTimeNaYin?.(), ec.getTimeXunKong?.(), ec.getTimeDiShi?.())
  if (!profile.birthTime) hour.status = 'unknown'

  const yun = ec.getYun?.(profile.gender === 'male' ? 1 : 0)
  const daYun = yun?.getDaYun?.(8) ?? []
  const dayunTree = buildDayunTree(daYun)
  const activeDayun = dayunTree[0]
  const activeLiuNian = activeDayun?.liunian?.[0]

  return {
    dayMaster: day.pillar?.stem ?? null,
    pillars: { year, month, day, hour },
    fiveElements: { wood: null, fire: null, earth: null, metal: null, water: null },
    professionPanel: {
      primaryStars: [
        { name: '胎元', value: ec.getTaiYuan?.() ?? null, status: 'ready' },
        { name: '命宫', value: ec.getMingGong?.() ?? null, status: 'ready' },
        { name: '身宫', value: ec.getShenGong?.() ?? null, status: 'ready' },
      ],
      secondaryStars: [],
      deityMarkers: [],
    },
    dayun: dayunTree,
    liunian: activeDayun?.liunian ?? [],
    liuyue: activeLiuNian?.liuyue ?? [],
    liuri: buildCurrentDaySequence(profile.birthDate),
    liushi: buildCurrentTimeSequence(profile.birthDate, profile.birthTime),
    relations: buildRelations([year.pillar?.branch ?? '', month.pillar?.branch ?? '', day.pillar?.branch ?? '', hour.pillar?.branch ?? '']),
    highlights: [
      '已接入第一版真实四柱计算入口。',
      '当前已接入级联式大运 → 流年 → 流月数据骨架。',
    ],
    summary: {
      status: 'partial',
      title: '已生成四柱与级联流运',
      message: '四柱、纳音、空亡、基础大运、流年、流月已接入；下一步继续补真正交互联动与更完整规则。',
      completeness: [
        { label: '四柱计算', ready: true },
        { label: '地支十神', ready: true },
        { label: '纳音 / 空亡', ready: true },
        { label: '大运', ready: dayunTree.length > 0 },
        { label: '流年', ready: (activeDayun?.liunian?.length ?? 0) > 0 },
        { label: '流月', ready: (activeLiuNian?.liuyue?.length ?? 0) > 0 },
      ],
    },
  }
}
