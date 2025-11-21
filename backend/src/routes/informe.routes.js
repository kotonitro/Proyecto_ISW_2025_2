import { Router } from "express";
import {
  handleCreateInforme,
  handleGetInformes,
  updateInforme,
  deleteInforme,
  //downloadInformePdf,
} from "../controllers/informe.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();
router.use(authMiddleware);
router.post("/", handleCreateInforme);
router.get("/", handleGetInformes);
router.put("/:id", updateInforme);
router.delete("/:id", deleteInforme);
//router.get("/download/:id", downloadInformePdf);
export default router;
