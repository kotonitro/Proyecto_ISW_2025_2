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


 // Registra la entrada de una bicicleta

router.post(
  "/entrada",
  authMiddleware,
  validationMiddleware(registroEntradaValidation),
  createEntrada
);

//Registra la salida de una bicicleta 
router.post(
  "/salida",
  authMiddleware,
  validationMiddleware(registroSalidaValidation),
  createSalida
);


  //Obtiene todos los registros (con filtros opcionales)
 
router.get("/registros", authMiddleware, getRegistros);


 //Obtiene un registro específico
 
router.get("/registros/:id", authMiddleware, getRegistroDetalle);


 // Obtiene todas las bicicletas almacenadas (fechaSalida = NULL)
 
router.get("/bicicletas/almacenadas", authMiddleware, getBicicletasAlmacendasController);


 //Obtiene todas las bicicletas retiradas (fechaSalida != NULL)
 
router.get("/bicicletas/retiradas", authMiddleware, getBicicletasRetiradasController);

export default router;
