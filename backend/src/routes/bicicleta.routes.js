import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  handleGetBicicletas,
  handleGetBicicletasByUsuario,
  handleCreateBicicleta,
  handleUpdateBicicleta,
  handleDeleteBicicleta,
} from "../controllers/bicicleta.controller.js";

const router = Router();

router.use(authMiddleware);

// Obtener todas las bicicletas
router.get("/", handleGetBicicletas);

// Obtener bicicletas por idUsuario
router.get("/usuario/:idUsuario", handleGetBicicletasByUsuario);

// Crear bicicleta (se valida que exista el usuario en el service)
router.post("/", handleCreateBicicleta);

// Actualizar bicicleta por idBicicleta
router.patch("/:id", handleUpdateBicicleta);

// Eliminar bicicleta por idBicicleta
router.delete("/:id", handleDeleteBicicleta);

export default router;
