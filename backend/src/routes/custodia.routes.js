import { Router } from "express";
import {
  createEntrada,
  createSalida,
  getRegistros,
  getRegistroDetalle,
  getBicicletasAlmacendasController,
  getBicicletasRetiradasController,
  deleteRegistroController,
  getHistorialController,
  getUbicacionController,
} from "../controllers/custodia.controller.js";

import { validationMiddleware } from "../middleware/validation.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  registroEntradaValidation,
  registroSalidaValidation,
} from "../validations/registroAlmacen.validation.js";

const router = Router();
// Registra la entrada de una bicicleta

router.post(
  "/entrada",
  authMiddleware,
  validationMiddleware(registroEntradaValidation),
  createEntrada,
);

//Registra la salida de una bicicleta
router.post(
  "/salida",
  authMiddleware,
  validationMiddleware(registroSalidaValidation),
  createSalida,
);

router.get("/registros", authMiddleware, getRegistros);
router.get("/registros/:id", authMiddleware, getRegistroDetalle);

// Obtiene todas las bicicletas almacenadas (fechaSalida = NULL)
router.get(
  "/bicicletas/almacenadas",
  authMiddleware,
  getBicicletasAlmacendasController,
);

//Obtiene todas las bicicletas retiradas (fechaSalida != NULL)
router.get(
  "/bicicletas/retiradas",
  authMiddleware,
  getBicicletasRetiradasController,
);

router.delete("/registros/:id", authMiddleware, deleteRegistroController);

// Obtener historial de custodia
router.get("/historial", authMiddleware, getHistorialController);

// Ruta pública para que usuarios verifiquen ubicación de su bicicleta por RUT
router.get("/ubicacion/:rut", getUbicacionController);

export default router;
