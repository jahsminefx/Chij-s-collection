# CHI J'S Collection

> **Luxury, Contemporary Fashion & Curated Footwear**  
> A single-vendor, mobile-first fashion storefront and administrative portal powered by React 18, Vite, Tailwind CSS, Express ESM, PostgreSQL, and Prisma ORM.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Folder Structure](#folder-structure)
4. [Prerequisites](#prerequisites)
5. [Environment Configuration](#environment-configuration)
6. [Database Setup & Seeding](#database-setup--seeding)
7. [Running the Application](#running-the-application)
8. [Admin Portal & Default Credentials](#admin-portal--default-credentials)
9. [Core Flows & Architecture](#core-flows--architecture)
10. [Media & Image Uploads](#media--image-uploads)

---

## Project Overview

CHI J'S Collection is an editorial, high-touch e-commerce storefront designed for direct customer conversion. Rather than introducing unnecessary friction with customer registrations, passwords, and multi-step carts, the shopping journey is streamlined:

**Discover → Browse → View Details → Select Size → Order via WhatsApp or Phone Call**

The store owner has access to a secure admin dashboard to independently manage products, stock states, sizes, categories, hero announcements, store policies, and WhatsApp ordering templates without editing code.

---

## Technology Stack

### Frontend
- **React 18** (Plain JSX, No TypeScript)
- **Vite 5** (Ultra-fast build and HMR)
- **Tailwind CSS 3** (Custom editorial design tokens & 4:5 fashion aspect ratios)
- **React Router DOM 6** (Client-side routing)
- **Axios** (Centralized API client with cookie credentials)
- **Lucide React** (Clean, minimalist icons)

### Backend
- **Node.js** (ES Modules `"type": "module"`)
- **Express.js** (REST API framework)
- **PostgreSQL 16** (Relational database)
- **Prisma ORM** (Schema modelling, migrations & type safety)
- **JWT & HTTP-Only Cookies** (Secure authentication)
- **bcryptjs** (Password hashing)
- **Multer** (Multipart image uploads with MIME & size validation)
- **Slugify** (SEO-friendly URL slugs)

---

## Folder Structure

```text
chi-js-collection/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/         # Announcement, Header, MobileDrawer, Footer, Toast, SearchModal
│   │   │   ├── storefront/     # Hero, Categories, ProductCard, ProductGrid, Gallery, SizeSelector
│   │   │   └── admin/          # Sidebar, MobileHeader, ProductTable, ImageUploader, SettingsTabs
│   │   ├── context/            # AuthContext, StoreContext
│   │   ├── layouts/            # StorefrontLayout, AdminLayout, ProtectedRoute
│   │   ├── pages/
│   │   │   ├── storefront/     # Home, Shop, Category, ProductDetail, About, Contact, Policies
│   │   │   └── admin/          # Login, Dashboard, Products, ProductCreate, ProductEdit, Categories, Settings
│   │   ├── services/           # Centralized Axios API services
│   │   ├── utils/              # WhatsApp deep-link builder, currency & date formatters
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/
│   ├── prisma/
│   │   ├── schema.prisma       # Prisma models & relations
│   │   └── seed.js             # Database seeder (Admin, Categories, Sample Products)
│   ├── src/
│   │   ├── config/             # Prisma client connection
│   │   ├── controllers/        # Auth, Product, Category, Store, Upload controllers
│   │   ├── middleware/         # Admin auth guard, Multer validator, error handler
│   │   ├── routes/             # REST endpoints (/api/auth, /api/products, etc.)
│   │   ├── utils/              # JWT cookies, slugify
│   │   └── server.js           # Express app configuration & static server
│   ├── uploads/                # Persistent image storage
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── package.json                # Root orchestration with concurrently
├── .env.example
├── .gitignore                  # Ignores .md files except README.md
└── README.md
```

---

## Prerequisites

- **Node.js**: v18+ (Tested on v22.14.0)
- **npm**: v9+ (Tested on v10.9.2)
- **PostgreSQL**: v14+ running locally on port `5432`

---

## Environment Configuration

Copy `.env.example` in both the root and `server/` directories:

```bash
cp .env.example server/.env
```

### Server `.env` parameters:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/chijs_db?schema=public
JWT_SECRET=your_secret_key_here
ADMIN_EMAIL=admin@chijscollection.com
ADMIN_PASSWORD=admin123456
ADMIN_NAME=CHI J'S Owner
UPLOAD_DIR=uploads
```

---

## Database Setup & Seeding

1. Ensure the PostgreSQL database `chijs_db` exists:
   ```sql
   CREATE DATABASE chijs_db;
   ```

2. Generate Prisma Client and sync tables:
   ```bash
   npm run prisma:generate --prefix server
   npm run prisma:migrate --prefix server
   ```

3. Seed initial data (Admin user, default categories, store settings, and sample products):
   ```bash
   npm run seed --prefix server
   ```

---

## Running the Application

### Development (Concurrently starts Client & Server):
```bash
npm run dev
```
- **Storefront Client**: [http://localhost:5173](http://localhost:5173)
- **Backend API Server**: [http://localhost:5000](http://localhost:5000)

### Run individually:
```bash
npm run dev:server  # Runs Express with nodemon on port 5000
npm run dev:client  # Runs Vite dev server on port 5173
```

### Production Build:
```bash
npm run build       # Builds optimized production bundle in client/dist
```

---

## Admin Portal & Default Credentials

Navigate to [http://localhost:5173/admin/login](http://localhost:5173/admin/login)

- **Default Email**: `admin@chijscollection.com`
- **Default Password**: `admin123456`

*(Admin credentials can be customized via `server/.env` or updated in the database).*

### Admin Features
- **Dashboard**: Live counts of total products, categories, in-stock items, and sold-out items.
- **Product Management**: Create, edit, publish/unpublish, and toggle stock with one click.
- **Category Management**: Create and manage categories with safe deletion safeguards.
- **Store Settings**: Real-time control of store contact details, opening hours, delivery info, size exchange policy, announcement bar, and WhatsApp message templates.

---

## Core Flows & Architecture

### WhatsApp Direct Ordering Flow
1. Customer navigates to a product page (`/products/:slug`).
2. Customer selects their size (`XS`, `S`, `M`, `L`, `XL`, or shoe size).
3. Clicking **Order via WhatsApp** generates a dynamic link:
   ```text
   https://wa.me/2348123456789?text=Hello%20CHI%20J'S%20Collection%20%F0%9F%91%8B%0A%0AI'd%20like%20to%20order%3A%0A%0AProduct%3A%20Classic%20Noir%20Linen%20Shirt%0ASize%3A%20L%0APrice%3A%20%E2%82%A626%2C500%0A%0AProduct%20Link%3A%0Ahttp%3A%2F%2Flocalhost%3A5173%2Fproducts%2Fclassic-noir-linen-shirt%0A%0APlease%20confirm%20availability.%0A%0AThank%20you!
   ```
4. The store owner receives the exact product name, chosen size, price, and direct link.

### Sold-Out Handling
- Sold out items remain accessible for search engines and direct links.
- The size selector and ordering buttons are disabled and replaced with an inquiry action.

---

## Media & Image Uploads

- Images are uploaded via Multer with validation for MIME types (`image/jpeg`, `image/png`, `image/webp`) and file size limits (5MB).
- Uploaded files are saved to `server/uploads/` and served statically at `/uploads/<filename>`.
- The database stores only clean relative paths, never heavy Base64 strings.
