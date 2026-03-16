# 🔐 get2fa - ローカルで安全に使える TOTP ワークスペース

![Status](https://img.shields.io/badge/Status-Production-success)
![Security](https://img.shields.io/badge/Security-Client--Side-violet)
![PWA](https://img.shields.io/badge/PWA-Supported-orange)

[🇺🇸 English](./README.md) | [🇻🇳 Tiếng Việt](./README.vi.md) | [🇨🇳 中文](./README.zh.md) | [🇪🇸 Español](./README.es.md) | [🇯🇵 日本語](./README.ja.md) | [🇩🇪 Deutsch](./README.de.md) | [🇫🇷 Français](./README.fr.md)

`get2fa` は、コードをローカルに保存しながら整理・管理できる、プライバシー重視の TOTP アプリです。

## ✨ 主な特徴

*   🛡️ **100% クライアントサイド**：すべての処理はブラウザ内で行われ、データはどのサーバーにも送信されません。
*   📱 **PWA 対応**：デスクトップとモバイルにインストールでき、**100% オフライン**でも利用できます。
*   🌍 **多言語対応**：**英語、ベトナム語、中国語、スペイン語、日本語、ドイツ語、フランス語**に対応し、ユーザー環境の言語を自動検出します。
*   🎨 **モダンな UI**：洗練された Glassmorphism デザインと **JetBrains Mono** タイポグラフィを採用しています。
*   ⚡ **ドラッグ＆ドロップ**：アカウントを直感的に並べ替えられます。
*   🚀 **高パフォーマンス**：描画が最適化され、動作が軽快です。
*   🗂️ **ワークスペース**：個人用、仕事用、プロジェクト別にコードを分けて管理できます。
*   📦 **バックアップと復元**：1つまたは複数のワークスペースを JSON で安全に入出力できます。
*   🌗 **ダークモード**：システム設定に合わせたテーマ切り替えに対応しています。

---

## 🛠️ 技術スタック

*   **フレームワーク**：React 19 + Vite
*   **言語**：TypeScript
*   **ランタイム**：Bun
*   **スタイリング**：TailwindCSS v4 + Shadcn UI
*   **アニメーション**：Framer Motion
*   **PWA**：Vite Plugin PWA
*   **i18n**：i18next

---

## 📲 Progressive Web App (PWA)

このアプリは PWA なので、端末にインストールしてネイティブアプリのように使えます。

*   **オフライン対応**：インターネット接続がなくてもコードを確認できます。
*   **Chrome / Edge でインストール**：アドレスバー右側のインストールアイコンをクリックします。
*   **iOS でインストール**：Safari > 共有 > 「ホーム画面に追加」。
*   **Android でインストール**：Chrome > メニュー > 「アプリをインストール」。

---

## 🚀 デプロイ（Ubuntu + PM2）

この手順では、**Bun** と **PM2** がすでにインストールされている前提です。

### 1. セットアップとビルド
```bash
# リポジトリをクローン
git clone https://github.com/manhlinhfs/get2fa.git
cd get2fa

# 依存関係をインストール
bun install

# 本番ビルド
bun run build
```

### 2. PM2 で実行（推奨）
PM2 を使って、**SPA サポート付き**で静的ファイルを配信します。

```bash
# 3333 ポートでアプリを起動
pm2 serve dist 3333 --spa --name "get2fa"

# 再起動後も復元されるように PM2 設定を保存
pm2 save
pm2 startup
```

### 3. アプリの更新
最新版へ更新するには:
```bash
git pull --ff-only origin main
bun run build
pm2 restart get2fa
```

---

## ⚠️ セキュリティに関する注意

*   **Local Storage**：データはブラウザの `localStorage` に保存されます。
*   **データ損失**：ブラウザのキャッシュを削除すると、コードも **削除されます**。
*   **推奨**：新しいアカウントを追加したら、すぐに **バックアップをエクスポート** し、安全な場所（暗号化クラウドや USB など）に保存してください。

---

<p align="center">
  local-first な 2FA 管理のために作られています。
</p>
