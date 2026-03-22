# Deployment

当前项目已经按“双环境”部署方式配置：
- `develop` 分支 -> 测试环境
- `main` 分支 -> 生产环境

## 推荐部署平台

推荐使用 Cloudflare Pages：
- 一个 Pages 项目即可同时承接 `main` 和 `develop`
- 生产域名可绑定到 `main`
- 测试域名可绑定到 `develop`
- GitHub Actions 已预留自动部署工作流

## 建议域名

- 生产：`example.com`
- 测试：`dev.example.com`

## GitHub Actions 已配置内容

- `.github/workflows/ci.yml`
  - push / PR 自动安装依赖、lint、build
- `.github/workflows/deploy.yml`
  - push 到 `develop` 自动构建测试环境并部署
  - push 到 `main` 自动构建生产环境并部署

## 分支策略

- 日常开发提交到 `develop`
- 验证没问题后合并到 `main`
- `develop` 永远对应测试站
- `main` 永远对应正式站

## 需要在 GitHub 仓库里补的配置

进入仓库 Settings -> Environments，新建两个环境：

### 1. development
Variables:
- `CLOUDFLARE_PAGES_PROJECT` = 你的 Pages 项目名
- `VITE_API_BASE_URL` = 测试环境接口地址
- `VITE_APP_DOMAIN` = 测试域名

Secrets:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

### 2. production
Variables:
- `CLOUDFLARE_PAGES_PROJECT` = 你的 Pages 项目名
- `VITE_API_BASE_URL` = 正式环境接口地址
- `VITE_APP_DOMAIN` = 正式域名

Secrets:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## Cloudflare Pages 侧需要做的事

1. 创建一个 Pages 项目
2. 绑定 GitHub 仓库
3. 绑定两个域名：
   - `example.com` -> production
   - `dev.example.com` -> develop
4. 确保 `main` 是 production branch
5. 确保 `develop` 可作为 preview / branch deployment 使用

## 本地环境文件

项目已预留：
- `.env.development`
- `.env.production`
- `.env.example`

说明：
- 本地开发可以直接读取 `.env.development`
- GitHub Actions 部署时会以环境变量覆盖

## 构建命令

- 开发构建：`pnpm build:dev`
- 生产构建：`pnpm build:prod`

## 建议后续补充

后面可以继续加：
- 自动运行测试
- 自动生成版本号
- 发布日志
- 回滚说明
