# Taebl — Backend

REST API for [Taebl](https://taebl.fabiandietri.ch), a restaurant reservation management interface. Serves table and reservation data for a 12-table restaurant with half-hour booking slots.

**Frontend repo:** [taebl-frontend](https://github.com/fabian-dietrich/taebl-frontend)

## Live demo

[taebl.fabiandietri.ch](https://taebl.fabiandietri.ch)

> The live site runs in **demo mode** — the frontend loads seed data from the API on page load, then handles all create/edit/delete operations client-side. No write requests reach the backend from the demo.

## Tech stack

Node.js, Express 5, TypeScript, Prisma, PostgreSQL.

## API endpoints

**Tables** (`/api/tables`)
- `GET /` — list all tables, sorted by table number
- `GET /:id` — single table with its reservations
- `GET /available?day=today&timeSlot=19:00&guests=4` — tables with sufficient capacity and no booking conflict

**Reservations** (`/api/reservations`)
- `GET /` — list all reservations (optional filter: `?day=today`)
- `GET /:id` — single reservation with table details
- `POST /` — create reservation (validates capacity, checks conflicts)
- `PUT /:id` — update reservation fields
- `DELETE /:id` — delete reservation

### Create/update reservation body

```json
{
  "customerName": "Jesse Pinkman",
  "customerPhone": "+1234567890",
  "numberOfGuests": 4,
  "day": "today",
  "timeSlot": "19:00",
  "duration": 120,
  "specialRequests": "Window seat preferred",
  "tableId": 5
}
```

## Data model

**Table** — 12 pre-seeded tables with capacity (2, 4, or 6 seats) and location (Window, Center, or Patio).

**Reservation** — linked to a table via foreign key. Uses a simplified day system (`today`/`tomorrow`) with half-hour time slots from 17:00 to 22:30. Duration defaults to 120 minutes. Status is `Booked` by default.

## Local setup

```
bun install
cp .env.example .env   # set DATABASE_URL to a PostgreSQL connection string
bun run dev             # starts on port 5005 with watch mode
```

### Seeding

```
bun run seed              # creates 12 tables
bun run seed:reservations # adds 6 sample reservations
bun run db:seed           # runs both
```

## Project structure

```
taebl-backend/
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── seed-reservations.ts
├── db/
│   └── prisma.ts
├── routes/
│   ├── index.routes.ts
│   ├── table.routes.ts
│   └── reservation.routes.ts
├── config/
│   └── index.ts
├── error-handling/
│   └── index.ts
├── app.ts
└── server.ts
```
