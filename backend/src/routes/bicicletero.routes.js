import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { handleCreateBicicletero } from "../controllers/bicicletero.controller.js";

const router = Router();
router.use(authMiddleware);

router.post("/", handleCreateBicicletero);

export default router;