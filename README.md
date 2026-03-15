# 🔐 get2fa - Secure Local TOTP Workspaces

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Status](https://img.shields.io/badge/Status-Production-success)
![Security](https://img.shields.io/badge/Security-Client--Side-violet)
![PWA](https://img.shields.io/badge/PWA-Supported-orange)

[🇺🇸 English](./README.md) | [🇻🇳 Tiếng Việt](./README.vi.md)

`get2fa` is a **privacy-first** TOTP workspace app that keeps your codes local, organized, and installable across desktop and mobile.

## ✨ Highlights

*   🛡️ **100% Client-Side**: Logic runs entirely in your browser. No data is sent to any server.
*   📱 **PWA Support**: Installable on Desktop/Mobile and works **100% Offline**.
*   🌍 **Multi-language**: Supports **English, Vietnamese, Chinese, Spanish, Japanese, German, and French**. Auto-detects user preference.
*   🎨 **Modern UI**: Polished Glassmorphism design with **JetBrains Mono** typography.
*   ⚡ **Drag & Drop**: Reorder your accounts intuitively.
*   🚀 **Performance**: Optimized rendering, zero lag.
*   🗂️ **Workspaces**: Separate vault-style workspaces for personal, work, and project codes.
*   📦 **Backup & Restore**: Secure JSON import/export for one or multiple workspaces.
*   🌗 **Dark Mode**: Fully supported system-aware theming.

---

## 🛠️ Tech Stack

*   **Framework**: React 18 + Vite
*   **Language**: TypeScript
*   **Runtime**: Bun
*   **Styling**: TailwindCSS v4 + Shadcn UI
*   **Animation**: Framer Motion
*   **PWA**: Vite Plugin PWA
*   **i18n**: i18next

---

## 📲 Progressive Web App (PWA)

This app is a PWA, meaning you can install it on your device for a native-like experience.

*   **Offline Capable**: Access your codes even without an internet connection.
*   **Install on Chrome/Edge**: Click the "Install" icon in the address bar (Right side).
*   **Install on iOS**: Safari > Share > "Add to Home Screen".
*   **Install on Android**: Chrome > Menu > "Install App".

---

## 🚀 Deployment (Ubuntu + PM2)

This guide assumes you have **Bun** and **PM2** installed.

### 1. Setup & Build
```bash
# Clone repository
git clone https://github.com/manhlinhfs/totp-client.git get2fa
cd get2fa

# Install dependencies
bun install

# Build for production
bun run build
```

### 2. Run with PM2 (Recommended)
We use PM2 to serve the static files with **SPA support** (Single Page Application).

```bash
# Start the application on port 3333
pm2 serve dist 3333 --spa --name "get2fa"

# Save PM2 list to respawn on reboot
pm2 save
pm2 startup
```

### 3. Update Application
To update to the latest version:
```bash
git pull origin master
bun run build
pm2 restart get2fa
```

---

## ⚠️ Security Notice

*   **Local Storage**: Data is stored in your browser's `localStorage`.
*   **Data Loss**: Clearing browser cache **WILL** delete your codes.
*   **Recommendation**: Always **Export Backup** immediately after adding new accounts and store the file securely (e.g., Encrypted Cloud, USB).

---

<p align="center">
  Built with ❤️ for a safer web.
</p>
