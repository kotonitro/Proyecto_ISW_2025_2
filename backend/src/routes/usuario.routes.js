import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  getUsuarioByRut,
} from "../controllers/usuario.controller.js";

const router = Router();

// Crear usuario(solo encargados)
router.post("/", authMiddleware, createUsuario);

// Obtener todos (solo encargados)
router.get("/", getUsuarios, authMiddleware);

router.get("/:rut", authMiddleware, getUsuarioByRut);

// Actualizar usuario por RUT(Solo encargados)
router.put("/:rut", authMiddleware, updateUsuario);

// Eliminar usuario por RUT(Solo encargados)
router.delete("/:rut", authMiddleware, deleteUsuario);

export default router;
