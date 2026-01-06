# Authenticator - Secure 2FA Web App

A modern, privacy-focused, and secure 2FA (TOTP) authenticator web application. This tool allows you to manage your two-factor authentication codes directly in your browser with a beautiful Glassmorphism UI.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/react-2023-blue.svg)
![Vite](https://img.shields.io/badge/vite-6.0-purple.svg)
![Bun](https://img.shields.io/badge/bun-1.1-black.svg)

## ✨ Key Features

- **Privacy First**: 100% Client-side. Your data never leaves your browser.
- **Modern UI/UX**: Beautiful Glassmorphism design with smooth Framer Motion animations.
- **Smart Input**: Automatic paste from clipboard for service names and secrets.
- **Real-time TOTP**: Accurate countdown with visual alerts when codes are about to expire.
- **Flexible Tagging**: Organize your codes with custom tags and quick filtering.
- **Backup & Restore**: Export your data to a JSON file and restore it anytime.
- **Dark Mode**: Built-in support for light and dark themes.

## 🚀 Getting Started

### Prerequisites

You need to have [Bun](https://bun.sh/) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/manhlinhfs/2fa.rawcode.io.git
   cd 2fa.rawcode.io
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Start the development server:
   ```bash
   bun run dev
   ```

4. Build for production:
   ```bash
   bun run build
   ```

## 🛡️ Security & Storage

This application uses **LocalStorage** to store your 2FA secrets.
- **No Cloud Sync**: Your data is NOT synced to any server.
- **Data Loss Risk**: Clearing browser cache or switching browsers will result in data loss.
- **Recommended**: Always use the **Export Backup** feature in the settings menu to keep a physical copy of your data in a safe place.

## 🛠️ Built With

- [React](https://reactjs.org/) - Frontend framework
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Shadcn UI](https://ui.shadcn.com/) - UI Components
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [OTPAuth](https://github.com/hectorm/otpauth) - TOTP Logic

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---
Built with ❤️ for a more secure web.