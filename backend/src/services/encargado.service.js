import { AppDataSource } from "../config/configDB.js";
import { Encargado } from "../models/encargado.entity.js";
import bcrypt from "bcrypt";

export const encargadoRepository = AppDataSource.getRepository(Encargado);

export async function getEncargadoByEmail(email) {
  return await encargadoRepository.findOneBy({ email });
}

export async function getEncargados() {
  const Encargado = await encargadoRepository.find();
  return Encargado;
}

export async function createEncargado(data) {
  const hashedPassword = await bcrypt.hash(data.contrasena, 10);

  const newEncargado = encargadoRepository.create({
    email: data.email,
    rut: data.rut,
    nombre: data.nombre,
    contrasena: hashedPassword,
    telefono: data.telefono
  });

  return await encargadoRepository.save(newEncargado);
}

export async function deleteEncargado(email) {
  const Encargado = await getEncargadoByEmail(email);
  if (!Encargado) {
    throw new Error("Encargado no encontrado");
  }
  await encargadoRepository.remove(Encargado);
  return true;
}

export async function updateEncargado(email, data) {
  const Encargado = await getEncargadoByEmail(email);
  if (!Encargado) {
    throw new Error("Encargado no encontrado");
  }
  bicicleteroRepository.merge(Encargado, data);
  const resultado = await encargadoRepository.save(Encargado);
  return resultado;
}