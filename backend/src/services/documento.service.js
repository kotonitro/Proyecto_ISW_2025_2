import { AppDataSource } from "../config/configDB.js";
import { Documento } from "../models/documentos.entity.js";

const documentoRepository = AppDataSource.getRepository(Documento);

export async function createDocumentos(archivos, informe) {
  const documentos = archivos.map((archivo) => ({
    nombreOriginal: archivo.originalname,
    ruta: archivo.filename,
    mimetype: archivo.mimetype,
    informe: informe,
  }));

  return await documentoRepository.save(documentos);
}
