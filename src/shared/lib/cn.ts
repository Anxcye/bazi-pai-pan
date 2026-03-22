/**
 * 文件作用：合并条件 className，便于共享 UI 组件复用 Tailwind 类名。
 * 系统位置：shared/lib/cn.ts
 * 上游依赖：clsx, tailwind-merge
 * 下游影响：shared/ui 以及后续所有前端组件
 * 约束：仅做样式字符串处理，不混入业务逻辑。
 * 备注：保持与常见 React + Tailwind 项目约定一致。
 */

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
