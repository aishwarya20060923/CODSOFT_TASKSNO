# DineDesk — Restaurant Ordering & Table Management Platform
### CodSoft Web Development Internship — Task 2

![DineDesk Platform](https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80)

**DineDesk** is an authentic Indian restaurant ordering and table management platform tailored with **Indian Rupee (₹)** pricing, **5% GST (CGST + SGST)** billing, **UPI / RuPay / Cash** payment simulations, and Indian culinary specialties.

---

## 🌟 Key Features

### 1. 🍽️ Customer Experience
- **Digital Desi Menu**: Browse 7+ rich categories (Starters & Chaat, Main Course, Royal Biryani, Artisan Pizza, Gourmet Burgers, Mithai & Desserts, Beverages & Lassi) with Indian Rupee (₹) pricing, dietary badges (Pure Veg, Spicy, Chef's Popular), and instant item detail modals.
- **Cart & Ordering**: Persistent cart system supporting both **Dine-In** (with table selection) and **Takeaway**, item quantity controls, custom cooking notes, and automatic **5% Restaurant GST (2.5% CGST + 2.5% SGST)** calculation.
- **Simulated Instant Checkout**: Multi-method checkout simulation (**UPI / QR via GPay / PhonePe**, **RuPay / Cards**, **Cash at Counter**) without requiring external payment keys.
- **5-Stage Live Order Tracking**: Real-time progress bar (`PLACED` $\to$ `ACCEPTED` $\to$ `PREPARING` $\to$ `READY` $\to$ `COMPLETED`) with auto-polling to reflect kitchen updates live.
- **Past Order History**: Full log of customer past orders with detailed receipt breakdowns and 1-click re-ordering.
- **Table Reservation System**: Reserve tables with date, time slot, guest counter, floor zone picker (Window, Indoor, Outdoor, Private), and **real-time double-booking collision prevention**.

### 2. 👨‍🍳 Kitchen Display System (KDS)
- **Live Kitchen Order Board**: Real-time tickets showing order number, elapsed time, dine-in table vs takeaway, item quantities, and highlighted dietary instructions.
- **Ticket Status Progression**: 1-click workflow actions:
  - `PLACED` $\to$ **Accept Order** (`ACCEPTED`)
  - `ACCEPTED` $\to$ **Start Cooking** (`PREPARING`)
  - `PREPARING` $\to$ **Mark Ready** (`READY`)
  - `READY` $\to$ **Complete Order** (`COMPLETED`)
- **Queue Filters**: Switch between *All Active*, *New Incoming*, *In Prep*, *Ready for Pickup*, and *Fulfilled History*.
- **Audio Chime**: Sound alert toggle for new incoming tickets.

### 3. 🛡️ Executive Administration
- **KPI Metrics & Analytics**: Total revenue, today's revenue, total orders, active reservations, customer count, and top 5 best-selling dishes.
- **Menu Management**: Full CRUD to add new dishes, modify prices, upload photos, edit descriptions, and toggle stock availability on the fly.
- **Category Taxonomy**: Add, edit, re-sequence, and delete menu categories.
- **Table Management**: Visual floor plan by zone (Window, Indoor, Outdoor, Private), manage guest capacities, and change maintenance states.
- **Reservation Manager**: Inspect party bookings, seat guests, update statuses (`CONFIRMED`, `SEATED`, `COMPLETED`, `CANCELLED`).
- **Master Order Book**: Itemized order tickets, billing totals, status overrides, and printable invoices.
- **Customer Directory**: Track registered patrons, lifetime food spend, and order history.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Frontend** | React 19, TypeScript |
| **Styling** | Tailwind CSS v4 |
| **ORM & DB** | Prisma ORM 6, PostgreSQL (Neon Serverless, isolated `dinedesk` schema) |
| **Icons** | Lucide React |
| **State** | React Context API + LocalStorage persistence |

---

## 🔑 Demo Login Credentials

You can log in manually or use the **Evaluation Quick Switch banner** at the top of every page for instant 1-click role switching:

| Role | Email | Password | Access / Dashboard |
|---|---|---|---|
| **Admin** | `admin@dinedesk.com` | `admin123` | `/admin` (Complete Management) |
| **Kitchen Staff** | `kitchen@dinedesk.com` | `kitchen123` | `/kitchen` (Kitchen Display System) |
| **Customer** | `customer@dinedesk.com` | `customer123` | `/menu`, `/reservations`, `/orders` |

---

## 🚀 How to Run the Project (VS Code / PowerShell)

### Prerequisites
- Node.js 18+ (tested on Node v24)
- Git & npm

### Step-by-Step Instructions

1. **Open PowerShell or Terminal** in the project directory:
   ```powershell
   cd "C:\Users\Lenovo\.gemini\antigravity\scratch\CODSOFT_TASK2_DINEDESK"
   ```

2. **Verify Environment Variables (`.env`)**:
   Ensure `.env` contains:
   ```env
   DATABASE_URL="postgresql://neondb_owner:npg_WGOq7PcZRLK1@ep-dark-tree-ay6sgcj9-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&schema=dinedesk"
   ```

3. **Install Dependencies** (already installed):
   ```powershell
   npm install
   ```

4. **Sync PostgreSQL Database & Generate Prisma Client**:
   ```powershell
   npx prisma generate
   npx prisma db push
   ```

5. **Seed Database with Demo Dishes, Tables, Orders & Bookings**:
   ```powershell
   npx prisma db seed
   ```

6. **Start the Development Server**:
   ```powershell
   npm run dev
   ```

7. **Open in Browser**:
    https://dinedesk-codsoft-task2.onrender.com

---

## 📁 Project Structure

```
CODSOFT_TASK2_DINEDESK/
├── prisma/
│   ├── schema.prisma              # PostgreSQL schema with 8 models & indexes
│   └── seed.ts                    # Realistic demo database seeder
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx     # Role login with 1-click evaluation shortcuts
│   │   │   └── register/page.tsx  # Customer registration
│   │   ├── (customer)/
│   │   │   ├── page.tsx           # Restaurant Landing Page
│   │   │   ├── menu/page.tsx      # Digital Menu with search & filters
│   │   │   ├── cart/page.tsx      # Cart & Dine-in/Takeaway selector
│   │   │   ├── track/[id]/        # 5-Stage Live Order Tracking
│   │   │   ├── order-confirmation/# Order confirmation & receipt
│   │   │   ├── orders/page.tsx    # Customer past orders & re-ordering
│   │   │   ├── reservations/      # Table booking with conflict prevention
│   │   │   └── profile/page.tsx   # User profile
│   │   ├── kitchen/
│   │   │   └── page.tsx           # Kitchen Display System (KDS)
│   │   ├── admin/
│   │   │   ├── page.tsx           # Admin Analytics & KPIs
│   │   │   ├── menu/page.tsx      # Food Menu CRUD & stock toggles
│   │   │   ├── categories/page.tsx# Category manager
│   │   │   ├── tables/page.tsx    # Table layouts & capacities
│   │   │   ├── reservations/page.tsx # Table booking manager
│   │   │   ├── orders/page.tsx    # Master order ledger
│   │   │   └── customers/page.tsx # Customer analytics
│   │   ├── api/                   # REST API routes
│   │   ├── layout.tsx             # Root layout with providers & banner
│   │   └── globals.css            # Tailwind CSS styling
│   ├── components/
│   │   ├── layout/                # Navbar, Footer, DemoUserBanner
│   │   ├── menu/                  # MenuCard, MenuItemModal, MenuFilters
│   │   ├── cart/                  # CheckoutModal
│   │   ├── orders/                # OrderTimeline, OrderReceipt
│   │   └── kitchen/               # KitchenOrderCard
│   ├── context/
│   │   ├── AuthContext.tsx        # Role-based authentication state
│   │   └── CartContext.tsx        # Persistent shopping cart state
│   ├── lib/
│   │   ├── prisma.ts              # Prisma client singleton
│   │   └── utils.ts               # Formatting & ID generators
│   └── types/
│       └── index.ts               # TypeScript domain interfaces
├── package.json
└── tsconfig.json
```
