# 网易云（网易数帆）部署说明

## 状态和前提

这是 **部署适配与自动化配置**，不是已经在线运行的实例。目标：网易云 Linux 云服务器 / 容器宿主机。
需要：实际可访问的云服务器、部署用 SSH 权限、Docker + Compose、80/443 端口已放行。想要 **HTTPS 网站**，还需要已指向服务器公网 IP 的域名及符合当地规定的备案/接入要求（如适用）。

该网站是纯静态 HTML + CSS + JavaScript，**不需要数据库或后端**。官网资料也提到网易 NOS 可存放静态网站资源，但未确认该账号下 NOS 桶的完整静态站点路由、HTTPS 与域名能力，所以这里选择可验证的 Caddy 容器部署路径，而不伪造 NOS API。

## 手动首发（有云服务器访问权时）

1. 把整个仓库克隆到云服务器，如 `/opt/riemann-from-zero`。
2. 在服务器上安装 Docker Engine 和 Docker Compose plugin，确认 `docker compose version` 可用。
3. 在仓库目录复制 `.env.example` 到 `.env`。如果只有服务器公网 IP，可保留 `SITE_ADDRESS=:80` 临时做 HTTP 验证；拥有域名时将它改为真实 FQDN，如 `learn.example.com`，配置 DNS A/AAAA 指向服务器并开放 80/443。
4. 运行：

   ```bash
   docker compose up -d
   docker compose ps
   curl -fI http://127.0.0.1/
   ```

5. 从外网用浏览器打开实际域名或公网 IP 验证样式、JavaScript 和四节交互课；有域名时应自动申请 HTTPS 证书。如云服务器安全组/CDN/DNS未配置正确，先修正这些外部条件。

## GitHub 自动部署

仓库包含 `.github/workflows/deploy-netease.yml`。仓库建立且 VPS 访问授权完成后，设置仓库 Actions Secrets：

- `NETEASE_SSH_HOST` — 公网 IP 或主机名
- `NETEASE_SSH_USER` — 有 `/opt/riemann-from-zero` 写权限和 `docker compose` 执行权限的专用部署用户
- `NETEASE_SSH_PORT` — SSH 端口；不填使用 `22`
- `NETEASE_SSH_PRIVATE_KEY` — 专用部署密钥，**只放进 GitHub Secrets**
- `NETEASE_SSH_KNOWN_HOSTS` — 通过可信渠道核对的服务器 SSH 主机公钥记录，避免 `StrictHostKeyChecking=no`

另外设 Repository Variable：`NETEASE_DEPLOY_ENABLED=true` 才启用自动发布。默认禁用，避免仓库初建时因为缺失服务器授权而失败。服务器的 `.env` 必须已由有权限的部署者安全配置，工作流不会覆盖它。

**重要**：不要在仓库写任何云账号密码、Access Key 或 SSH 私钥，不要要求用户把凭据粘贴在聊天里。无法通过已授权集成访问云账号或服务器时，停止在授权边界，并报告实际状态。

## 上线验收

- HTTPS URL 可在外网访问且 `index.html`, `styles.css`, `app.js` 均返回 200。
- 函数机器输入 2 得到 5；ζ(2) 前 200 项向 1.644934… 靠近；连续 4 次乘 i 回到 1；复数坐标随滑块变化。
- 390px 手机、1440px 桌面无横向溢出，答题进度刷新后保持。
- HTTPS、DNS、域名备案要求、安全组和费用明确；不得声称未经验证的网站已上线。
