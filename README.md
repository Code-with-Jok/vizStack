<div align="center">
  <h1>VizStack</h1>
  <p><strong>Trực quan hóa Tech, Làm chủ Stack</strong></p>
  <p>Interactive 3D visualizations that make complex tech concepts intuitive.</p>
</div>

---

## 🚀 Tầm nhìn (Executive Summary)

**VizStack** là một nền tảng giáo dục công nghệ tương tác, được sinh ra với sứ mệnh làm cho việc học các khái niệm lập trình phức tạp (như React Lifecycle, State Management, Component Tree, Kiến trúc Web) trở nên trực quan và dễ hiểu thông qua **Công nghệ 3D (React Three Fiber)**.

Thay vì đọc những tài liệu khô khan, người dùng có thể "nhìn thấy" cách luồng dữ liệu di chuyển, cách các component render, và cách hệ thống giao tiếp với nhau theo thời gian thực.

## 🏗 Kiến trúc hệ thống (Architecture & Tech Stack)

Chúng tôi thiết kế VizStack dựa trên kiến trúc **Monorepo** với **Turborepo** để đảm bảo khả năng mở rộng (scalability), tái sử dụng code (reusability), và tốc độ build cực nhanh.

### 🛠 Core Technologies

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router) - Tận dụng Server Components và Streaming để tối ưu SEO & Performance.
- **Language:** TypeScript (Strict mode) - Đảm bảo Type Safety trên toàn bộ hệ thống từ Database đến Frontend.
- **3D Engine:** [Three.js](https://threejs.org/) & [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) - Render đồ họa 3D tương tác với hiệu năng cao.
- **Database & Backend:** [Convex](https://www.convex.dev/) - Realtime database & Serverless functions có sẵn Type-safe.
- **Authentication:** [Clerk](https://clerk.com/) - Quản lý user/auth an toàn và dễ tích hợp.
- **Styling & UI:** Tailwind CSS, Framer Motion / GSAP, Allotment (Resizable panes).
- **Editor:** [BlockNote](https://www.blocknotejs.org/) - Trình soạn thảo Rich-Text giống Notion cho phần quản lý bài học.
- **i18n:** `next-intl` - Hỗ trợ đa ngôn ngữ (Tiếng Anh & Tiếng Việt).

## 📁 Cấu trúc Monorepo (Repository Structure)

```text
vizStack/
├── apps/
│   └── web/                 # Next.js 14 Main Application (Frontend + Convex backend)
├── packages/
│   ├── config/              # Shared configurations (ESLint, TypeScript, Tailwind)
│   ├── ui/                  # Shared React UI Components (Design System)
│   ├── three-engine/        # Core 3D Visualization Engine (Camera, Lights, Controls)
│   └── module-react/        # React-specific 3D Visualizations (Hooks, States, Trees)
├── turbo.json               # Turborepo configuration
└── pnpm-workspace.yaml      # pnpm workspace definition
```

### Tại sao lại chia Modules?

Việc tách `three-engine` và `module-react` ra thành các packages riêng biệt giúp hệ thống lõi render 3D không bị phụ thuộc chặt chẽ vào Next.js. Trong tương lai, engine 3D có thể dễ dàng được port sang các ứng dụng khác (như React Native, Vite app, hoặc iframe widgets) mà không cần viết lại.

## ✨ Tính năng nổi bật (Key Features)

- **Interactive 3D Walkthroughs:** Trải nghiệm học tập step-by-step với scene 3D đồng bộ với nội dung bài viết.
- **Realtime Editor:** Admin có thể tạo bài viết và kết nối các block text trực tiếp với các step của mô hình 3D.
- **Bilingual Support:** Hỗ trợ song ngữ (EN/VI) ngay từ core architecture sử dụng Next.js middleware.
- **Optimized Performance:** Debounce mutations, React `useActionState`, và Lazy loading các scene 3D dung lượng cao.
- **Type-safe API:** Từ Backend (Convex) truyền xuống Frontend thông qua auto-generated schema, không lo lỗi undefined mapping.

## 💻 Dành cho Lập trình viên (Getting Started)

### 1. Yêu cầu hệ thống (Prerequisites)

- [Node.js](https://nodejs.org/) (v18.17.0+ hoặc v20+)
- [pnpm](https://pnpm.io/) (v9+)
- Cài đặt Editor Extension: `ESLint`, `Prettier`, `Tailwind CSS IntelliSense`.

### 2. Cài đặt (Installation)

Clone dự án và cài đặt dependencies thông qua pnpm workspace:

```bash
git clone https://github.com/Code-with-Jok/vizStack.git
cd vizStack
pnpm install
```

### 3. Cấu hình Biến môi trường (Environment Variables)

Tạo file `.env.local` tại `apps/web/.env.local` và thêm các key cần thiết:

```env
# Convex
CONVEX_DEPLOYMENT=...
NEXT_PUBLIC_CONVEX_URL=...

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
```

### 4. Chạy dự án (Development Server)

Dự án sử dụng Turborepo để chạy song song các processes.

```bash
# Khởi động môi trường dev cho cả Web và Convex backend
pnpm dev

# Trong trường hợp cần chạy riêng Convex backend terminal:
npx convex dev
```

App sẽ chạy tại: `http://localhost:3000`

### 5. Build & Deployment

Build toàn bộ workspace để chuẩn bị deploy:

```bash
pnpm build
```

**Chiến lược Deploy (Deployment Strategy):**

- **Frontend & App Server:** Tối ưu tốt nhất trên [Vercel](https://vercel.com/) (Hỗ trợ Next.js cache, Streaming, và Middleware).
- **Backend:** Hosted tự động trên Convex serverless network.

## 🤝 Hướng dẫn Đóng góp (Contributing)

Vì hệ thống có nhiều module ràng buộc Type-safe, mọi Pull Request vui lòng đảm bảo:

1. Pass toàn bộ strict types (`pnpm run lint`).
2. Nếu khai báo component UI mới, hãy đặt vào `packages/ui` để tái sử dụng.
3. Nếu tạo hiệu ứng 3D mới, abstract logic camera/lighting vào `packages/three-engine` và logic business vào `packages/module-react`.

---

_Built with ❤️ by [Jok](https://github.com/Code-with-Jok) and contributors._
