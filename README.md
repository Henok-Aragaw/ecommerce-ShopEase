# 🛍️ Next.js eCommerce App

A modern eCommerce web application** built with **Next.js App Router**, **TypeScript**, and **Tailwind CSS**, showcasing real-world frontend development practices like product browsing, CRUD operations, dark/light theming, and smooth state management.

---

## 🚀 Tech Stack

- **Framework:** [Next.js (App Router)](https://nextjs.org)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Library:** [Shadcn/UI](https://ui.shadcn.com/)
- **Icons:** [Lucide Icons](https://lucide.dev/)
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/)
- **Data Fetching:** [React Query](https://tanstack.com/query/latest)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **Notifications:** [Sonner](https://ui.shadcn.com/docs/components/sonner)
- **Fake API:** [DummyJSON](https://dummyjson.com/)
- **Unique IDs:** [UUID](https://www.npmjs.com/package/uuid)

## ✨ Features

### 🏠 Product Listing Page (`/products`)
- Fetches data from [DummyJSON API](https://dummyjson.com/products)
- Displays each product’s **title**, **price**, **rating**, **category**, and **thumbnail**
- Implements **Pagination** for smooth, lazy-loaded browsing (`?limit=10&skip=10`)
- Includes a responsive **search bar**
- Fully interactive with **local CRUD operations** (create, edit, delete)
- Uses **React Query + Axios** for cached, efficient data fetching
- **Redux Toolkit** for managing UI and global app state

### 📄 Product Details Page (`/products/[id]`)
- Displays product details including **brand**, **stock**, **price**, **description**, and **rating**
- Supports **editing via Shadcn dialog**
- Updates handled locally for smooth UX
- Styled consistently across dark/light modes

### ❤️ Favorites (Sheet Drawer)
- Favorites feature built using **Shadcn Sheet component**
- Opens as a **slide-in drawer** no separate `/favorites` route
- Allows users to **favorite/unfavorite** instantly
- Managed globally via **Redux Toolkit**
- Favorites state persisted locally for reliability
- Real-time badge count on Navbar

### 🎨 Hero Section (Interactive)
- Built as **`Hero.tsx`** and **`ModernHeroSection.tsx`** components
- Features a clean, responsive design with call-to-action elements
- **Supports drag-and-drop image interaction** for a dynamic, hands-on user experience
- Adjusts visuals automatically based on the app’s dark/light theme

### ➕ Create Product
- Simple form with fields: `title`, `description`, `price`, `stock`, `brand`, `category`
- Uses **UUID** to generate fake local product IDs
- Local addition to list (since DummyJSON API is read-only)
- Confirmation via **toast notifications**

### ✏️ Edit Product
- Pre-filled form within a **Shadcn dialog**
- Updates reflected instantly in the UI
- Redux integration for product state management
- Consistent styling in both dark and light themes

### ❌ Delete Product
- Confirmation dialog before removal
- Deletes products locally with instant feedback
- Clean toast notifications for success and cancellation

### 🌙 Dark & Light Mode
- Implemented using **Redux Toolkit** for global theme state
- Theme preference persisted via `localStorage`
- Every UI component (cards, modals, dialogs, buttons) supports both modes
- Smooth, consistent, flicker-free theme transitions

### 🔐 Authentication
- Mock authentication flow under `/sign-in`
- Managed via **Redux Toolkit**
- Simulates login/logout behavior locally
- Provides gated access to certain pages

---

## 🔗 API Endpoints Used

| Description | Endpoint |
|--------------|-----------|
| All products | `GET /products` |
| Search products | `GET /products/search?q=phone` |
| Single product | `GET /products/:id` |
| All categories | `GET /products/categories` |
| Products by category | `GET /products/category/:category` |
| Create product | `POST /products/add` |
| Update product | `PUT /products/:id` |
| Delete product | `DELETE /products/:id` |

> ⚠️ **Note:** DummyJSON is read-only.  
> All create, update, and delete actions are handled locally for demonstration.

---

## 🧩 Folder Structure

src/
├── app/
│ ├── (main)/
│ │ └── products/
│ │ ├── page.tsx # Product listing with infinite scroll
│ │ └── [id]/page.tsx # Product detail and edit dialog
│ ├── (auth)/
│ │ └── sign-in/page.tsx # Mock authentication page
│ └── layout.tsx # Global app layout
│
├── components/
│ ├── Navbar.tsx # Main navigation bar with dark mode toggle
│ ├── Hero.tsx # Hero section for landing visuals
│ ├── ModernHeroSection.tsx # Modern styled hero variation
│ ├── Provider.tsx # React Query + Redux providers
│ └── ui/ # Shadcn UI components
│
├── hooks/
│ ├── use-product.ts # Fetch single product
│ ├── use-create-product.ts # Add product mutation logic
│ └── queries/
│ └── useProducts.ts # Infinite scroll + product fetching
│
├── lib/
│ ├── axios.ts # Axios base configuration
│ └── utils.ts # Helper utilities and constants
│
├── store/
│ ├── index.ts # Redux store configuration
│ └── slices/
│ ├── themeSlice.ts # Dark/light mode management
│ ├── favoritesSlice.ts # Favorites state
│ |
│ └── authSlice.ts # Mock authentication state
│
├── types/
│ └── product.ts # Product type definitions
└── styles/
└── globals.css # Tailwind and base styles


---

## ⚙️ Architecture Overview

- **Next.js App Router** for modular, route-based structure  
- **React Query** handles API data fetching and caching  
- **Redux Toolkit** manages UI state (favorites, theme, auth, products)  
- **Axios** centralizes API requests in `/lib/axios.ts`  
- **Shadcn UI + Tailwind CSS** create a clean, responsive interface  
- **Lucide Icons** add modern, consistent iconography  
- **Sonner** provides smooth toast notifications
- **Drag-and-drop** image interactions make the Hero section feel alive

---

## 🧠 Core Concepts Demonstrated

- Data fetching and caching with **React Query + Axios**
- Global state with **Redux Toolkit**
- Local product CRUD handling when API is read-only
- Responsive layout using **Tailwind CSS**
- **Pagination** UX for large datasets
- Theme toggling via Redux and persisted state
- Dialogs and drawers powered by **Shadcn UI**
- Type-safe development with **TypeScript**
- Interactive **drag-and-drop Hero section**

---

## 🛠️ Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Henok-Aragaw/ecommerce-ShopEase.git
cd ecommerce-ShopEase

pnpm install

NEXT_PUBLIC_API_URL=" "

pnpm run dev