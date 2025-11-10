import { Router, Request, Response, NextFunction } from "express";
import tableRoutes from "./table.routes";
import reservationRoutes from "./reservation.routes";

const router = Router();

// Health check route
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({
    message: "TAEBL API - All systems operational",
    endpoints: {
      tables: "/api/tables",
      reservations: "/api/reservations",
    },
  });
});

// Mount route modules
router.use("/tables", tableRoutes);
router.use("/reservations", reservationRoutes);

export default router;
