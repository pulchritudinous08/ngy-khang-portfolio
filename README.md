# Ngy Khang — Portfolio & Kho Dự Án Cá Nhân

Trang web cá nhân nền đen tối giản dùng để **đăng tải, trưng bày và cho phép tải về dự án trực tiếp**, tích hợp hoạt ảnh mượt mà cho cả **PC** lẫn **Mobile**.

## Tính năng nổi bật

- **Đăng tải & Tải về dự án trực tiếp**: Kéo thả tệp bất kỳ (`.zip`, `.html`, `.js`, `.py`, `.apk`, `.pdf`...) hoặc dán link tải ngoài (GitHub Release / Drive). Tệp tải lên được lưu cục bộ trên trình duyệt bằng `IndexedDB`.
- **Hiệu ứng mở web (Opening Intro Curtain)**: Màn chào toàn màn hình nền đen với biểu tượng `NK`, tên **Ngy Khang** trượt mở, thanh tiến trình và hoạt ảnh xuất hiện theo nhịp cho toàn bộ phần Hero.
- **Hoạt ảnh theo dõi chuột (PC)**: Vòng con trỏ tùy chỉnh mượt 60fps, ánh sáng nền di chuyển theo chuột, vùng phản chiếu (`spotlight`) và nghiêng 3D trên từng thẻ dự án, nút hút nam châm (`magnetic`).
- **Hoạt ảnh cuộn & chạm (Mobile + PC)**: Thanh tiến trình cuộn, hiệu ứng parallax, xuất hiện mờ-sang-nét (`IntersectionObserver`), quán tính nghiêng khi cuộn và tự động làm nổi thẻ ở giữa màn hình trên điện thoại kèm sóng chạm (`touch ripple`).
- **Tìm kiếm, lọc danh mục, sắp xếp & chỉnh sửa hồ sơ** trực tiếp ngay trên giao diện.

## Cấu trúc mã nguồn

- `index.html` — Cấu trúc HTML5 ngữ nghĩa
- `styles.css` — Hệ thống giao diện nền đen tối giản & hoạt ảnh CSS
- `script.js` — Logic quản lý dự án, lưu trữ `IndexedDB` và hiệu ứng tương tác

## Cách triển khai nhanh (GitHub Pages)

1. Vào **Settings → Pages** của kho mã nguồn này.
2. Ở mục **Build and deployment**, chọn **Deploy from a branch** → nhánh `main` → thư mục `/ (root)` → **Save**.
3. Sau vài chục giây, trang web sẽ hoạt động trực tuyến tại `https://<username>.github.io/ngy-khang-portfolio/`.
