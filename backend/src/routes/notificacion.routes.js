import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js"; // Asegúrate que esta ruta sea correcta
import {
  handleCreateNotificacion,
  handleGetNotificaciones,
  handleAceptar,
  handleGetEstado,
  handleFinalizar,
} from "../controllers/notificacion.controller.js";

const router = Router();

//Rutas Publicas
router.post("/", handleCreateNotificacion);
router.get("/:id/estado", handleGetEstado);

//Rutas protegidas
router.get("/", authMiddleware, handleGetNotificaciones);
router.patch("/:id/aceptar", authMiddleware, handleAceptar);
router.patch("/:id/finalizar", authMiddleware, handleFinalizar);
export default router;
