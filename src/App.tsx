function App() {
  return (
    <main className="min-h-screen bg-white px-6 py-16 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="space-y-3">
          <span className="inline-flex w-fit rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
            占位说明
          </span>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">bazi-pai-pan</h1>
          <p className="text-base leading-7 text-slate-600 dark:text-slate-300">
            这个项目的旧实现已移除，目前只保留一个最小占位页，准备从零重新设计和实现。
          </p>
        </div>

        <section className="space-y-3 rounded-2xl border border-dashed border-slate-300 p-5 dark:border-slate-700">
          <h2 className="text-lg font-medium">当前状态</h2>
          <ul className="list-disc space-y-2 pl-5 text-slate-700 dark:text-slate-300">
            <li>UI、状态管理、排盘预览等旧代码已清空</li>
            <li>应用入口保留，方便后续继续迭代</li>
            <li>现在适合作为全新架构和功能的起点</li>
          </ul>
        </section>

        <section className="space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
          <p>接下来你可以直接从以下任一方向开工：</p>
          <ol className="list-decimal space-y-2 pl-5">
            <li>先定义排盘领域模型和规则边界</li>
            <li>先搭新的页面结构和交互流程</li>
            <li>先实现最小可用的四柱计算入口</li>
          </ol>
        </section>
      </div>
    </main>
  )
}

export default App
