import { Router } from "express";
import {
  createEntrada,
  createSalida,
  getRegistros,
  getRegistroDetalle,
  getBicicletasAlmacendasController,
  getBicicletasRetiradasController,
} from "../controllers/custodia.controller.js";
import { validationMiddleware } from "../middleware/validation.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  registroEntradaValidation,
  registroSalidaValidation,
} from "../validations/registroAlmacen.validation.js";

const router = Router();

/**
 * POST /api/custodia/entrada
 * Registra la entrada de una bicicleta
 * Body: { rutUsuario, nombreUsuario, emailUsuario, telefonoUsuario, idBicicleta, idBicicletero }
 */
router.post(
  "/entrada",
  authMiddleware,
  validationMiddleware(registroEntradaValidation),
  createEntrada
);

/**
 * POST /api/custodia/salida
 * Registra la salida de una bicicleta
 * Body: { idRegistroAlmacen }
 */
router.post(
  "/salida",
  authMiddleware,
  validationMiddleware(registroSalidaValidation),
  createSalida
);

/**
 * GET /api/custodia/registros
 * Obtiene todos los registros (con filtros opcionales)
 * Query: ?idEncargado=1&estado=entrada&rutUsuario=12345678&estadoBicicleta=ALMACENADA
 */
router.get("/registros", authMiddleware, getRegistros);

/**
 * GET /api/custodia/registros/:id
 * Obtiene un registro específico
 */
router.get("/registros/:id", authMiddleware, getRegistroDetalle);

/**
 * GET /api/custodia/bicicletas/almacenadas
 * Obtiene todas las bicicletas almacenadas (horaSalida = NULL)
 */
router.get("/bicicletas/almacenadas", authMiddleware, getBicicletasAlmacendasController);

/**
 * GET /api/custodia/bicicletas/retiradas
 * Obtiene todas las bicicletas retiradas (horaSalida != NULL)
 */
router.get("/bicicletas/retiradas", authMiddleware, getBicicletasRetiradasController);

export default router;
