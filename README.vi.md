# 🔐 TOTP Client - Ứng dụng 2FA Cục bộ Bảo mật

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Status](https://img.shields.io/badge/Status-Production-success)
![Security](https://img.shields.io/badge/Security-Client--Side-violet)

[🇺🇸 English](./README.md) | [🇻🇳 Tiếng Việt](./README.vi.md)

Một ứng dụng web Xác thực Hai Yếu tố (TOTP) **chuyên nghiệp, ưu tiên quyền riêng tư**. Được thiết kế với giao diện **Glassmorphism** tuyệt đẹp và tập trung vào quyền sở hữu dữ liệu tuyệt đối.

## ✨ Điểm nổi bật

*   🛡️ **100% Client-Side**: Logic chạy hoàn toàn trong trình duyệt của bạn. Không có dữ liệu nào được gửi đến bất kỳ máy chủ nào.
*   🎨 **Giao diện Hiện đại**: Thiết kế Glassmorphism trau chuốt với phông chữ **JetBrains Mono**.
*   ⚡ **Kéo & Thả**: Sắp xếp lại các tài khoản của bạn một cách trực quan.
*   🚀 **Hiệu suất**: Hiển thị tối ưu, không độ trễ.
*   📦 **Sao lưu & Khôi phục**: Chức năng nhập/xuất JSON an toàn.
*   🌗 **Chế độ Tối**: Hỗ trợ đầy đủ giao diện theo hệ thống.

---

## 🛠️ Công nghệ sử dụng

*   **Framework**: React 18 + Vite
*   **Ngôn ngữ**: TypeScript
*   **Runtime**: Bun
*   **Kiểu dáng**: TailwindCSS v4 + Shadcn UI
*   **Hoạt ảnh**: Framer Motion

---

## 🚀 Triển khai (Ubuntu + PM2)

Hướng dẫn này giả định bạn đã cài đặt **Bun** và **PM2**.

### 1. Cài đặt & Build
```bash
# Clone repository
git clone https://github.com/manhlinhfs/totp-client.git
cd totp-client

# Cài đặt dependencies
bun install

# Build cho production
bun run build
```

### 2. Chạy với PM2 (Khuyên dùng)
Chúng tôi sử dụng PM2 để phục vụ các tệp tĩnh với **hỗ trợ SPA** (Single Page Application).

```bash
# Khởi chạy ứng dụng trên cổng 3333
pm2 serve dist 3333 --spa --name "totp-client"

# Lưu danh sách PM2 để tự khởi động lại khi reboot
pm2 save
pm2 startup
```

### 3. Cập nhật Ứng dụng
Để cập nhật lên phiên bản mới nhất:
```bash
git pull origin master
bun run build
pm2 restart totp-client
```

---

## ⚠️ Lưu ý Bảo mật

*   **Local Storage**: Dữ liệu được lưu trữ trong `localStorage` của trình duyệt.
*   **Mất dữ liệu**: Xóa cache trình duyệt **SẼ** xóa các mã của bạn.
*   **Khuyến nghị**: Luôn **Xuất Sao lưu** ngay sau khi thêm tài khoản mới và lưu trữ tệp an toàn (ví dụ: Cloud mã hóa, USB).

---

<p align="center">
  Được xây dựng với ❤️ vì một web an toàn hơn.
</p>
