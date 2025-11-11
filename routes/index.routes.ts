import { Router, Request, Response, NextFunction } from "express";
import tableRoutes from "./table.routes";
import reservationRoutes from "./reservation.routes";

const router = Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({
    message: "TAEBL API - All systems operational",
    endpoints: {
      tables: "/api/tables",
      reservations: "/api/reservations",
    },
  });
});

router.use("/tables", tableRoutes);
router.use("/reservations", reservationRoutes);

export default router;
