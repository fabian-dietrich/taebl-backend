# TAEBL Backend - Restaurant Table Booking API

A REST API for managing restaurant table reservations built with Express.js, TypeScript, Prisma, and PostgreSQL.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Dev Tools:** Nodemon, ts-node

## Features

- Full CRUD operations for reservations model
- GET only operations for tables
- 12 pre-configured restaurant tables
- Simplified date system (today/tomorrow)

## API Endpoints

### Tables

- `GET /api/tables` - Get all tables
- `GET /api/tables/:id` - Get table by ID with reservations
- `GET /api/tables/available?date=YYYY-MM-DD&timeSlot=HH:MM&guests=N` - Get available tables

### Reservations

- `GET /api/reservations` - Get all reservations (optional: `?date=YYYY-MM-DD`)
- `GET /api/reservations/:id` - Get reservation by ID
- `POST /api/reservations` - Create new reservation
- `PUT /api/reservations/:id` - Update reservation
- `DELETE /api/reservations/:id` - Delete reservation

### Create Reservation Body

```json
{
  "customerName": "John Doe",
  "customerPhone": "+1234567890",
  "numberOfGuests": 4,
  "date": "2025-11-09",
  "timeSlot": "19:00",
  "duration": 120,
  "specialRequests": "Window seat preferred",
  "tableId": 5
}
```

## Database Schema

### Table Model

- `id` - Auto-increment primary key
- `tableNumber` - Unique table identifier (1-12)
- `capacity` - Number of seats (2, 4, or 6)
- `location` - Window, Center, or Patio

### Reservation Model

- `id` - Auto-increment primary key
- `customerName` - Guest name
- `customerPhone` - Contact number
- `numberOfGuests` - Party size
- `date` - Reservation date (YYYY-MM-DD)
- `timeSlot` - Time slot (HH:MM format, 30-min intervals)
- `duration` - Length in minutes (default: 120)
- `specialRequests` - Optional notes
- `status` - "Booked" or "Cancelled"
- `tableId` - Foreign key to Table

## Development

```bash
# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# View database in browser
npx prisma studio
```

## Project Structure

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

## Author

Fabian Dietrich - Ironhack Bootcamp WDFT Sept 2025
