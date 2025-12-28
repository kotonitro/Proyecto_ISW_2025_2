import { AppDataSource } from "../config/configDB.js";
import { Usuario } from "../models/usuario.entity.js";

export const userRepository = AppDataSource.getRepository(Usuario);

export async function createUsuario(data) {
  const newUsuario = userRepository.create(data);
  return await userRepository.save(newUsuario);
}

export async function getUsuarioByRut(rut) {
  // Devolver también las bicicletas relacionadas para que el cliente pueda
  // obtener `usuario.bicicletas` y extraer `idBicicleta` cuando sea necesario.
  const usuario = await userRepository.findOne({ where: { rut }, relations: ["bicicletas"] });
  return usuario;
}

export async function getUsuarioById(idUsuario) {
  const usuario = await userRepository.findOne({ where: { idUsuario }, relations: ["bicicletas"] });
  return usuario;
}

export async function getUsuarios() {
  // Incluir bicicletas en el listado para facilitar vistas administrativas.
  const usuarios = await userRepository.find({ relations: ["bicicletas"] });
  return usuarios;
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
