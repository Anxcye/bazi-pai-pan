import { DEFAULT_PAIPAN_RULE_CONFIG } from '../domain/config/defaults.ts'
import { calculateBaziChart } from '../domain/bazi/calculate.ts'
import { toBirthProfileDraft, type BirthInfoFormValues } from '../features/input/model.ts'

export function createLiveChart(values: BirthInfoFormValues) {
  const profile = toBirthProfileDraft(values)
  return calculateBaziChart(profile, DEFAULT_PAIPAN_RULE_CONFIG)
}
