# bazi-pai-pan

一个以前端计算为核心的八字排盘项目。

## 当前目标

先做一个可持续 vibecoding 的项目骨架，优先保证三件事：
- 核心算法边界清楚
- 文档能让后续会话快速续上上下文
- 模块职责明确，方便逐步加功能

## 技术栈

- Vite
- React
- TypeScript
- pnpm
- Zustand
- React Hook Form + Zod
- Tailwind CSS
- dayjs
- lunar-javascript

## 环境与部署

- `develop` 分支：测试环境
- `main` 分支：生产环境
- GitHub Actions：自动构建与部署
- 部署说明见 `docs/DEPLOYMENT.md`

## 建议范围

### MVP
- 出生信息录入：日期、时间、性别、历法类型、时区/出生地
- 八字四柱计算：年柱、月柱、日柱、时柱
- 基础衍生信息：五行统计、十神、藏干
- 基础大运展示
- 本地保存用户资料与历史排盘记录

### 后续增强
- 农历精细支持
- 节气/边界处理完善
- 真太阳时
- 流年/流月/流日/流时
- 神煞、纳音、更多解释层
- 云同步 / 多端同步

## 文档约定

- `AGENTS.md`：给人和 agent 看，说明协作方式、目录语义、文件头约定
- `docs/ARCHITECTURE.md`：系统结构、模块关系、数据流
- `docs/ROADMAP.md`：MVP 与增强阶段拆分
- `docs/PAIPAN_SPEC.md`：排盘规则规格书
- `docs/DEPLOYMENT.md`：部署与双环境说明

## 开发命令

- `pnpm dev`
- `pnpm build`
- `pnpm build:dev`
- `pnpm build:prod`

## 下一步建议

1. 先搭页面骨架与路由
2. 再做出生信息录入
3. 再接排盘算法入口
4. 然后打通历史记录和部署链路
