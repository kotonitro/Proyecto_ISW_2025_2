import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { handleCreateEncargado } from "../controllers/encargado.controller.js";

const router = Router();
router.use(authMiddleware);

router.post("/", handleCreateEncargado);

export default router;