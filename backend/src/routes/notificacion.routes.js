import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validationMiddleware } from "../middleware/validation.middleware.js";
import { crearNotificacion } from "../validations/notificacion.validation.js";
import {
  createNotificacion,
  getNotificaciones,
} from "../controllers/notificacion.controller.js";

const router = Router();
router.post("/", validationMiddleware(crearNotificacion), createNotificacion);
router.get("/", authMiddleware, getNotificaciones);
export default router;
