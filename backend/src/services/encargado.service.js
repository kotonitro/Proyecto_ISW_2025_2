import { AppDataSource } from "../config/configDB.js";
import { Encargado } from "../entities/encargado.entity.js";
import bcrypt from "bcrypt";

export const encargadoRepository = AppDataSource.getRepository(Encargado);

export async function createEncargado(data) {
  const hashedPassword = await bcrypt.hash(data.contrasena, 10);

  const newEncargado = encargadoRepository.create({
    email: data.email,
    contrasena: hashedPassword,
  });

  return await encargadoRepository.save(newEncargado);
}

export async function findEncargadoByEmail(email) {
  return await encargadoRepository.findOneBy({ email });
}