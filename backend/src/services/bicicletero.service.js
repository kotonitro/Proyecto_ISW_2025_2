import { AppDataSource } from "../config/configDB.js";
import { Bicicletero } from "../models/bicicletero.entity.js";

export const bicicleteroRepository = AppDataSource.getRepository(Bicicletero);

export async function getBicicleteroById(idBicicletero) {
  return await bicicleteroRepository.findOneBy({ idBicicletero });
}

export async function getBicicleteroByUbicacion(ubicacion) {
  return await bicicleteroRepository.findOneBy({ ubicacion });
}

export async function getBicicleteros() {
  return await bicicleteroRepository.find();;
}

export async function createBicicletero(data) {
  const newBicicletero = bicicleteroRepository.create(data);
  return await bicicleteroRepository.save(newBicicletero);
}

export async function deleteBicicletero(idBicicletero) {
  const Bicicletero = await getBicicleteroById(idBicicletero);
  await bicicleteroRepository.remove(Bicicletero);
  return true;
}

export async function updateBicicletero(idBicicletero, data) {
  const Bicicletero = await getBicicleteroById(idBicicletero);
  bicicleteroRepository.merge(Bicicletero, data);
  const resultado = await bicicleteroRepository.save(Bicicletero);
  return resultado;
}