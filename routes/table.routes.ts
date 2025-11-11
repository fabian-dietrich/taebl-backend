import { Router, Request, Response, NextFunction } from "express";
import prisma from "../db/prisma";

const router = Router();

// GET all tables
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tables = await prisma.table.findMany({
      orderBy: {
        tableNumber: 'asc'
      }
    });
    res.json(tables);
  } catch (error) {
    next(error);
  }
});

// GET /api/tables/available - MUST BE BEFORE /:id route!
router.get("/available", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { date, timeSlot, guests } = req.query;
    
    if (!date || !timeSlot || !guests) {
      return res.status(400).json({ 
        message: "Missing required query parameters: date, timeSlot, guests" 
      });
    }
    
    const numberOfGuests = parseInt(guests as string);
    
    const suitableTables = await prisma.table.findMany({
      where: {
        capacity: {
          gte: numberOfGuests
        }
      },
      include: {
        reservations: {
          where: {
            date: date as string,
            timeSlot: timeSlot as string,
            status: "Booked"
          }
        }
      }
    });
    
    const availableTables = suitableTables.filter(
      table => table.reservations.length === 0
    );
    
    const cleanedTables = availableTables.map(({ reservations, ...table }) => table);
    
    res.json(cleanedTables);
  } catch (error) {
    next(error);
  }
});

// GET single table
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const table = await prisma.table.findUnique({
      where: { id: parseInt(id) },
      include: {
        reservations: true
      }
    });
    
    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }
    
    res.json(table);
  } catch (error) {
    next(error);
  }
});

export default router;