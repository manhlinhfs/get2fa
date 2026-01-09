# 🔐 TOTP Client - Trình Tạo Mã 2FA Bảo Mật

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Status](https://img.shields.io/badge/Status-Production-success)
![Security](https://img.shields.io/badge/Security-Client--Side-violet)
![PWA](https://img.shields.io/badge/PWA-Supported-orange)

[🇺🇸 English](./README.md) | [🇻🇳 Tiếng Việt](./README.vi.md)

Một ứng dụng tạo mã xác thực hai bước (TOTP) **chuyên nghiệp, bảo mật**, đặt quyền riêng tư lên hàng đầu. Được thiết kế với giao diện **Glassmorphism** đẹp mắt.

## ✨ Tính Năng Nổi Bật

*   🛡️ **100% Client-Side**: Mọi xử lý diễn ra ngay trên trình duyệt của bạn. Không có dữ liệu nào được gửi đến máy chủ.
*   📱 **Hỗ trợ PWA**: Có thể cài đặt trên Máy tính/Điện thoại và hoạt động **100% Offline** (Không cần mạng).
*   🌍 **Đa ngôn ngữ**: Hỗ trợ **Tiếng Anh, Tiếng Việt, Trung, Tây Ban Nha, Nhật, Đức, Pháp**. Tự động nhận diện ngôn ngữ máy.
*   🎨 **Giao diện Hiện đại**: Thiết kế kính mờ (Glassmorphism) với font chữ **JetBrains Mono**.
*   ⚡ **Kéo & Thả**: Sắp xếp thứ tự tài khoản dễ dàng.
*   🚀 **Hiệu năng cao**: Tối ưu hóa, không giật lag.
*   📦 **Sao lưu & Khôi phục**: Xuất/Nhập dữ liệu an toàn qua file JSON.
*   🌗 **Giao diện Tối**: Hỗ trợ Dark Mode theo hệ thống.

---

## 🛠️ Công Nghệ Sử Dụng

*   **Framework**: React 18 + Vite
*   **Language**: TypeScript
*   **Runtime**: Bun
*   **Styling**: TailwindCSS v4 + Shadcn UI
*   **Animation**: Framer Motion
*   **PWA**: Vite Plugin PWA
*   **i18n**: i18next

---

## 📲 Progressive Web App (PWA)

Ứng dụng này là PWA, nghĩa là bạn có thể cài đặt nó như một ứng dụng thông thường (Native App).

*   **Hoạt động Offline**: Xem mã 2FA ngay cả khi không có mạng Internet.
*   **Cài trên Chrome/Edge**: Nhấn vào biểu tượng "Cài đặt" trên thanh địa chỉ (Góc phải).
*   **Cài trên iOS**: Safari > Chia sẻ (Share) > "Thêm vào Màn hình chính" (Add to Home Screen).
*   **Cài trên Android**: Chrome > Menu > "Cài đặt ứng dụng" (Install App).

---

## 🚀 Triển Khai (Ubuntu + PM2)

Hướng dẫn này giả định bạn đã cài **Bun** và **PM2**.

### 1. Cài đặt & Build
```bash
# Clone repository
git clone https://github.com/manhlinhfs/totp-client.git
cd totp-client

# Cài đặt thư viện
bun install

# Build bản production
bun run build
```

### 2. Chạy với PM2 (Khuyên dùng)
Sử dụng PM2 để serve file tĩnh với chế độ **SPA support**.

```bash
# Chạy ứng dụng ở port 3333
pm2 serve dist 3333 --spa --name "totp-client"

# Lưu danh sách PM2 để tự khởi động lại khi reboot
pm2 save
pm2 startup
```

### 3. Cập nhật ứng dụng
Để cập nhật phiên bản mới nhất:
```bash
git pull origin master
bun run build
pm2 restart totp-client
```

---

## ⚠️ Lưu Ý Bảo Mật

*   **Local Storage**: Dữ liệu được lưu trong `localStorage` của trình duyệt.
*   **Mất Dữ Liệu**: Xóa cache/lịch sử duyệt web **SẼ** xóa mất mã của bạn.
*   **Khuyến Nghị**: Luôn **Xuất Sao Lưu (Export Backup)** ngay sau khi thêm tài khoản mới và lưu file ở nơi an toàn (Cloud mã hóa, USB).

---

<p align="center">
  Built with ❤️ for a safer web.
</p>