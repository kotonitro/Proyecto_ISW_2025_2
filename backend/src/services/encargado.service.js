import { AppDataSource } from "../config/configDB.js";
import { Encargado } from "../models/encargado.entity.js";
import bcrypt from "bcrypt";

export const encargadoRepository = AppDataSource.getRepository(Encargado);

export async function getEncargadoById(idEncargado) {
  return await encargadoRepository.findOneBy({ idEncargado });
}

export async function getEncargadoByEmail(email) {
  return await encargadoRepository.findOneBy({ email });
}

export async function getEncargadoByRut(rut) {
  return await encargadoRepository.findOneBy({ rut });
}

export async function getEncargadoByTelefono(telefono) {
  return await encargadoRepository.findOneBy({ telefono });
}

export async function getEncargados() {
  return await encargadoRepository.find();
}

export async function createEncargado(data) {
  const newEncargado = encargadoRepository.create({
    email: data.email,
    rut: data.rut,
    nombre: data.nombre,
    contrasena: await bcrypt.hash(data.contrasena, 10),
    telefono: data.telefono
  });

  return await encargadoRepository.save(newEncargado);
}

export async function deleteEncargado(idEncargado) {
  const Encargado = await getEncargadoById(idEncargado);
  await encargadoRepository.remove(Encargado);
  return true;
}

export async function updateEncargado(idEncargado, data) {
  const Encargado = await getEncargadoById(idEncargado);
  if (data.contrasena){
    data.contrasena = await bcrypt.hash(data.contrasena, 10);
  }
  encargadoRepository.merge(Encargado, data);
  const resultado = await encargadoRepository.save(Encargado);
  return resultado;
}