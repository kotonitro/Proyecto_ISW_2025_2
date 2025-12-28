import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseUploadsDir = path.resolve(__dirname, '../../uploads');

// Función auxiliar para crear configuración de Multer por carpeta
const createStorage = (folderName) => {
  const finalDir = path.join(baseUploadsDir, folderName);

  // Asegurar que la carpeta existe
  if (!fs.existsSync(finalDir)) {
    fs.mkdirSync(finalDir, { recursive: true });
    console.log(`=> Carpeta creada: ${finalDir}`);
  }

  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, finalDir);
    },
    filename: (req, file, cb) => {
      const timestamp = Date.now();
      // Limpiamos el nombre de espacios y caracteres raros
      const safeName = file.originalname.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '');
      cb(null, `${timestamp}_${safeName}`);
    }
  });
};

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido. Solo JPG, PNG y PDF.'), false);
  }
};

const limits = { fileSize: 10 * 1024 * 1024 }; // 10 MB

// --- EXPORTAMOS MIDDLEWARES ESPECÍFICOS ---

// 1. Para Bicicleteros (Guarda en uploads/bicicleteros)
export const uploadBicicletero = multer({ 
  storage: createStorage('bicicleteros'),
  fileFilter,
  limits
});

// 2. Para Informes (Guarda en uploads/informes)
export const uploadInforme = multer({ 
  storage: createStorage('informes'),
  fileFilter,
  limits
});

// 3. Genérico (Para compatibilidad con tu código anterior si lo usas)
export const uploadDocs = multer({
  storage: createStorage('otros'),
  fileFilter,
  limits
}).array('archivosExtras', 5);