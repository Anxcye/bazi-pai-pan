# Architecture

## 1. 目标

这是一个“前端本地可运行”的八字排盘系统。

设计原则：
- 计算优先在前端完成
- 核心逻辑尽量纯函数化
- 排盘规则配置化，而不是散落在组件中
- 历法处理、命理计算、UI 展示分层明确
- 先保证结果一致性，再做体验增强

## 2. 当前产品范围

### 需要支持
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

### 明确不做
- 时区输入
- 文案解释
- 合婚

### 规则策略
- 默认采用主流排盘产品常见方案
- 对争议较大的规则提供配置能力
- 不把流派差异硬编码在 UI 层

## 3. 系统分层

### UI 层
负责：
- 出生信息表单
- 本命盘结果展示
- 流运结果展示
- 配置项切换
- 历史记录（如接入）

### Application / Feature 层
负责：
- 用户交互流程
- 表单到领域输入模型的映射
- 组织排盘调用与配置切换
- 组织历史记录读写

### Domain 层
负责：
- 八字领域模型
- 历法换算
- 四柱计算
- 衍生信息计算
- 大运 / 流年 / 流月 / 流日 / 流时计算
- 规则配置解释与应用

### Storage 层
负责：
- 本地资料保存
- 历史排盘快照
- 最近使用记录
- 用户配置持久化

## 4. 建议核心模块

### domain/profile
输入模型建议包含：
- name
- gender
- calendarType
- birthDate
- birthTime
- isLeapMonth（农历输入时使用）
- note

### domain/config
规则配置建议集中管理：
- dayBoundaryRule
- yearBoundaryRule
- monthBoundaryRule
- trueSolarTimeMode
- display options

### domain/calendar
职责：
- 日期标准化
- 公历 / 农历转换
- 节气判断
- 干支基础换算
- 日界、月界、年界基础能力

### domain/bazi
职责：
- 四柱计算
- 藏干
- 十神
- 五行统计
- 大运
- 流年 / 流月 / 流日 / 流时

### storage
职责：
- profile 保存
- chart snapshot 保存
- 配置保存
- 历史记录索引

## 5. 数据流

用户输入出生信息
-> 标准化输入参数
-> 应用默认规则与用户配置
-> calendar 层完成历法/节气/边界处理
-> bazi 层生成本命盘与流运结果
-> UI 展示结果
-> storage 保存资料、配置与快照

## 6. 数据结构建议

### BirthProfile

```ts
interface BirthProfile {
  id: string
  name?: string
  gender?: 'male' | 'female'
  calendarType: 'solar' | 'lunar'
  birthDate: string
  birthTime?: string | null
  isLeapMonth?: boolean
  note?: string
  createdAt: string
  updatedAt: string
}
```

### PaipanRuleConfig

```ts
interface PaipanRuleConfig {
  yearBoundaryRule: 'lichun'
  monthBoundaryRule: 'jieqi'
  dayBoundaryRule: 'midnight' | 'zi-hour' | 'split-zi-hour'
  trueSolarTimeEnabled: boolean
}
```

### BaziChartSnapshot

```ts
interface BaziChartSnapshot {
  id: string
  profileId?: string
  input: BirthProfile
  config: PaipanRuleConfig
  natalChart: {
    pillars: {
      year?: string
      month?: string
      day?: string
      hour?: string
    }
    hiddenStems?: Record<string, string[]>
    tenGods?: Record<string, string>
    fiveElements?: Record<string, number>
  }
  luck?: {
    dayun?: Array<{ startAge: number; pillar: string }>
    liunian?: Array<{ year: number; pillar: string }>
    liuyue?: Array<{ key: string; pillar: string }>
    liuri?: Array<{ date: string; pillar: string }>
    liushi?: Array<{ time: string; pillar: string }>
  }
  version: string
  createdAt: string
}
```

## 7. 风险点

- 月柱必须按节气处理，不能直接拿农历月份代替
- 年柱按立春切换是主流，但仍需文档化
- 子时换日规则存在分歧，必须配置化
- 农历闰月输入必须明确建模
- 流日 / 流时依赖日期边界口径，测试覆盖要充分
- 真太阳时即使默认关闭，也要在模型层预留能力

## 8. 当前实现顺序建议

1. 定义 types 与规则配置模型
2. 建立 calendar 基础能力
3. 实现四柱计算入口
4. 实现大运与流运基础模型
5. 接入输入页与结果页
6. 最后接 storage、历史记录与偏好设置
