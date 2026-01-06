# 🔐 TOTP Client - Secure Local 2FA

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Status](https://img.shields.io/badge/Status-Production-success)
![Security](https://img.shields.io/badge/Security-Client--Side-violet)

A **professional, privacy-first** Two-Factor Authentication (TOTP) web application. Designed with a stunning **Glassmorphism UI** and focused on absolute data sovereignty.

## ✨ Highlights

*   🛡️ **100% Client-Side**: Logic runs entirely in your browser. No data is sent to any server.
*   🎨 **Modern UI**: Polished Glassmorphism design with **JetBrains Mono** typography.
*   ⚡ **Drag & Drop**: Reorder your accounts intuitively.
*   🚀 **Performance**: Optimized rendering, zero lag.
*   📦 **Backup & Restore**: Secure JSON import/export functionality.
*   🌗 **Dark Mode**: Fully supported system-aware theming.

---

## 🛠️ Tech Stack

*   **Framework**: React 18 + Vite
*   **Language**: TypeScript
*   **Runtime**: Bun
*   **Styling**: TailwindCSS v4 + Shadcn UI
*   **Animation**: Framer Motion

---

## 🚀 Deployment (Ubuntu + PM2)

This guide assumes you have **Bun** and **PM2** installed.

### 1. Setup & Build
```bash
# Clone repository
git clone https://github.com/manhlinhfs/totp-client.git
cd totp-client

# Install dependencies
bun install

# Build for production
bun run build
```

### 2. Run with PM2 (Recommended)
We use PM2 to serve the static files with **SPA support** (Single Page Application).

```bash
# Start the application on port 3333
pm2 serve dist 3333 --spa --name "totp-client"

# Save PM2 list to respawn on reboot
pm2 save
pm2 startup
```

### 3. Update Application
To update to the latest version:
```bash
git pull origin master
bun run build
pm2 restart totp-client
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
