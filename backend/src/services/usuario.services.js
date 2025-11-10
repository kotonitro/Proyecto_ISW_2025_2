import { AppDataSource } from "../config/configDB.js";
import { usuarios } from "../entities/usuarios.entity.js";
//import bcrypt from "bcrypt";

export const userRepository = AppDataSource.getRepository(usuarios);

export async function createUsuario(data) {
  const newUsuario = userRepository.create(data);

  return await userRepository.save(newUsuario);
}

export async function getUsuarioByRut(rut) {
  const usuario = await userRepository.findOneBy({ rut });
  return usuario;
}

export async function getUsuarios() {
  const usuarios = await userRepository.find();
  return usuarios;
}

export async function deleteUsuario(rut) {
  const usuario = await getUsuarioByRut(rut);
  if (!usuario) {
    throw new Error("Usuario no encontrado");
  }
  await userRepository.remove(usuario);
  return true;
}

export async function updateUsuario(rut, data) {
  const usuario = await getUsuarioByRut(rut);
  if (!usuario) {
    throw new Error("Usuario no encontrado");
  }
  userRepository.merge(usuario, data);
  const resultado = await userRepository.save(usuario);
  return resultado;
}
