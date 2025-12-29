import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  handleGetUsuarios,
  handleCreateUsuario,
  handleUpdateUsuario,
  handleDeleteUsuario,
  handleGetUsuarioByRut,
} from "../controllers/usuario.controller.js";

const router = Router();
router.use(authMiddleware);

// Crear usuario(solo encargados)
router.post("/", handleCreateUsuario);

// Obtener todos (solo encargados)
router.get("/", handleGetUsuarios);

// Obtener usuario por RUT(Solo encargados)
router.get("/:rut", handleGetUsuarioByRut);

// Actualizar usuario por RUT(Solo encargados)
router.patch("/:rut", handleUpdateUsuario);

// Eliminar usuario por RUT(Solo encargados)
router.delete("/:rut", handleDeleteUsuario);

export default router;
