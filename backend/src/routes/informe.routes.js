import { Router } from "express";
import multer from "multer";
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
router.use(authMiddleware);
router.post("/", uploadDocs, handleCreateInforme);
router.get("/", handleGetInformes);
router.patch("/:id", handleUpdateInforme);
router.delete("/:id", handleDeleteInforme);
router.get("/download/:id", handleDownloadInformePdf);
router.get("/download-zip/:id", handleDownloadInformeZip);
export default router;
