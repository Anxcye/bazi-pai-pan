# bazi-pai-pan

一个以前端本地计算为核心的八字排盘项目。

## 当前目标

从零实现一个可持续迭代的排盘工具，优先保证三件事：
- 排盘规则明确，可测试、可追溯
- 文档完整，便于后续持续开发
- 模块边界清楚，方便逐步增强

## 当前范围（v1 方向）

### 已明确需要
- 公历输入
- 农历输入（含闰月）
- 四柱排盘
- 藏干
- 十神
- 五行统计
- 大运
- 流年
- 流月
- 流日
- 流时
- 规则可配置（如换日口径等）

### 已明确不需要
- 时区输入
- 文案解释
- 合婚

### 默认实现策略
- 以前端本地计算为主
- 默认采用主流排盘软件常见口径
- 争议规则做成可配置项，而不是写死
- 农历仅作为输入方式之一，内部统一走标准化流程后计算

## 技术栈

- Vite
- React
- TypeScript
- pnpm
- Tailwind CSS
- Zustand（如需要本地状态管理）
- React Hook Form + Zod（如需要表单约束）
- dayjs
- lunar-javascript（可作为参考或过渡方案）

## 环境与部署

- `develop` 分支：测试环境
- `main` 分支：生产环境
- GitHub Actions：自动构建与部署
- 部署说明见 `docs/DEPLOYMENT.md`

## 文档约定

- `AGENTS.md`：协作方式、目录语义、文件头约定
- `docs/ARCHITECTURE.md`：系统结构、模块关系、数据流
- `docs/ROADMAP.md`：阶段拆分
- `docs/PAIPAN_SPEC.md`：排盘规则规格书
- `docs/DEPLOYMENT.md`：部署与双环境说明

## 开发命令

- `pnpm dev`
- `pnpm build`
- `pnpm build:dev`
- `pnpm build:prod`

## 下一步建议

1. 根据规格书重建目录结构
2. 先定义输入/输出模型与规则配置模型
3. 实现 calendar 基础能力（公历、农历、节气、干支基础）
4. 实现四柱与流运计算入口
5. 最后接 UI 与本地保存
