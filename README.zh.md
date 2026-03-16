# 🔐 get2fa - 本地安全 TOTP 工作区

![Status](https://img.shields.io/badge/Status-Production-success)
![Security](https://img.shields.io/badge/Security-Client--Side-violet)
![PWA](https://img.shields.io/badge/PWA-Supported-orange)

[🇺🇸 English](./README.md) | [🇻🇳 Tiếng Việt](./README.vi.md) | [🇨🇳 中文](./README.zh.md) | [🇪🇸 Español](./README.es.md) | [🇯🇵 日本語](./README.ja.md) | [🇩🇪 Deutsch](./README.de.md) | [🇫🇷 Français](./README.fr.md)

`get2fa` 是一款以隐私为先的 TOTP 应用，可在本地整理、分组和备份你的双重验证码。

## ✨ 主要特性

*   🛡️ **100% 客户端运行**：所有逻辑都在浏览器中执行，不会把数据发送到任何服务器。
*   📱 **支持 PWA**：可安装到桌面和移动设备，并且支持 **100% 离线使用**。
*   🌍 **多语言支持**：支持 **英语、越南语、中文、西班牙语、日语、德语和法语**，并会自动检测用户语言。
*   🎨 **现代界面**：采用 Glassmorphism 风格，并使用 **JetBrains Mono** 字体。
*   ⚡ **拖放排序**：可直观地调整账户顺序。
*   🚀 **性能优化**：渲染经过优化，使用流畅。
*   🗂️ **工作区**：可按个人、工作或项目将验证码分开管理。
*   📦 **备份与恢复**：支持单个或多个工作区的 JSON 导入与导出。
*   🌗 **深色模式**：完整支持跟随系统主题。

---

## 🛠️ 技术栈

*   **框架**：React 19 + Vite
*   **语言**：TypeScript
*   **运行时**：Bun
*   **样式**：TailwindCSS v4 + Shadcn UI
*   **动画**：Framer Motion
*   **PWA**：Vite Plugin PWA
*   **i18n**：i18next

---

## 📲 Progressive Web App (PWA)

这是一个 PWA 应用，你可以将它安装到设备上以获得接近原生应用的体验。

*   **支持离线使用**：即使没有网络也能查看验证码。
*   **在 Chrome/Edge 安装**：点击地址栏右侧的“安装”图标。
*   **在 iOS 安装**：Safari > 分享 > “添加到主屏幕”。
*   **在 Android 安装**：Chrome > 菜单 > “安装应用”。

---

## 🚀 部署（Ubuntu + PM2）

本说明假设你已经安装好 **Bun** 和 **PM2**。

### 1. 安装与构建
```bash
# 克隆仓库
git clone https://github.com/manhlinhfs/get2fa.git
cd get2fa

# 安装依赖
bun install

# 构建生产版本
bun run build
```

### 2. 使用 PM2 运行（推荐）
我们使用 PM2 以 **SPA 支持** 的方式提供静态文件服务。

```bash
# 在 3333 端口启动应用
pm2 serve dist 3333 --spa --name "get2fa"

# 保存 PM2 列表，便于重启后自动恢复
pm2 save
pm2 startup
```

### 3. 更新应用
更新到最新版本：
```bash
git pull --ff-only origin main
bun run build
pm2 restart get2fa
```

---

## ⚠️ 安全提示

*   **本地存储**：数据保存在浏览器的 `localStorage` 中。
*   **数据丢失**：清除浏览器缓存 **会** 删除你的验证码。
*   **建议**：每次新增账户后都立即执行 **导出备份**，并将文件保存在安全位置（例如加密云盘或 USB）。

---

<p align="center">
  为 local-first 的 2FA 管理而构建。
</p>
