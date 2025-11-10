import { Router } from "express";
import { handleEncargadoLogin } from "../controllers/auth.controller.js";

const router = Router();

router.post("/login", handleEncargadoLogin);

export default router;