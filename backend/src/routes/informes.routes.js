import { Router } from "express";
import {
  createInforme,
  getInformes,
  updateInforme,
  deleteInforme,
  downloadInformePdf,
} from "../controllers/informe.controller.js";
import {
  isAuthenticated,
  isEncargado,
} from "../middlewares/auth.middleware.js"; // Asumimos middlewares
const router = Router();
router.use(isAuthenticated, isEncargado);
router.post("/", createInforme);
router.get("/", getInformes);
router.put("/:id", updateInforme);
router.delete("/:id", deleteInforme);
router.get("/download/:id", downloadInformePdf);
export default router;
