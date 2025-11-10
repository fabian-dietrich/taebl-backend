import { Router, Request, Response, NextFunction } from "express";
import prisma from "../db/prisma";

const router = Router();

// GET /api/reservations - Get all reservations
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { date } = req.query;
    
    // Filter by date if provided
    const reservations = await prisma.reservation.findMany({
      where: date ? { date: date as string } : {},
      include: {
        table: true
      },
      orderBy: [
        { date: 'asc' },
        { timeSlot: 'asc' }
      ]
    });
    
    res.json(reservations);
  } catch (error) {
    next(error);
  }
});

// GET /api/reservations/:id - Get single reservation
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const reservation = await prisma.reservation.findUnique({
      where: { id: parseInt(id) },
      include: {
        table: true
      }
    });
    
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }
    
    res.json(reservation);
  } catch (error) {
    next(error);
  }
});

// POST /api/reservations - Create new reservation
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      customerName,
      customerPhone,
      numberOfGuests,
      date,
      timeSlot,
      duration = 120,
      specialRequests,
      tableId
    } = req.body;
    
    // Validation
    if (!customerName || !customerPhone || !numberOfGuests || !date || !timeSlot || !tableId) {
      return res.status(400).json({ 
        message: "Missing required fields: customerName, customerPhone, numberOfGuests, date, timeSlot, tableId" 
      });
    }
    
    // Check if table exists
    const table = await prisma.table.findUnique({
      where: { id: tableId }
    });
    
    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }
    
    // Check if table capacity is sufficient
    if (numberOfGuests > table.capacity) {
      return res.status(400).json({ 
        message: `Table ${table.tableNumber} has capacity ${table.capacity} but reservation is for ${numberOfGuests} guests` 
      });
    }
    
    // Check for conflicts (same table, date, overlapping time)
    const existingReservations = await prisma.reservation.findMany({
      where: {
        tableId,
        date,
        timeSlot,
        status: "Booked"
      }
    });
    
    if (existingReservations.length > 0) {
      return res.status(409).json({ 
        message: "This time slot is already booked for this table" 
      });
    }
    
    // Create reservation
    const reservation = await prisma.reservation.create({
      data: {
        customerName,
        customerPhone,
        numberOfGuests,
        date,
        timeSlot,
        duration,
        specialRequests,
        tableId
      },
      include: {
        table: true
      }
    });
    
    res.status(201).json(reservation);
  } catch (error) {
    next(error);
  }
});

// PUT /api/reservations/:id - Update reservation
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const {
      customerName,
      customerPhone,
      numberOfGuests,
      date,
      timeSlot,
      duration,
      specialRequests,
      status
    } = req.body;
    
    // Check if reservation exists
    const existing = await prisma.reservation.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!existing) {
      return res.status(404).json({ message: "Reservation not found" });
    }
    
    // Update reservation
    const reservation = await prisma.reservation.update({
      where: { id: parseInt(id) },
      data: {
        ...(customerName && { customerName }),
        ...(customerPhone && { customerPhone }),
        ...(numberOfGuests && { numberOfGuests }),
        ...(date && { date }),
        ...(timeSlot && { timeSlot }),
        ...(duration && { duration }),
        ...(specialRequests !== undefined && { specialRequests }),
        ...(status && { status })
      },
      include: {
        table: true
      }
    });
    
    res.json(reservation);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/reservations/:id - Delete/Cancel reservation
router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    // Check if reservation exists
    const existing = await prisma.reservation.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!existing) {
      return res.status(404).json({ message: "Reservation not found" });
    }
    
    // Delete reservation
    await prisma.reservation.delete({
      where: { id: parseInt(id) }
    });
    
    res.json({ message: "Reservation deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;