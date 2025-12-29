import { AppDataSource } from "../config/configDB.js";
import { Informe } from "../models/informe.entity.js";
import archiver from "archiver";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const informeRepository = AppDataSource.getRepository(Informe);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createInforme(data) {
  if (data.idBicicleta) {
      data.bicicleta = { idBicicleta: data.idBicicleta };
    }
    if (data.idBicicletero) {
      data.bicicletero = { idBicicletero: data.idBicicletero };
    }
  const newInforme = informeRepository.create(data);
  return await informeRepository.save(newInforme);
}



export async function getInformeById(idInforme) {
  return await informeRepository.findOne({where: { idInforme: idInforme },
      relations: ["encargados","documentos","bicicleta","bicicletero"]});
}
export async function getInformes() {
  const Informe = await informeRepository.find();
  return Informe;
}

export async function deleteInforme(idInforme) {
  const Informe = await getInformeById(idInforme);
  await informeRepository.remove(Informe);
  return true;
}

export async function updateInforme(idInforme, data) {
  const Informe = await getInformeById(idInforme);
  informeRepository.merge(Informe, data);
  const resultado = await informeRepository.save(Informe);
  return resultado;
}

export async function getInformeZip(idInforme) {
  const informe = await getInformeById(idInforme);
  if (!informe) {
    throw new Error("Informe no encontrado");
  }

  const archive = archiver("zip", {
    zlib: { level: 9 }, 
  });

  const listaDocs = informe.documentos; 

  if (Array.isArray(listaDocs) && listaDocs.length > 0) {
    listaDocs.forEach((doc, index) => {
      
      const nombreFisico = doc.ruta; 
      const nombreParaZip = doc.nombreOriginal || `evidencia_${index + 1}.png`;

      console.log(`\n--- Analizando Archivo ${index + 1} ---`);
      console.log("1. Nombre en BD (ruta):", nombreFisico);

      if (nombreFisico) {
        const filePath = path.join(__dirname, "../../uploads/informes", nombreFisico);
        
        console.log("2. Ruta absoluta generada:", filePath);
        
        if (fs.existsSync(filePath)) {
          console.log("Archivo encontrado. Agregando al ZIP...");
          archive.file(filePath, { name: nombreParaZip });
        } else {
          console.error(`Archivo NO encontrado en disco: ${filePath}`);
          archive.append(`El archivo ${nombreParaZip} no se encuentra en el servidor.`, { name: `Error_${index}.txt` });
        }
      }
    });
  } else {
    archive.append('No hay documentos adjuntos en la base de datos.', { name: 'Sin_Evidencias.txt' });
  }

  return { archive, idInforme: informe.idInforme };
}