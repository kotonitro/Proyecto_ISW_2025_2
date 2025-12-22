import { Router } from "express";
import {
  handleCreateInforme,
  handleGetInformes,
  handleUpdateInforme,
  handleDeleteInforme,
  handleDownloadInformePdf,
} from "../controllers/informe.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { uploadDocs } from "../middleware/upload.middleware.js";

const router = Router();
router.post("/", uploadDocs, handleCreateInforme);
router.use(authMiddleware);
router.get("/", handleGetInformes);
router.patch("/:id", handleUpdateInforme);
router.delete("/:id", handleDeleteInforme);
router.get("/download/:id", handleDownloadInformePdf);
export default router;
