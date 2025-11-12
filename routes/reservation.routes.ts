import { Router, Request, Response, NextFunction } from "express";
import prisma from "../db/prisma";

const router = Router();

// GET all reservations
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { day } = req.query;

    // filter by day
    const reservations = await prisma.reservation.findMany({
      where: day ? { day: day as string } : {},
      include: {
        table: true,
      },
      orderBy: [{ day: "asc" }, { timeSlot: "asc" }],
    });

    res.json(reservations);
  } catch (error) {
    next(error);
  }
});

// GET single reservation
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const reservation = await prisma.reservation.findUnique({
      where: { id: parseInt(id) },
      include: {
        table: true,
      },
    });

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.json(reservation);
  } catch (error) {
    next(error);
  }
});

// POST new reservation
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      customerName,
      customerPhone,
      numberOfGuests,
      day,
      timeSlot,
      duration = 120,
      specialRequests,
      tableId,
    } = req.body;

    //validate
    if (
      !customerName ||
      !customerPhone ||
      !numberOfGuests ||
      !day ||
      !timeSlot ||
      !tableId
    ) {
      return res.status(400).json({
        message:
          "Missing required fields: customerName, customerPhone, numberOfGuests, day, timeSlot, tableId",
      });
    }

    // check if table exists
    const table = await prisma.table.findUnique({
      where: { id: tableId },
    });

    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    // check if table capacity is sufficient
    if (numberOfGuests > table.capacity) {
      return res.status(400).json({
        message: `Table ${table.tableNumber} has capacity ${table.capacity} but reservation is for ${numberOfGuests} guests`,
      });
    }

    // check for conflicts (same table, day, overlapping time)
    const existingReservations = await prisma.reservation.findMany({
      where: {
        tableId,
        day,
        timeSlot,
        status: "Booked",
      },
    });

    if (existingReservations.length > 0) {
      return res.status(409).json({
        message: "This time slot is already booked for this table",
      });
    }

    // create reservation
    const reservation = await prisma.reservation.create({
      data: {
        customerName,
        customerPhone,
        numberOfGuests,
        day,
        timeSlot,
        duration,
        specialRequests,
        tableId,
      },
      include: {
        table: true,
      },
    });

    res.status(201).json(reservation);
  } catch (error) {
    next(error);
  }
});

// PUT / update reservation
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const {
      customerName,
      customerPhone,
      numberOfGuests,
      day,
      timeSlot,
      duration,
      specialRequests,
      status,
    } = req.body;

    // check if reservation exists
    const existing = await prisma.reservation.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existing) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    // update reservation
    const reservation = await prisma.reservation.update({
      where: { id: parseInt(id) },
      data: {
        ...(customerName && { customerName }),
        ...(customerPhone && { customerPhone }),
        ...(numberOfGuests && { numberOfGuests }),
        ...(day && { day }),
        ...(timeSlot && { timeSlot }),
        ...(duration && { duration }),
        ...(specialRequests !== undefined && { specialRequests }),
        ...(status && { status }),
      },
      include: {
        table: true,
      },
    });

    res.json(reservation);
  } catch (error) {
    next(error);
  }
});

// DELETE / cancel reservation
router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      // check if reservation exists
      const existing = await prisma.reservation.findUnique({
        where: { id: parseInt(id) },
      });

      if (!existing) {
        return res.status(404).json({ message: "Reservation not found" });
      }

      // delete reservation
      await prisma.reservation.delete({
        where: { id: parseInt(id) },
      });

      res.json({ message: "Reservation deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
