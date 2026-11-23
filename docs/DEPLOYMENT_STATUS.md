# P0 部署报告（2026-11-23）

当前状态：课程已发布到免费 GitHub Pages，正式域名已迁移，正在完成自动化公网验收。

## 已确认的最终方案

用户明确不购买服务器，并授权将 `344418145-dot/riemann-from-zero` 改为 Public，直接使用免费 GitHub Pages；同时授权解除旧足球站的 Pages 域名绑定、迁移到课程。网站与自动部署不需要云服务器、SSH 私钥或长期部署令牌。

- 正式地址：https://lxxlovechelsea.top/
- 源码仓库：https://github.com/344418145-dot/riemann-from-zero
- 课程基线：`2248fc2a773a5b6b50d8648c274580be7012261e`；HTML、CSS、JavaScript 内容保持基线。
- 最新部署 Commit：发布时写入公网 `/version.json`；可与 Actions 对应运行的 Commit 对照。

## 资源与迁移核查

阿里云已登录主账号下，ECS 显示“全部地域均未查询到实例”；轻量服务器全部地域均为 0。该账号负责域名与 DNS。原网站实际托管于 GitHub Pages，无需购买服务器；旧 SSH 主机经核实属于腾讯云，未改动其其他 API 服务。

迁移前公网返回原世界杯网站。旧站 HTML、CSS、JS 及 Git 仓库完整镜像已备份至本机工作区的 `deployment-audit/`，备份未提交到公开仓库。旧业务源码保留，仅按用户授权解除 Pages 自定义域名。

DNS 无需改变：裸域 A 记录为 `185.199.108.153`、`185.199.109.153`、`185.199.110.153`、`185.199.111.153`；www CNAME 为 `344418145-dot.github.io`，TTL 10 分钟。TLS 由 GitHub Pages 管理并强制 HTTPS；证书状态须以最终 API 与真实连接验收为准。

## 自动发布

`.github/workflows/deploy-pages.yml` 在 main 更新后自动执行：

1. 调用真实浏览器 CI，通过后才允许发布。
2. 仅打包 `index.html`、`styles.css`、`app.js`、CNAME 及版本标记；不发布内部文档、测试依赖或配置文件。
3. 通过 GitHub Pages Actions 发布，使用短期 `GITHUB_TOKEN` 与 OIDC，无需保存长期密钥。
4. 等待正式 HTTPS 的版本标记与当前 Commit 一致，再运行桌面和手机公网端到端测试。
5. 保存 HTML 报告、截图及失败 trace，保留 14 天。

`PAGES_DEPLOY_ENABLED=true`；VM 工作流保持 `ALIYUN_DEPLOY_ENABLED=false`。Compose/Caddy 配置保留供将来使用，本次不需要开通 VM 或配置 SSH Secrets。

## 浏览器验收范围

Playwright 真实 Chromium，1440×1000 桌面和 390×844 手机视口。为验证离线字体回退，测试阻断可选的 Google Fonts 请求；课程 HTML、CSS、JavaScript 仍真实加载。手机为触摸设备模拟，未使用实体手机验收。

- 函数机器 2→5、滑块端点→25；错误答案不完成，正确答案记录进度。
- ζ(2) 前 1、2 项为 1、1.25，200 项误差符合积分尾项上下界。
- 乘 i 四次得到 i、−1、−i、1，累计 360°；重置回 0°。
- 复数滑块改变文字和 SVG 点位置；完成四节后刷新仍为 4/4。
- 总览与四节均无横向溢出；手机目录触摸展开、选择后关闭，触摸滑块实时更新。
- CSS/JS 为 200 且 MIME 正确，无课程脚本异常；公网严格校验 TLS。

本地最终测试 4/4 通过。迁移后已在正式 HTTPS 上完成桌面和手机四节课程及刷新进度验证；完整自动化验收结果以 Actions 公网测试构件为准。迁移前公网测试因仍为世界杯标题而失败，未将本地成功当作上线证据。
