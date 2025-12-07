import { Router } from "express";
import {
  handleCreateInforme,
  handleGetInformes,
  handleUpdateInforme,
  handleDeleteInforme,
  handleDownloadInformePdf,
} from "../controllers/informe.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();
router.use(authMiddleware);
router.post("/", handleCreateInforme);
router.get("/", handleGetInformes);
router.patch("/:id", handleUpdateInforme);
router.delete("/:id", handleDeleteInforme);
router.get("/download/:id", handleDownloadInformePdf);
export default router;
