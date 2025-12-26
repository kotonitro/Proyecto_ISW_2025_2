import { Router } from "express";
import { authMiddleware, esAdmin } from "../middleware/auth.middleware.js";
import { 
  handleCreateBicicletero, 
  handleDeleteBicicletero, 
  handleGetBicicleteros, 
  handleGetBicicletero, 
  handleUpdateBicicletero 
} from "../controllers/bicicletero.controller.js";
import { getDisponibilidadBicicleteros } from "../controllers/custodia.controller.js"; 

const router = Router();

// RUTAS PÚBLICAS 
router.get("/", handleGetBicicleteros);
router.get("/disponibilidad", getDisponibilidadBicicleteros); 
router.get("/:id", handleGetBicicletero);

// RUTAS PROTEGIDAS 
router.use(authMiddleware);
router.use(esAdmin);

router.post("/", handleCreateBicicletero);
router.delete("/:id", handleDeleteBicicletero);
router.patch("/:id", handleUpdateBicicletero);

export default router;