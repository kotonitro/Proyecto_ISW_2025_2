import { AppDataSource } from "../config/configDB.js";
import { Informe } from "../entities/informe.entity.js";

export const informeRepository = AppDataSource.getRepository(Informe);

export async function createInforme(data) {
  const newInforme = informeRepository.create(data);
  return await informeRepository.save(newInforme);
}

export async function getInformeById(idInforme) {
  return await informeRepository.findOneBy({ idInforme });
}

export async function deleteInforme(idInforme) {
  const Informe = await getInformeById(idInforme);
  if (!Informe) {
    throw new Error("Informe no encontrado");
  }
  await informeRepository.remove(Informe);
  return true;
}

export async function updateInforme(idInforme, data) {
  const Informe = await getInformeById(idInforme);
  if (!Informe) {
    throw new Error("Informe no encontrado");
  }
  informeRepository.merge(Informe, data);
  const resultado = await informeRepository.save(Informe);
  return resultado;
}
