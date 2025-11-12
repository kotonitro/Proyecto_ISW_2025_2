import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { handleCreateBicicletero, handleDeleteBicicletero, handleGetBicicleteros } from "../controllers/bicicletero.controller.js";

const router = Router();

router.get("/", handleGetBicicleteros);

router.use(authMiddleware);

router.post("/", handleCreateBicicletero);
//router.delete("/", handleDeleteBicicletero);

export default router;