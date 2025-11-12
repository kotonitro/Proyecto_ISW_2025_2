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
router.use(authMiddleware);

// Crear usuario(solo encargados)
router.post("/", createUsuario);

// Obtener todos (solo encargados)
router.get("/", getUsuarios);

// Obtener usuario por RUT(Solo encargados)
router.get("/:rut", getUsuarioByRut);

// Actualizar usuario por RUT(Solo encargados)
router.patch("/:rut", updateUsuario);

// Eliminar usuario por RUT(Solo encargados)
router.delete("/:rut", deleteUsuario);

export default router;
