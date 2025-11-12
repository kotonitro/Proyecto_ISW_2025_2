import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  handleCreateNotificacion,
  handleGetNotificaciones,
  handleMarcarLeida,
} from "../controllers/notificacion.controller.js";

const router = Router();

// RUTA PÚBLICA — Cualquiera puede crear una notificación
router.post("/", handleCreateNotificacion);

// RUTAS PROTEGIDAS — Solo encargados autenticados pueden ver o marcar
router.get("/", authMiddleware, handleGetNotificaciones);
router.patch("/:id/leida", authMiddleware, handleMarcarLeida);

export default router;
