# Codex 部署任务 — lxxlovechelsea.top

## 目标
把当前文件夹内的《从零理解黎曼猜想》v0.1 静态交互课程部署到用户指定的网易云环境，最终通过 **https://lxxlovechelsea.top/** 公网访问。请直接操作，用户只接收最终网站链接和验收报告；必要授权由对应服务的安全登录界面完成。

## 源码及工作边界
- 以本源码包为唯一初始代码来源，保留 4 节已完成课程及本地学习进度。
- 新建独立 GitHub 仓库：`344418145-dot/riemann-from-zero`（默认 private），不能污染其他仓库；如果无法创建，请给出真实阻塞。
- 本项目零依赖，采用静态 HTML/CSS/JS。首发不做 React 重构、内容改写或增加后端。
- 检查现有 `CODEX_DEPLOY.md`、`deploy/netease/README.md`、`compose.yaml`、`deploy/netease/Caddyfile`、`.github/workflows/deploy-netease.yml`。

## 域名和服务安全
1. 明确用户指定域名为裸域名 `lxxlovechelsea.top`（不是随意替换成子域名）；先查询该域名的现有 DNS、HTTPS 与线上内容，防止覆盖当前网站。如已有线上业务，备份并审视冲突；不要删除现有站点或强抢 80/443，优先做并行测试或无损迁移。
2. 在授权的网易云账号中查明是 Linux 云服务器、容器服务还是 NOS 静态站点。若有 VM，优先沿用仓库的 Docker Compose+Caddy；配置服务端 `.env` 为 `SITE_ADDRESS=lxxlovechelsea.top`，在符合云网络和当地备案要求前提下设置 DNS A 记录指向正确公网 IP（AAAA 仅在 IPv6 可用时配置），开放 80/443，并自动申请 TLS 证书。
3. 如果网易云仅提供其他托管服务，按实际支持的方式做等效静态部署，保持同一目标域名。不能臆造云产品功能。
4. 云账号、GitHub、DNS 或 SSH 权限不足时，停在授权边界，报告所需最小权限。禁止索取用户在聊天中粘贴私钥/Access Key，禁止在仓库或日志泄露凭据，禁止未经允许开通付费资源。

## 仓库与自动部署
1. 若仓库不存在，用已授权 gh CLI 创建新仓库；如已存在，核对后安全更新，不进行强制覆盖。
2. 将静态源码及部署配置提交至 `main`。部署密钥放 GitHub Actions Secrets；不得提交 `.env` 和私钥。
3. 完成首发并验证后，测试 `.github/workflows/deploy-netease.yml` 的自动部署；无授权则保留 `NETEASE_DEPLOY_ENABLED` 关闭并报告。

## 上线验收（必须实测，不得仅测试 localhost）
- `https://lxxlovechelsea.top/` 外网访问且 TLS 有效；静态 JS/CSS 返回 200，刷新可正常使用。
- 函数机器输入 2 输出 5；ζ(2) 有限部分和随着项数增加向约 1.644934 靠近；乘以 i 四次回原位；复数坐标与滑块联动；本地进度刷新保留。
- 截图确认 390px 移动端与 1440px 桌面端体验良好，无横向溢出。
- 最后输出真实站点 URL、仓库 URL、部署版本 commit SHA、运行平台/路径、DNS/TLS/CI 状态及剩余问题。未完成的必须如实说明，不得声称部署成功。
