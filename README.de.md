# 🔐 get2fa - Sichere lokale TOTP-Workspaces

![Status](https://img.shields.io/badge/Status-Production-success)
![Security](https://img.shields.io/badge/Security-Client--Side-violet)
![PWA](https://img.shields.io/badge/PWA-Supported-orange)

[🇺🇸 English](./README.md) | [🇻🇳 Tiếng Việt](./README.vi.md) | [🇨🇳 中文](./README.zh.md) | [🇪🇸 Español](./README.es.md) | [🇯🇵 日本語](./README.ja.md) | [🇩🇪 Deutsch](./README.de.md) | [🇫🇷 Français](./README.fr.md)

`get2fa` ist eine datenschutzorientierte TOTP-App, die deine Codes lokal speichert, organisiert und auf Desktop sowie Mobilgeräten installierbar macht.

## ✨ Highlights

*   🛡️ **100% Client-seitig**：Die gesamte Logik läuft im Browser. Es werden keine Daten an einen Server gesendet.
*   📱 **PWA-Unterstützung**：Auf Desktop und Mobil installierbar und **100% offline** nutzbar.
*   🌍 **Mehrsprachig**：Unterstützt **Englisch, Vietnamesisch, Chinesisch, Spanisch, Japanisch, Deutsch und Französisch**. Die Sprache des Nutzers wird automatisch erkannt.
*   🎨 **Modernes UI**：Poliertes Glassmorphism-Design mit **JetBrains Mono** Typografie.
*   ⚡ **Drag & Drop**：Konten lassen sich intuitiv neu anordnen.
*   🚀 **Performance**：Optimiertes Rendering und flüssige Nutzung.
*   🗂️ **Workspaces**：Trenne Codes nach Privat, Arbeit oder Projekten.
*   📦 **Backup & Restore**：Sicherer JSON-Import und -Export für einen oder mehrere Workspaces.
*   🌗 **Dark Mode**：Volle Unterstützung für systemabhängige Themes.

---

## 🛠️ Tech-Stack

*   **Framework**：React 19 + Vite
*   **Sprache**：TypeScript
*   **Runtime**：Bun
*   **Styling**：TailwindCSS v4 + Shadcn UI
*   **Animation**：Framer Motion
*   **PWA**：Vite Plugin PWA
*   **i18n**：i18next

---

## 📲 Progressive Web App (PWA)

Diese Anwendung ist eine PWA. Du kannst sie auf deinem Gerät installieren und wie eine native App verwenden.

*   **Offline nutzbar**：Greife auch ohne Internetverbindung auf deine Codes zu.
*   **Installation in Chrome/Edge**：Klicke auf das Installationssymbol in der Adressleiste.
*   **Installation auf iOS**：Safari > Teilen > „Zum Home-Bildschirm“.
*   **Installation auf Android**：Chrome > Menü > „App installieren“.

---

## 🚀 Deployment (Ubuntu + PM2)

Diese Anleitung setzt voraus, dass **Bun** und **PM2** bereits installiert sind.

### 1. Setup & Build
```bash
# Repository klonen
git clone https://github.com/manhlinhfs/get2fa.git
cd get2fa

# Abhängigkeiten installieren
bun install

# Produktions-Build erstellen
bun run build
```

### 2. Mit PM2 ausführen (empfohlen)
Wir verwenden PM2, um die statischen Dateien mit **SPA-Unterstützung** bereitzustellen.

```bash
# Anwendung auf Port 3333 starten
pm2 serve dist 3333 --spa --name "get2fa"

# PM2-Liste speichern, damit sie nach einem Reboot wieder startet
pm2 save
pm2 startup
```

### 3. Anwendung aktualisieren
So aktualisierst du auf die neueste Version:
```bash
git pull --ff-only origin main
bun run build
pm2 restart get2fa
```

---

## ⚠️ Sicherheitshinweis

*   **Local Storage**：Die Daten werden im `localStorage` des Browsers gespeichert.
*   **Datenverlust**：Das Löschen des Browser-Caches **löscht** auch deine Codes.
*   **Empfehlung**：Exportiere immer sofort nach dem Hinzufügen neuer Konten ein **Backup** und speichere die Datei an einem sicheren Ort, z. B. in verschlüsseltem Cloud-Speicher oder auf einem USB-Stick.

---

<p align="center">
  Entwickelt für local-first 2FA-Verwaltung.
</p>
