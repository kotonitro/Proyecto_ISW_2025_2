import { Router } from "express";
import { authMiddleware, esAdmin } from "../middleware/auth.middleware.js";
import { 
  handleCreateBicicletero, 
  handleDeleteBicicletero, 
  handleGetBicicleteros, 
  handleGetBicicletero, 
  handleUpdateBicicletero 
} from "../controllers/bicicletero.controller.js";
// Asegúrate de importar la función de disponibilidad (ajusta el nombre según tu controller)
import { getDisponibilidadBicicleteros } from "../controllers/custodia.controller.js"; 

const router = Router();

// RUTAS PÚBLICAS (Cualquiera las puede ver)
router.get("/", handleGetBicicleteros);
router.get("/disponibilidad", getDisponibilidadBicicleteros); // <-- NUEVA RUTA
router.get("/:id", handleGetBicicletero);

// RUTAS PROTEGIDAS (Solo Admin)
router.use(authMiddleware);
router.use(esAdmin);

router.post("/", handleCreateBicicletero);
router.delete("/:id", handleDeleteBicicletero);
router.patch("/:id", handleUpdateBicicletero);

export default router;