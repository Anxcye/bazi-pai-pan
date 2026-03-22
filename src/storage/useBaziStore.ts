/**
 * 文件作用：管理当前录入结果与最近一次排盘缓存。
 * 系统位置：src/storage/useBaziStore.ts
 * 上游依赖：src/types/bazi, src/domain/bazi/createChartPreview
 * 下游影响：features/input, features/chart
 * 约束：只负责状态与持久化，不承担真实算法逻辑。
 * 备注：使用 Zustand persist 保存最近一次输入和占位盘结果。
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createChartPreview } from '../domain/bazi/createChartPreview'
import type { BaziChart, BirthInput } from '../types/bazi'

interface BaziState {
  latestInput: BirthInput | null
  latestChart: BaziChart | null
  submitInput: (input: BirthInput) => void
}

export const useBaziStore = create<BaziState>()(
  persist(
    (set) => ({
      latestInput: null,
      latestChart: null,
      submitInput: (input) =>
        set({
          latestInput: input,
          latestChart: createChartPreview(input),
        }),
    }),
    {
      name: 'bazi-pai-pan-store',
      partialize: (state) => ({
        latestInput: state.latestInput,
        latestChart: state.latestChart,
      }),
    },
  ),
)
