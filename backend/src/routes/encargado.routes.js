import { Router } from "express";
import { authMiddleware, esAdmin } from "../middleware/auth.middleware.js";
import {
  handleGetEncargados,
  handleCreateEncargado,
  handleDeleteEncargado,
  handleGetEncargado,
  handleUpdateEncargado,
} from "../controllers/encargado.controller.js";

const router = Router();

router.use(authMiddleware);
router.use(esAdmin);

router.get("/", handleGetEncargados);
router.post("/", handleCreateEncargado);
router.get("/:id", handleGetEncargado);
router.delete("/:id", handleDeleteEncargado);
router.patch("/:id", handleUpdateEncargado);

export default router;
