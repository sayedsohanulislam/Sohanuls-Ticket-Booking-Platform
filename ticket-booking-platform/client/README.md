# TicketBari — Client (React + Vite)

React frontend for the Online Ticket Booking Platform. See the root `README.md`
for the full feature list and architecture overview.

## Quick start

```bash
npm install
cp .env.example .env       # then edit values
npm run dev                # http://localhost:5173
npm run build              # production build → dist/
```

## Notes

- The frontend talks to the Express backend defined by `VITE_API_URL`
  (default `http://localhost:5000/api`).
- Dark mode toggle persists to `localStorage` (`tb_theme`).
- JWT is stored in `localStorage` (`tb_token`) and rehydrated on every page
  load via `GET /auth/me`, so logged-in users never get bounced to `/login`
  on reload.
- Image uploads go directly to imgbb from the browser using
  `VITE_IMGBB_API_KEY`.
