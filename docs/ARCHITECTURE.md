# Architecture

## 1. 目标

这是一个“前端本地可运行”的八字排盘系统。

设计原则：
- 计算优先在前端完成
- 核心逻辑尽量纯函数化
- 存储与算法分离
- 展示层与命理计算分离

## 2. 系统分层

### UI 层
负责：
- 出生信息表单
- 结果展示
- 历史记录
- 编辑 / 删除 / 重算

### Application / Feature 层
负责：
- 用户交互流程
- 表单到领域模型的映射
- 组织排盘调用与存储调用

### Domain 层
负责：
- 八字模型
- 排盘计算
- 历法换算
- 规则与边界

### Storage 层
负责：
- profile 保存
- chart snapshot 保存
- 历史记录索引

## 3. 建议核心模块

### domain/profile
输入模型：
- name
- gender
- calendarType
- birthDate
- birthTime
- timezone
- birthPlace
- useTrueSolarTime

### domain/calendar
职责：
- 日期标准化
- 时区处理
- 节气判断
- 干支换算基础
- 农历能力预留

### domain/bazi
职责：
- 四柱计算
- 藏干
- 十神
- 五行统计
- 大运（MVP 可先做基础版）

### storage
职责：
- 本地资料保存
- 历史排盘快照
- 最近使用记录

## 4. 数据流

用户输入出生信息
-> 标准化输入参数
-> calendar 层完成时间/节气/边界处理
-> bazi 层生成排盘结果
-> UI 展示结果
-> storage 保存资料与结果快照

## 5. 数据结构建议

### BirthProfile

```ts
interface BirthProfile {
  id: string
  name?: string
  gender?: 'male' | 'female' | 'other'
  calendarType: 'solar' | 'lunar'
  birthDate: string
  birthTime?: string
  timezone: string
  birthPlace?: string
  useTrueSolarTime?: boolean
  createdAt: string
  updatedAt: string
}
```

### BaziChartSnapshot

```ts
interface BaziChartSnapshot {
  id: string
  profileId?: string
  input: BirthProfile
  pillars: {
    year: string
    month: string
    day: string
    hour: string
  }
  hiddenStems?: Record<string, string[]>
  tenGods?: Record<string, string>
  fiveElements?: Record<string, number>
  luckCycles?: Array<{
    startAge: number
    pillar: string
  }>
  version: string
  createdAt: string
}
```

## 6. 风险点

- 月柱应按节气切换，不是简单按农历月份
- 子时跨日口径要统一
- 时区和出生地会影响边界结果
- 真太阳时不要在 MVP 默认启用
- 民间不同流派口径可能不同，要预留规则说明

## 7. MVP 建议

先做：
- 公历输入
- 时区支持
- 四柱
- 五行统计
- 十神
- 本地保存

后做：
- 农历输入
- 真太阳时
- 大运流年增强
- 文案解释系统
