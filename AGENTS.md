# AGENTS.md

本文件给后续参与项目的人类开发者与 agent 使用。

目标：让多轮 vibecoding 不会失忆，不会把模块写乱。

## 协作原则

- 先读文档，再改代码
- 优先小步提交，避免一次性大改
- 核心算法优先写成纯函数，减少 UI 耦合
- 边界条件要写明，不要把“民俗解释”和“计算逻辑”混在一起
- 新增模块前，先补文件头说明

## 推荐目录

```text
bazi-pai-pan/
├─ README.md
├─ AGENTS.md
├─ docs/
│  ├─ ARCHITECTURE.md
│  └─ ROADMAP.md
├─ src/
│  ├─ app/                 # 页面、路由、应用装配
│  ├─ components/          # 通用 UI 组件
│  ├─ features/
│  │  ├─ input/            # 出生信息输入
│  │  ├─ chart/            # 排盘结果展示
│  │  └─ history/          # 保存记录/历史列表
│  ├─ domain/
│  │  ├─ bazi/             # 八字核心模型与计算入口
│  │  ├─ calendar/         # 公历/农历/节气/干支基础能力
│  │  └─ profile/          # 用户资料模型
│  ├─ storage/             # localStorage / IndexedDB 封装
│  ├─ utils/               # 通用工具
│  └─ types/               # 公共类型
└─ tests/
```

## 文件头约定

以后新增重要文件时，文件顶部建议先写这一段注释。

### TypeScript / JavaScript 示例

```ts
/**
 * 文件作用：负责根据出生信息计算四柱结果。
 * 系统位置：domain/bazi/calculateFourPillars.ts
 * 上游依赖：domain/calendar, types/profile
 * 下游影响：features/chart, storage/chartSnapshot
 * 约束：保持纯函数；不要直接依赖 UI、网络、存储。
 * 备注：月柱按节气切换，不按农历月份直接推断。
 */
```

### Vue / React 组件示例

```ts
/**
 * 文件作用：出生信息录入表单。
 * 系统位置：features/input/BirthInfoForm.tsx
 * 上游依赖：types/profile, form schema
 * 下游影响：排盘入口、资料保存
 * 约束：组件只处理交互，不承载排盘算法。
 */
```

## 必须说明的 6 个点

每个核心文件头部尽量写清楚：
- 文件作用
- 系统位置
- 上游依赖
- 下游影响
- 约束/边界
- 备注

这 6 个点比“随手写代码”更重要，因为后面会多轮续写。

## 模块边界

### 1. calendar
只处理时间历法相关能力：
- 公历 / 农历转换
- 节气
- 干支基础换算
- 时区 / 日期边界

### 2. bazi
只处理命理计算：
- 四柱
- 十神
- 藏干
- 五行统计
- 大运 / 流年（按阶段加入）

### 3. features
只负责页面功能组织，不要把算法塞进组件。

### 4. storage
只负责保存与读取，不负责计算正确性。

## 分支与环境约定

- `develop` 分支用于日常开发与测试环境验证
- `main` 分支用于生产环境发布
- 非明确要求下，功能开发、联调、试验性改动默认在 `develop` 进行
- 只有准备发布生产时，才从 `develop` 合并到 `main`

## 开发顺序建议

1. 先定 types
2. 再做 calendar 基础
3. 再做 bazi 计算入口
4. 再接输入页与结果页
5. 最后接 storage 和历史记录

## Agent 工作方式

当 agent 接手任务时：
- 先读 README.md、AGENTS.md、docs/ARCHITECTURE.md
- 改动前先确认自己改的是哪一层
- 如果新增文件，补文件头
- 如果调整模块边界，同步更新文档
- 如果发现计算口径变化，必须写到 docs/ARCHITECTURE.md
