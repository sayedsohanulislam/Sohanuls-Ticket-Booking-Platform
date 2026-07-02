# 🚌 TicketBari — Premium Online Ticket Booking Platform

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2015-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Backend-Express%204-lightgrey?style=for-the-badge&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Stripe](https://img.shields.io/badge/Payments-Stripe-indigo?style=for-the-badge&logo=stripe)](https://stripe.com/)
[![Framer Motion](https://img.shields.io/badge/Animations-Framer%20Motion-pink?style=for-the-badge&logo=framer-motion)](https://www.framer.com/motion/)

A complete, feature-rich **Online Ticket Booking Platform** where users can discover and book tickets for **Buses, Trains, Launches, and Flights** across Bangladesh. The platform features three distinct user roles—**User (Traveler)**, **Vendor**, and **Admin**—each with their own secure, personalized dashboards.

---

## 🌟 Premium Features

### 🔐 Authentication & Security
- **Next.js & JWT-Protected Routes**: Role-based routing guards ensure secure pages. Logged-in users are kept in their dashboard session upon browser refreshes.
- **Real Google OAuth**: Full popup login integration securely validated against Google userinfo APIs. Includes a fallback mechanism for developer testing.
- **Quick Developer Login**: High-speed login buttons on the login card to instantly authenticate as Admin, Vendor, or Traveler with one click.

### 🚌 Interactive Booking Experience
- **Live Seat Map Grid**: Toggling seat maps for Bus travel lets users visually reserve specific seats, driving booking counts dynamically.
- **Real-Time Countdown**: Display of hours/minutes left until departure time.
- **Paid Ticket PDF Print**: Generate and print clean, professional PDF receipts complete with barcode generators.

### 🎨 Visual & UI Polish
- **Framer Motion Animations**: Sleek landing page entries, hover-lift cards, and smooth state transitions.
- **Theme Persistance**: Fully integrated Dark / Light mode toggle saved across browser reloads.
- **Statistics Section & Swiper Slider**: Live statistics counter and dynamic traveler review carousel.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 15 (App Router), React 18, React Router v6, React Hook Form |
| **Styling & UI** | Tailwind CSS 3, Framer Motion, Swiper.js, React Icons, React Hot Toast |
| **Charts** | Recharts (dynamic revenue logs, bar and pie graphs) |
| **Payments** | Stripe (PaymentIntents via `@stripe/react-stripe-js`) |
| **Backend** | Node.js + Express + JWT (`jsonwebtoken`) |
| **Database** | MongoDB + Mongoose ODM |
| **Image Upload**| imgbb (direct client-side file upload) |

---

## 📂 Project Structure

```text
ticket-booking-platform/
├── client/                # Next.js App Router Frontend
│   ├── app/               # Next.js App Router root layout & catch-all
│   ├── public/            # Favicon and realistic category images (bus, train, launch, plane)
│   ├── src/
│   │   ├── api/axios.js   # SSR-safe axios instance with localStorage gating
│   │   ├── components/    # Navbar, Footer, Loading Spinner, Ticket Cards
│   │   ├── context/       # AuthContext, ThemeContext
│   │   └── views/         # Role-specific dashboard pages (User, Vendor, Admin)
│   └── next.config.mjs    # Next.js bundler config
└── server/                # Express API Backend
    ├── config/db.js       # MongoDB connection with local fallback failover
    ├── controllers/       # Auth, ticket, booking, payment logic
    ├── middleware/        # JWT validator & Express error handler
    ├── models/            # Mongoose Schemas (User, Ticket, Booking, Transaction)
    ├── routes/            # Express routers
    └── utils/seed.js      # Populates database with matching assets & credentials
```

---

## 🚀 Getting Started (Local)

### 1. Installation
Install dependencies for both client and server:
```bash
# Install backend packages
cd server
npm install

# Install frontend packages
cd ../client
npm install
```

### 2. Seeding the Database
To populate your local MongoDB database with mock data and real category images:
```bash
cd server
npm run seed
```

### 3. Running Locally
Start both development environments:
```bash
# Terminal 1 — Server (runs on http://localhost:5000)
cd server
npm run dev

# Terminal 2 — Client (runs on http://localhost:3000)
cd client
npm run dev
```

---

## 🔑 Default Accounts

After running the seeder script, you can log in instantly using the **Quick Developer Login** buttons or with these credentials:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@ticketbari.test` | `Admin123!` |
| **Vendor** | `vendor@ticketbari.test` | `Vendor123!` |
| **User** | `user@ticketbari.test` | `User123!` |

---

## 📡 API Reference

Base URL: `/api`

### Auth Endpoints
- `POST /auth/register` — Register traveler
- `POST /auth/login` — Login with credentials
- `POST /auth/google` — Secure access token validator
- `GET /auth/me` — Retrieve active session

### Ticket Endpoints
- `GET /tickets` — Query approved listings (search, filter, sort, paginate)
- `GET /tickets/advertised` — Get up to 6 advertised listings
- `GET /tickets/latest` — Get latest 8 listings
- `POST /tickets` — Create a pending ticket (Vendor/Admin)
- `PUT /tickets/:id` — Update ticket details (Owner/Admin)

### Booking Endpoints
- `POST /bookings` — Initiate booking request
- `GET /bookings/my-bookings` — Traveler booking list
- `DELETE /bookings/:id/cancel` — Cancel booking before acceptance
- `PUT /bookings/:id/status` — Accept/Reject requests (Vendor)

### Payment Endpoints
- `POST /payments/create-intent` — Generate Stripe PaymentIntent
- `POST /payments/confirm` — Save successful transactions
- `GET /payments/transactions` — Transaction logs (Traveler)
