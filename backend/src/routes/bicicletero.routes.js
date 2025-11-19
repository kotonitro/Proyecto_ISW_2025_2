import { Router } from "express";
import { authMiddleware, esAdmin } from "../middleware/auth.middleware.js";
import { handleCreateBicicletero, handleDeleteBicicletero, handleGetBicicleteros, handleGetBicicletero } from "../controllers/bicicletero.controller.js";

const router = Router();

router.get("/", handleGetBicicleteros);
router.get("/:id", handleGetBicicletero);

router.use(authMiddleware);
router.use(esAdmin);

router.post("/", handleCreateBicicletero);
router.delete("/:id", handleDeleteBicicletero);

export default router;