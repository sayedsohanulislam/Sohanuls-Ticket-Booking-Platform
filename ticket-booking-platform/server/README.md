# TicketBari — Server (Node.js + Express + MongoDB)

REST API for the Online Ticket Booking Platform. See the root `README.md` for the
full feature list and architecture overview.

## Quick start

```bash
npm install
cp .env.example .env       # then edit values
npm run seed               # optional: seeds admin/vendor/user + sample tickets
npm run dev                # http://localhost:5000
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start with nodemon (auto-reload) |
| `npm start`   | Start in production |
| `npm run seed` | Seed demo data |

## Notable middleware

- `middleware/auth.js` — `protect` (verifies JWT) + `authorize(...roles)` (role gate)
- `middleware/errorHandler.js` — central error handler + `asyncHandler` wrapper
