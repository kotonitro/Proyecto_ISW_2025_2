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
// Middleware para capturar errores de subida
const uploadMiddleware = (req, res, next) => {
  uploadDocs(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ 
        status: 400, 
        message: "Error en la subida de archivos", 
        detail: err.message 
      });
    } else if (err) {
      return res.status(400).json({ 
        status: 400, 
        message: "Archivo inválido", 
        detail: err.message 
      });
    }
    next();
  });
};
router.use(authMiddleware);
router.post("/", uploadDocs, handleCreateInforme);
router.get("/", handleGetInformes);
router.patch("/:id", handleUpdateInforme);
router.delete("/:id", handleDeleteInforme);
router.get("/download/:id", handleDownloadInformePdf);
router.get("/download-zip/:id", handleDownloadInformeZip);
export default router;
