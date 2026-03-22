# Cherry & Cream — Smart QR Ordering System 🍒

A premium, full-stack restaurant management and ordering platform built for modern dining experiences. This system enables contactless ordering, real-time kitchen fulfillment, and comprehensive admin analytics.

## 🌟 Key Features

### 🤳 Digital Customer Experience
- **Contactless QR Entry**: Table-specific QR codes for instant menu access.
- **Premium Digital Menu**: Visually rich interface with categorization and live search.
- **Real-time Order Tracking**: Live status updates for customers as their food is prepared.
- **Secure Payments**: Integrated with Razorpay for UPI, Cards, and Netbanking.

### 👨‍🍳 Operational Excellence
- **Kitchen Display System (KDS)**: Real-time dashboard for kitchen staff to manage and update orders.
- **Dynamic QR Generator**: On-the-fly generation and export of table-specific ordering URLs.
- **Menu Management**: Full CRUD controls with instant availability toggles for items.

### 📊 Business Intelligence
- **Admin Dashboard**: Live metrics for revenue, order volume, and kitchen performance.
- **Staff Performance**: Analytics for preparation times and service efficiency.

## 🛠 Tech Stack
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Backend**: [Supabase](https://supabase.com/) (Realtime, Auth, Database)
- **Styling**: Vanilla CSS with Tailwind-inspired design tokens
- **Icons**: [Lucide React](https://lucide.dev/)
- **Payments**: [Razorpay](https://razorpay.com/)

## 🚀 Getting Started

### 1. Environment Setup
Create a `.env.local` file with your credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key
```

### 2. Installation
```bash
npm install
npm run dev
```

### 3. Database Schema
Ensure your Supabase project has the following tables:
- `categories`
- `menu_items`
- `orders`
- `order_items`
- `profiles` (for admin staff)

<!-- ## 🔐 Demo Credentials
- **Admin Email**: `manager@cherrycream.com`
- **Password**: `CherryAdmin2024!` -->

---
Developed for **Aryan Seth** — Redefining Digital Dining.
