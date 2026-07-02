# TicketBari — Online Ticket Booking Platform (MERN)

A complete Online Ticket Booking Platform where users can discover and book travel
tickets (Bus, Train, Launch, Plane). Three user roles — **User**, **Vendor**, and
**Admin** — each with their own dashboard.

> Built with **MongoDB · Express · React · Node.js (MERN)**, JWT auth, Stripe
> payments, imgbb image uploads, Tailwind CSS, Recharts and Swiper.js.

---

## Table of contents

1. [Key features](#key-features)
2. [Tech stack](#tech-stack)
3. [Project structure](#project-structure)
4. [Getting started (local)](#getting-started-local)
5. [Environment variables](#environment-variables)
6. [Default demo accounts](#default-demo-accounts)
7. [API reference](#api-reference)
8. [Frontend routes](#frontend-routes)
9. [Deployment notes](#deployment-notes)
10. [Submission template](#submission-template)

---

## Key features

### Authentication
- Email/password registration & login (JWT)
- Google social login (BetterAuth-style flow)
- Protected routes — logged-in users never redirect to /login on reload

### Public pages
- **Home**: Swiper hero slider, 6 admin-curated Advertisement tickets, 6–8 Latest
  tickets, Popular Routes, "Why Choose Us" sections
- **All Tickets**: search by From → To, filter by transport type, sort by price
  (Low → High / High → Low), pagination (6 per page)
- **Ticket Details**: full ticket info, live countdown to departure, "Book Now"
  modal (disabled if departed or sold out)
- **About / Contact** pages
- Custom 404 page for invalid routes

### User dashboard (role: `user`)
- User Profile (view + edit name / avatar)
- My Booked Tickets — 3-column grid with status badges (pending / accepted /
  rejected / paid) + countdown; "Pay Now" with Stripe once accepted
- Transaction History — table of all Stripe payments

### Vendor dashboard (role: `vendor`)
- Vendor Profile
- Add Ticket — form with image upload (imgbb), perks checkboxes, readonly vendor
  info; saved with verification status `pending`
- My Added Tickets — 3-column grid, Update / Delete actions (disabled if rejected)
- Requested Bookings — table with Accept / Reject buttons
- Revenue Overview — KPI cards (tickets added, sold, revenue) + bar chart and
  pie chart (Recharts)

### Admin dashboard (role: `admin`)
- Admin Profile
- Manage Tickets — approve / reject tickets submitted by vendors
- Manage Users — promote users to admin / vendor, mark vendor as fraud (auto
  hides their tickets and prevents future additions)
- Advertise Tickets — toggle homepage advertisement (max 6 tickets)

### Cross-cutting
- **JWT-protected APIs** with role-based authorization middleware
- **Dark / Light mode toggle** (persisted to localStorage)
- **Loading spinners** on every async fetch
- **Responsive** layout (mobile, tablet, desktop) with hamburger nav
- **Toast notifications** for every user action
- **Error page** for invalid routes

---

## Tech stack

| Layer       | Technology |
|-------------|-----------|
| Frontend    | React 18 + Vite + React Router v6 |
| Styling     | Tailwind CSS 3 (with dark mode) |
| Forms       | React Hook Form |
| Charts      | Recharts |
| Slider      | Swiper.js |
| Icons       | react-icons |
| Toasts      | react-hot-toast |
| HTTP        | axios |
| Payments    | Stripe (PaymentIntents via `@stripe/react-stripe-js`) |
| Backend     | Node.js + Express |
| Database    | MongoDB + Mongoose |
| Auth        | JWT (`jsonwebtoken`) + `bcryptjs` |
| Image upload| imgbb (client-side direct upload) |

---

## Project structure

```
ticket-booking-platform/
├── client/                # React + Vite frontend
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── api/axios.js
│   │   ├── components/   # Navbar, Footer, Layout, Spinner, TicketCard,
│   │   │                  # ProtectedRoute, DashboardLayout
│   │   ├── context/      # AuthContext, ThemeContext
│   │   ├── pages/
│   │   │   ├── Home.jsx AllTickets.jsx TicketDetails.jsx
│   │   │   ├── Login.jsx Register.jsx NotFound.jsx About.jsx Contact.jsx
│   │   │   ├── user/    # Profile, MyBookedTickets, TransactionHistory
│   │   │   ├── vendor/  # Profile, AddTicket, MyTickets, RequestedBookings, Revenue
│   │   │   └── admin/   # Profile, ManageTickets, ManageUsers, AdvertiseTickets
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
└── server/               # Node + Express backend
    ├── config/db.js
    ├── controllers/      # auth, ticket, booking, payment, user
    ├── middleware/       # auth (JWT), errorHandler
    ├── models/           # User, Ticket, Booking, Transaction
    ├── routes/           # auth, tickets, bookings, payments, users
    ├── utils/seed.js     # seeds admin/vendor/user + sample tickets
    ├── .env.example
    ├── index.js
    └── package.json
```

---

## Getting started (local)

### Prerequisites
- Node.js ≥ 18
- MongoDB (local or MongoDB Atlas)

### 1. Clone & install

```bash
# install server deps
cd server
npm install

# install client deps
cd ../client
npm install
```

### 2. Configure environment

```bash
# server
cp server/.env.example server/.env
# fill in MONGO_URI, JWT_SECRET, STRIPE_SECRET_KEY …

# client
cp client/.env.example client/.env
# fill in VITE_API_URL, VITE_STRIPE_PUBLISHABLE_KEY, VITE_IMGBB_API_KEY …
```

### 3. Seed the database (optional but recommended)

```bash
cd server
npm run seed
```

Creates three demo accounts and a few sample tickets.

### 4. Run

```bash
# terminal 1 — server
cd server
npm run dev   # http://localhost:5000

# terminal 2 — client
cd client
npm run dev   # http://localhost:5173
```

Open http://localhost:5173 and log in with any of the demo accounts below.

---

## Environment variables

### `server/.env`
| Key | Description |
|-----|-------------|
| `PORT` | Server port (default 5000) |
| `NODE_ENV` | `development` or `production` |
| `CLIENT_URL` | Comma-separated list of allowed CORS origins |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random string used to sign tokens |
| `JWT_EXPIRES_IN` | e.g. `7d` |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | For Google OAuth (optional) |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret (optional) |
| `IMGBB_API_KEY` | imgbb API key (used from client, server can verify if needed) |

### `client/.env`
| Key | Description |
|-----|-------------|
| `VITE_API_URL` | Base URL for the API (e.g. `http://localhost:5000/api`) |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `VITE_IMGBB_API_KEY` | imgbb API key for client-side uploads |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID |

---

## Default demo accounts

After running `npm run seed`:

| Role   | Email                  | Password     |
|--------|------------------------|--------------|
| Admin  | admin@ticketbari.test  | Admin123!    |
| Vendor | vendor@ticketbari.test | Vendor123!   |
| User   | user@ticketbari.test   | User123!     |

---

## API reference

Base URL: `/api`

### Auth
| Method | Endpoint       | Auth | Description |
|--------|----------------|------|-------------|
| POST   | `/auth/register` | —    | Register a new user |
| POST   | `/auth/login`    | —    | Login with email/password |
| POST   | `/auth/google`   | —    | Login/register via Google payload |
| GET    | `/auth/me`       | ✓    | Get current user |

### Tickets
| Method | Endpoint                  | Auth  | Description |
|--------|---------------------------|-------|-------------|
| GET    | `/tickets`                | —     | List approved tickets (search, filter, sort, pagination) |
| GET    | `/tickets/advertised`     | —     | Get up to 6 advertised tickets |
| GET    | `/tickets/latest`         | —     | Get 8 latest tickets |
| GET    | `/tickets/:id`            | —     | Get one ticket |
| POST   | `/tickets`                | vendor/admin | Add a new ticket |
| PUT    | `/tickets/:id`            | owner/admin  | Update ticket |
| DELETE | `/tickets/:id`            | owner/admin  | Delete ticket |
| GET    | `/tickets/vendor/mine`    | vendor       | Vendor's own tickets |
| GET    | `/tickets/admin/all`      | admin        | All tickets (any status) |
| PATCH  | `/tickets/:id/verify`     | admin        | Approve / reject ticket |
| PATCH  | `/tickets/:id/advertise`  | admin        | Toggle advertisement |

### Bookings
| Method | Endpoint                  | Auth  | Description |
|--------|---------------------------|-------|-------------|
| POST   | `/bookings`               | user  | Create a booking request |
| GET    | `/bookings/mine`          | user  | My bookings |
| GET    | `/bookings/requests`      | vendor| Booking requests for vendor's tickets |
| PATCH  | `/bookings/:id/accept`    | vendor| Accept a booking |
| PATCH  | `/bookings/:id/reject`    | vendor| Reject a booking |

### Payments
| Method | Endpoint                  | Auth | Description |
|--------|---------------------------|------|-------------|
| POST   | `/payments/create-intent` | user | Create Stripe PaymentIntent |
| POST   | `/payments/confirm`       | user | Confirm payment, mark booking paid, reduce ticket qty |
| GET    | `/payments/transactions`  | user | My transactions |

### Users
| Method | Endpoint                  | Auth  | Description |
|--------|---------------------------|-------|-------------|
| GET    | `/users/me`               | ✓     | Current user |
| PUT    | `/users/me`               | ✓     | Update profile |
| GET    | `/users/vendor/revenue`   | vendor| Revenue overview |
| GET    | `/users`                  | admin | List all users |
| PATCH  | `/users/:id/role`         | admin | Change user role |
| PATCH  | `/users/:id/fraud`        | admin | Toggle fraud flag on vendor |

---

## Frontend routes

| Path | Access | Description |
|------|--------|-------------|
| `/` | public | Home |
| `/tickets` | public | All tickets (search / filter / sort / pagination) |
| `/tickets/:id` | public | Ticket details + booking modal |
| `/about` `/contact` | public | Static pages |
| `/login` `/register` | public | Auth pages |
| `/dashboard` | auth | Role-based redirect |
| `/dashboard/profile` | auth | Profile (role-aware) |
| `/dashboard/bookings` | user | My booked tickets |
| `/dashboard/transactions` | user | Transaction history |
| `/dashboard/add-ticket` | vendor | Add ticket form |
| `/dashboard/my-tickets` | vendor | My added tickets |
| `/dashboard/requests` | vendor | Booking requests |
| `/dashboard/revenue` | vendor | Revenue overview |
| `/dashboard/manage-tickets` | admin | Approve / reject tickets |
| `/dashboard/manage-users` | admin | Manage users |
| `/dashboard/advertise` | admin | Toggle advertisement |
| `*` | public | 404 |

---

## Deployment notes

- **CORS**: `CLIENT_URL` on the server must list every domain the client is served
  from (comma-separated). Otherwise you will get CORS errors.
- **JWT on reload**: the client stores the token in `localStorage` and rehydrates
  the session via `GET /auth/me` on app load — logged-in users never get bounced
  to /login on reload.
- **MongoDB Atlas**: use a connection string with `?retryWrites=true&w=majority`.
- **Stripe**: in production, register a webhook for `payment_intent.succeeded`
  and call `markBookingPaid` from the webhook handler instead of trusting the
  client's `/payments/confirm` call.
- **Vercel / Netlify**: build the client with `npm run build` and serve `dist/`.
  Use a rewrite rule to send all unknown routes to `index.html` so deep links
  work (the `*` route handles them client-side).
- **Render / Railway / Fly.io**: deploy the server as a Node service with
  `npm start`, set `MONGO_URI` to your Atlas connection string.

---

## Submission template

```
Admin Email:    admin@ticketbari.test
Admin Password: Admin123!
Vendor Email:   vendor@ticketbari.test
Vendor Password:Vendor123!
Live Site Link: <your deployed URL>
Github Repository (server): <your server repo>
Github Repository (client): <your client repo>
```
