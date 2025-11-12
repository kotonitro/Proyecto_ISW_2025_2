import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  handleCreateNotificacion,
  handleGetNotificaciones,
} from "../controllers/notificacion.controller.js";

const router = Router();
router.post("/", handleCreateNotificacion);
router.get("/", authMiddleware, handleGetNotificaciones);
export default router;
