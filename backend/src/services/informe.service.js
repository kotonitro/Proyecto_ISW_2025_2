import { AppDataSource } from "../config/configDB.js";
import { Informe } from "../models/informe.entity.js";

export const informeRepository = AppDataSource.getRepository(Informe);

export async function createInforme(data) {
  const newInforme = informeRepository.create(data);
  return await informeRepository.save(newInforme);
}

export async function getInformeById(idInforme) {
  return await informeRepository.findOneBy({ idInforme });
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
