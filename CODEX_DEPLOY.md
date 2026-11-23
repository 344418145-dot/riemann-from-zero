# Codex P0 — 独立仓库创建及网易云上线交接任务

> 原始附件任务书，保留以便追溯。用户后续将平台更正为阿里云，继而确认**不购买服务器、仓库改为 Public 并使用免费 GitHub Pages**。当前有效发布配置为 `.github/workflows/deploy-pages.yml`。下文网易云和旧路径不再作为实施目标。

## 用户授权意图

用户要求：**由助手/Codex 自行创建独立 GitHub 仓库并部署到网易云（网易数帆），不再让用户参与逐条执行。**

请优先自动执行已有授权允许的操作；**不得以此推断拥有用户的 GitHub 仓库创建权限、网易云账户、服务器 SSH 或 DNS 权限。** 遇到缺失权限必须报告真实阻塞，不要声称已经部署。不要污染 `world-cup-site` / `moonwolf-club` / `velorn-world`。

## 本地项目

当前仓库是 `riemann-from-zero` 的完整静态 v0.1 源码；包括 4 节互动课程、`compose.yaml`、`deploy/netease/Caddyfile`、`.github/workflows/deploy-netease.yml`、`.github/workflows/ci.yml`、`.env.example`。课程零依赖，首版**不进行 React 重构**。

## 自动执行步骤

1. 在拥有 GitHub 创建权限的执行环境创建新的 `344418145-dot/riemann-from-zero`（默认 private）。本仓库备有 `scripts/create-github-repo.sh`，它要求已授权的 `gh` CLI；无凭证时不得编造创建成功。若仓库已存在，先核对身份及文件内容，不覆盖。
2. 提交整个仓库至 main；保持 README 和其它业务仓库不变。当前打包内包含本地 Git 历史（如从 git bundle 恢复）。
3. 在已授权的网易云 Linux 云服务器上确认 Docker + Compose、域名、DNS/80/443、备案要求与访问权限。**不购买云资源、不创建付费服务，除非用户已经提供明确同意及相应授权。**
4. 优先使用仓库的 `compose.yaml` 及 Caddyfile 部署；`SITE_ADDRESS=:80` 仅限 HTTP 初步验证，真实域名时切换为域名并验证 HTTPS。若网易云账号仅有 NOS 对象存储，先核实静态托管、域名/HTTPS 功能及 API 再选择 NOS，不凭空猜测供应商端点。
5. 在 GitHub 仓库配置 Actions secrets/variables（不能把密钥提交代码）；完成部署后核验真正的公网 URL 及课程交互；把真实 URL 和 commit SHA 回报。
6. 不得以本地 localhost 成功代替公网访问成功，不得提供未经验证的伪造链接。

## 验收

- 真实 HTTPS URL + 基本健康检查、手机390px/桌面1440px截图。
- 函数机器2→5；ζ(2)求和趋近1.644934；i旋转4次回原点；复数坐标拖动正确；浏览器刷新能保持进度。
- 明确记录部署平台、服务器/容器路径、自动部署工作流状态。

## 如遇当前工具权限不足

完成所有离线准备并提交变更，但清楚报告：远程仓库创建、网易云服务器部署分别缺什么权限。**无需用户重复说明目标**，等获得相应安全授权后继续。
