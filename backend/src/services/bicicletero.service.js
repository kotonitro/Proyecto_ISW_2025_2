import { AppDataSource } from "../config/configDB.js";
import { Bicicletero } from "../models/bicicletero.entity.js";

export const bicicleteroRepository = AppDataSource.getRepository(Bicicletero);

export async function getBicicleteroById(idBicicletero) {
  return await bicicleteroRepository.findOneBy({ idBicicletero });
}

export async function getBicicleteros() {
  const Bicicletero = await bicicleteroRepository.find();
  return Bicicletero;
}

export async function createBicicletero(data) {
  const newBicicletero = bicicleteroRepository.create(data);
  return await bicicleteroRepository.save(newBicicletero);
}

export async function deleteBicicletero(idBicicletero) {
  const Bicicletero = await getBicicleteroById(idBicicletero);
  if (!Bicicletero) {
    throw new Error("Bicicletero no encontrado");
  }
  await bicicleteroRepository.remove(Bicicletero);
  return true;
}

export async function updateBicicletero(idBicicletero, data) {
  const Bicicletero = await getBicicleteroById(idBicicletero);
  if (!Bicicletero) {
    throw new Error("Bicicletero no encontrado");
  }
  bicicleteroRepository.merge(Bicicletero, data);
  const resultado = await bicicleteroRepository.save(Bicicletero);
  return resultado;
}
