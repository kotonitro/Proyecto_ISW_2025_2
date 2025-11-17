import { AppDataSource } from "../config/configDB.js";
import { Usuario } from "../models/usuario.entity.js";

export const userRepository = AppDataSource.getRepository(Usuario);

export async function createUsuario(data) {
  const newUsuario = userRepository.create(data);

  return await userRepository.save(newUsuario);
}

export async function getUsuarioByRut(rut) {
  const Usuario = await userRepository.findOneBy({ rut });
  return Usuario;
}

export async function getUsuarios() {
  const Usuario = await userRepository.find();
  return Usuario;
}

export async function deleteUsuario(rut) {
  const Usuario = await getUsuarioByRut(rut);
  if (!Usuario) {
    throw new Error("Usuario no encontrado");
  }
  await userRepository.remove(Usuario);
  return true;
}

export async function updateUsuario(rut, data) {
  const Usuario = await getUsuarioByRut(rut);
  if (!Usuario) {
    throw new Error("Usuario no encontrado");
  }
  userRepository.merge(Usuario, data);
  const resultado = await userRepository.save(Usuario);
  return resultado;
}
