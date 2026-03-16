# 🔐 get2fa - Espaces de travail TOTP sécurisés en local

![Status](https://img.shields.io/badge/Status-Production-success)
![Security](https://img.shields.io/badge/Security-Client--Side-violet)
![PWA](https://img.shields.io/badge/PWA-Supported-orange)

[🇺🇸 English](./README.md) | [🇻🇳 Tiếng Việt](./README.vi.md) | [🇨🇳 中文](./README.zh.md) | [🇪🇸 Español](./README.es.md) | [🇯🇵 日本語](./README.ja.md) | [🇩🇪 Deutsch](./README.de.md) | [🇫🇷 Français](./README.fr.md)

`get2fa` est une application TOTP orientée confidentialité qui conserve vos codes en local, bien organisés et installables sur ordinateur comme sur mobile.

## ✨ Points forts

*   🛡️ **100% côté client**：Toute la logique s'exécute dans le navigateur. Aucune donnée n'est envoyée à un serveur.
*   📱 **Support PWA**：Installable sur ordinateur et mobile, avec fonctionnement **100% hors ligne**.
*   🌍 **Multilingue**：Prend en charge **l'anglais, le vietnamien, le chinois, l'espagnol, le japonais, l'allemand et le français**. La langue de l'utilisateur est détectée automatiquement.
*   🎨 **Interface moderne**：Design Glassmorphism soigné avec typographie **JetBrains Mono**.
*   ⚡ **Glisser-déposer**：Réorganisez vos comptes de manière intuitive.
*   🚀 **Performances**：Rendu optimisé et utilisation fluide.
*   🗂️ **Workspaces**：Séparez vos codes personnels, professionnels ou par projet.
*   📦 **Sauvegarde et restauration**：Import/export JSON sécurisé pour un ou plusieurs workspaces.
*   🌗 **Mode sombre**：Prise en charge complète du thème système.

---

## 🛠️ Stack technique

*   **Framework**：React 19 + Vite
*   **Langage**：TypeScript
*   **Runtime**：Bun
*   **Style**：TailwindCSS v4 + Shadcn UI
*   **Animation**：Framer Motion
*   **PWA**：Vite Plugin PWA
*   **i18n**：i18next

---

## 📲 Progressive Web App (PWA)

Cette application est une PWA, ce qui signifie que vous pouvez l'installer sur votre appareil pour obtenir une expérience proche d'une application native.

*   **Fonctionne hors ligne**：Accédez à vos codes même sans connexion Internet.
*   **Installation sur Chrome/Edge**：Cliquez sur l'icône d'installation dans la barre d'adresse.
*   **Installation sur iOS**：Safari > Partager > « Ajouter à l'écran d'accueil ».
*   **Installation sur Android**：Chrome > Menu > « Installer l'application ».

---

## 🚀 Déploiement (Ubuntu + PM2)

Ce guide suppose que **Bun** et **PM2** sont déjà installés.

### 1. Installation et build
```bash
# Cloner le dépôt
git clone https://github.com/manhlinhfs/get2fa.git
cd get2fa

# Installer les dépendances
bun install

# Compiler pour la production
bun run build
```

### 2. Exécution avec PM2 (recommandé)
Nous utilisons PM2 pour servir les fichiers statiques avec **support SPA**.

```bash
# Démarrer l'application sur le port 3333
pm2 serve dist 3333 --spa --name "get2fa"

# Sauvegarder la liste PM2 pour redémarrer après reboot
pm2 save
pm2 startup
```

### 3. Mettre à jour l'application
Pour mettre à jour vers la dernière version :
```bash
git pull --ff-only origin main
bun run build
pm2 restart get2fa
```

---

## ⚠️ Notice de sécurité

*   **Local Storage**：Les données sont stockées dans le `localStorage` du navigateur.
*   **Perte de données**：Effacer le cache du navigateur **supprimera** vos codes.
*   **Recommandation**：Exportez toujours une **sauvegarde** juste après l'ajout de nouveaux comptes et conservez le fichier dans un endroit sûr (cloud chiffré, clé USB, etc.).

---

<p align="center">
  Conçu pour une gestion 2FA local-first.
</p>
