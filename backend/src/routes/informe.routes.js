import { Router } from "express";
import {
  handleCreateInforme,
  handleGetInformes,
  handleUpdateInforme,
  handleDeleteInforme,
  handleDownloadInformePdf,
  handleDownloadInformeZip,
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
router.get("/download-zip/:id", handleDownloadInformeZip);
export default router;
