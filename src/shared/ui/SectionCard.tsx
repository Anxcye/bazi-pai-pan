/**
 * 文件作用：提供页面模块通用卡片容器。
 * 系统位置：shared/ui/SectionCard.tsx
 * 上游依赖：shared/lib/cn
 * 下游影响：features/input, features/config, features/chart, features/history
 * 约束：只负责布局和视觉框架，不承担业务状态。
 * 备注：统一卡片样式后，后续替换设计语言成本更低。
 */

import type { ReactNode } from 'react'

import { cn } from '../lib/cn.ts'

interface SectionCardProps {
  eyebrow?: string
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  className?: string
}

export function SectionCard({
  eyebrow,
  title,
  description,
  children,
  footer,
  className,
}: SectionCardProps) {
  return (
    <section
      className={cn(
        'rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-[0_24px_70px_-40px_rgba(68,53,35,0.55)] backdrop-blur-sm',
        'dark:border-white/10 dark:bg-stone-950/75',
        className,
      )}
    >
      <header className="space-y-2">
        {eyebrow ? (
          <span className="inline-flex w-fit rounded-full border border-amber-300/70 bg-amber-50 px-3 py-1 text-xs font-medium tracking-[0.18em] text-amber-800 uppercase dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
            {eyebrow}
          </span>
        ) : null}
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight text-stone-950 dark:text-stone-50">
            {title}
          </h2>
          {description ? (
            <p className="max-w-2xl text-sm leading-6 text-stone-600 dark:text-stone-300">
              {description}
            </p>
          ) : null}
        </div>
      </header>

      <div className="mt-6">{children}</div>

      {footer ? <div className="mt-6 border-t border-stone-200/80 pt-4 dark:border-white/10">{footer}</div> : null}
    </section>
  )
}
