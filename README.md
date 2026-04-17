# Cafe Management App (MVP)

MVP web app quản lý điều hành quán cafe với stack: **Next.js + TypeScript + Tailwind + Prisma + PostgreSQL**.

## 1) Project setup
### Files changed
- `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`, `next-env.d.ts`, `.gitignore`, `.env.example`
- `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`

### Quick manual test
1. `npm install`
2. `npm run dev`
3. Mở `/` và kiểm tra redirect về `/dashboard`.

---

## 2) Prisma schema + migration + seed
### Files changed
- `prisma/schema.prisma`
- `prisma/seed.ts`

### Quick manual test
1. Copy `.env.example` thành `.env` và chỉnh `DATABASE_URL`.
2. `npx prisma generate`
3. `npx prisma migrate dev --name init`
4. `npm run prisma:seed`

---

## 3) Auth + role protection
### Files changed
- `src/lib/constants.ts`, `src/lib/auth.ts`, `src/lib/validators.ts`, `src/lib/db.ts`
- `middleware.ts`
- `src/app/(auth)/login/page.tsx`
- `src/app/api/auth/login/route.ts`

### Quick manual test
1. Vào `/login`.
2. Đăng nhập bằng `admin@cafe.local / 123456`.
3. Truy cập `/dashboard` khi chưa đăng nhập phải bị redirect về `/login`.

---

## 4) Admin layout
### Files changed
- `src/components/admin-nav.tsx`
- `src/components/page-shell.tsx`
- `src/app/(admin)/layout.tsx`

### Quick manual test
1. Sau login, kiểm tra sidebar hiển thị đầy đủ module.
2. Điều hướng qua các route trong sidebar.

---

## 5-13) Modules (Tables, Menu, Orders, Payments, Inventory, Shifts, Users, Dashboard, Reports)
### Files changed
- `src/app/(admin)/actions.ts`
- `src/lib/services/orders.ts`
- `src/lib/services/inventory.ts`
- `src/lib/services/shifts.ts`
- `src/app/(admin)/dashboard/page.tsx`
- `src/app/(admin)/tables/page.tsx`, `src/app/(admin)/tables/new/page.tsx`
- `src/app/(admin)/orders/page.tsx`, `src/app/(admin)/orders/[id]/page.tsx`
- `src/app/(admin)/menu/items/page.tsx`, `src/app/(admin)/menu/items/new/page.tsx`
- `src/app/(admin)/payments/page.tsx`, `src/app/(admin)/payments/[id]/page.tsx`
- `src/app/(admin)/inventory/page.tsx`, `src/app/(admin)/inventory/transactions/page.tsx`
- `src/app/(admin)/shifts/page.tsx`, `src/app/(admin)/shifts/open/page.tsx`, `src/app/(admin)/shifts/close/page.tsx`
- `src/app/(admin)/users/page.tsx`, `src/app/(admin)/users/new/page.tsx`
- `src/app/(admin)/reports/page.tsx`
- Các route placeholder theo spec:
  - `/tables/[id]/edit`, `/menu/categories`, `/menu/items/[id]/edit`, `/inventory/new`, `/inventory/[id]/edit`, `/shifts/[id]`, `/users/[id]/edit`

### Quick manual test
1. **Tables**: tạo bàn mới ở `/tables/new` và xem ở `/tables`.
2. **Menu**: tạo món ở `/menu/items/new` và xem ở `/menu/items`.
3. **Orders**: tạo order ở `/orders`, thêm món và thanh toán tại `/orders/[id]`.
4. **Payments**: kiểm tra log thanh toán ở `/payments` và `/payments/[id]`.
5. **Inventory**: ghi nhận IN/OUT/ADJUSTMENT ở `/inventory/transactions`, kiểm tra tồn kho tại `/inventory`.
6. **Shifts**: mở ca tại `/shifts/open`, đóng ca ở `/shifts/close`, xem danh sách `/shifts`.
7. **Users**: tạo user mới ở `/users/new` và xem danh sách `/users`.
8. **Dashboard/Reports**: kiểm tra số liệu tổng quan tại `/dashboard` và `/reports`.

---

## 14) Validation + bugfix + refactor
- Validation trọng yếu đã thêm qua Zod trong `src/lib/validators.ts`.
- Business rules đặt trong service layer:
  - Một bàn chỉ có một order OPEN.
  - Tạo order dine-in => bàn OCCUPIED.
  - Order phải có item trước khi thanh toán.
  - Order đã PAID không thể thanh toán lại và không cho chỉnh sửa flow chuẩn.
  - Mọi thay đổi kho phải đi qua stock transaction.
  - MVP chỉ cho phép 1 ca OPEN tại một thời điểm.

## Required routes checklist
Đã có đủ các route/page theo yêu cầu spec:
- `/login`
- `/dashboard`
- `/tables`
- `/tables/new`
- `/tables/[id]/edit`
- `/orders`
- `/orders/[id]`
- `/menu/categories`
- `/menu/items`
- `/menu/items/new`
- `/menu/items/[id]/edit`
- `/payments`
- `/payments/[id]`
- `/inventory`
- `/inventory/new`
- `/inventory/[id]/edit`
- `/inventory/transactions`
- `/shifts`
- `/shifts/open`
- `/shifts/close`
- `/shifts/[id]`
- `/users`
- `/users/new`
- `/users/[id]/edit`
- `/reports`
