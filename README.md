# 从零理解黎曼猜想 — 交互课程原型（MVP v0.1）

**目标**：让数学基础薄弱的学习者在不背结论的情况下，通过逐步操作理解函数、无穷级数、复数，以及最终的黎曼猜想。

## 立即运行

直接双击 `index.html`，或使用任意静态 Web 服务器：

```bash
cd riemann-from-zero
python3 -m http.server 8000
# 浏览器访问 http://localhost:8000
```

运行课程无需安装 npm、无需后端。手机端自适应布局；浏览器可保存本机学习进度。Google Fonts 不能加载时自动使用本地字体。npm 依赖只用于开发验收。

## 已实现（4 个可以独立完成的互动课程）

1. **函数机器**：修改输入，实时观察 `f(x)=2x+1` 的输出；理解函数名与输入变量的区别。
2. **ζ(2) 无穷级数**：调整求和项数 1–200，观察部分和、极限、收敛图形；明确有限项 ≠ 无穷和。
3. **乘以 i 的旋转**：点击乘以 `i`，让复平面箭头每次旋转 90°；看到 `1 → i → −1 → −i → 1`。
4. **复数坐标**：分别调整 `a` 和 `b`，看 `a+bi` 在复平面上的位置。

每节课程有知识说明、交互实验、理解检测和进度记录。没有证明的数学论断不会被讲成已证明事实。

## 课程设计原则

- 具体例子 → 观察变化 → 发现规律 → 推导公式 → 练习验证。
- 新公式必须解释由来和适用范围；不因“为了简单”而引入数学不准确的说法。
- `ζ` 是函数名，`s` 是输入变量，不用 `S` 代替 `ζ`。
- 面向零基础学习者，用「一次一个问题」的方式教学。
- 清楚区分 **已证明的事实、数值近似、直观比喻、尚未解决的猜想**。

## 数学说明

- 当前 `ζ(2)` 互动使用的原始 Dirichlet 级数只用于 `s=2`，这里收敛。
- `ζ(2)=π²/6≈1.6449340668482264` 用作参考极限。
- **还没有实现** 通用复数 ζ 计算、解析延拓或实际非平凡零点搜索。未来应采用数值稳定的方法，并验证误差，而不是把截断级数的接近零冒充真实零点。

## 文件结构

- `index.html` — 入口
- `styles.css` — 完整响应式视觉设计
- `app.js` — 课程路由、实验、答题及本机进度
- `CODEX_NEXT.md` — 下一阶段 Codex 可执行任务书

## 当前限制

- 这是浏览器单机原型，不含账户登录、云同步、后台编辑和课程发布系统。
- `localStorage` 进度只保留在当前浏览器。
- 已提供静态检查及真实浏览器 CI；正式发布使用免费 GitHub Pages，无需服务器和 SSH 密钥。

## 未来可迁移架构

当前零依赖结构利于快速体验；正式开发时可迁移至 React + TypeScript + Vite，使用组件化实验引擎、结构化课程数据、单元测试和可访问性规范。不要为了重构而改变已验证的学习节奏。

## 正式发布：GitHub Pages

- 正式域名：`https://lxxlovechelsea.top/`，域名与 DNS 在阿里云管理，网页由 GitHub Pages 托管。
- 用户确认不购买服务器，并授权仓库改为 Public 使用免费 Pages。
- 持续部署：`.github/workflows/deploy-pages.yml`，main 更新后先运行浏览器 CI，再发布网站并验收正式 HTTPS。
- GitHub CI：`.github/workflows/ci.yml`。
- 原始任务书：`CODEX_DEPLOY.md`、`CODEX_DEPLOY_LXX.md`（部署目标已由后续用户指令更新为免费 Pages），后续产品开发：`CODEX_NEXT.md`。
- Compose/Caddy 配置保留于 `compose.yaml`、`deploy/aliyun/`，供未来用户明确要求 VM 部署时使用。

Pages 使用 `PAGES_DEPLOY_ENABLED=true`；阿里云 VM 发布保持 `ALIYUN_DEPLOY_ENABLED=false`。Pages 仅上传三个课程文件、CNAME 和版本标记，不发布内部文档或测试依赖。发布权限来自 GitHub 自动提供的短期 `GITHUB_TOKEN` 与 OIDC，不需要额外保存任何长期密钥。部署实况见 `docs/DEPLOYMENT_STATUS.md`。

## 浏览器验收

```bash
npm ci
npx playwright install chromium
npm run test:e2e
# 正式公网验收，严格验证 TLS，且必须返回课程页面
npm run test:e2e:public
```

Playwright 分别使用 1440px 桌面和 390px 手机视口，验证四节实验、错误与正确答题、刷新进度、资源响应、手机触摸目录及滑块和五个页面的横向溢出。测试阻断可选的 Google Fonts 请求来验证本地字体回退，课程资源仍真实加载。HTML 报告和截图生成于 `playwright-report/`、`test-results/`，并作为 Actions 构件保存。公网测试失败时不能宣布上线。
