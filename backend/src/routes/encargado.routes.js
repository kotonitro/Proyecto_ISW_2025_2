import { Router } from "express";
import { authMiddleware, esAdmin } from "../middleware/auth.middleware.js";
import { handleGetEncargados, handleCreateEncargado, handleDeleteEncargado } from "../controllers/encargado.controller.js";

const router = Router()

router.use(authMiddleware);
router.use(esAdmin);

router.get("/", handleGetEncargados);
router.post("/", handleCreateEncargado);
router.delete("/:id", handleDeleteEncargado)

export default router;