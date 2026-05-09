# Next DocAI — Intelligent Document Processing Platform

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)

**Next DocAI** (also known as OCR Invoice) is a state-of-the-art Intelligent Document Processing (IDP) platform. Built with the latest Next.js 16 and React 19, it provides a seamless experience for uploading, processing, and extracting structured data from unstructured documents like invoices and receipts using OCR and AI.

---

## 🚀 Key Features

- **High-Speed OCR Extraction**: Automated extraction of header fields and dynamic line-items.
- **Real-time Processing**: Integrated with Socket.io for live progress tracking of document jobs.
- **Advanced File Management**: Centralized repository for uploaded source files and processed documents.
- **Intelligent Dashboard**: Comprehensive analytics and overview of processing status.
- **Secure Authentication**: Role-based access control (RBAC) for Admin and Operator roles.
- **Modern UI/UX**: Built with Tailwind CSS 4 and Shadcn/UI for a premium, responsive experience.

---

## 🛠️ Tech Stack

### Core
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

### State & Data
- **Data Fetching**: [TanStack Query v5](https://tanstack.com/query/latest)
- **Validation**: [Zod](https://zod.dev/)
- **Forms**: [React Hook Form](https://react-hook-form.com/)
- **API Client**: Axios

### UI & Styling
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Components**: [Shadcn/UI](https://ui.shadcn.com/) / Radix UI
- **Icons**: Lucide React
- **Themes**: Next Themes

### Real-time & Utilities
- **WebSockets**: Socket.io-client
- **Toasts**: Sonner

---

## 📦 Getting Started

### Prerequisites
- Node.js 18.x or later
- npm / pnpm / yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/next-docai.git
   cd next-docai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file based on `.env.example`:
   ```bash
   cp .env.example .env.local
   ```
   Fill in the required values:
   ```env
   NEXT_PUBLIC_API_URL=your_api_endpoint
   NEXT_PUBLIC_MOCK_API=false
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🏗️ Architecture

This project follows a **Feature-Based Architecture**, ensuring high maintainability and scalability:

- `app/`: Next.js App Router (Routing and Layouts).
- `features/`: Domain-specific modules (Auth, Dashboard, Documents, Files, etc.).
- `shared/`: Reusable components, hooks, utilities, and types.
- `public/`: Static assets.

Each feature module is self-contained, typically containing its own components, hooks, and services.

---

## 📜 Available Scripts

- `npm run dev`: Runs the app in development mode.
- `npm run build`: Builds the production application.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint to check for code quality.

---

## 📄 License

This project is proprietary. All rights reserved.
