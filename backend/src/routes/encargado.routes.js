import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { handleGetEncargados, handleCreateEncargado } from "../controllers/encargado.controller.js";

const router = Router();
router.use(authMiddleware);

router.get("/", handleGetEncargados);
router.post("/", handleCreateEncargado);

export default router;