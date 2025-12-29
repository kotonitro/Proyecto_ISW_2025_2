import { AppDataSource } from "../config/configDB.js";
import { Bicicleta } from "../models/bicicleta.entity.js";
import { getUsuarioById } from "./usuario.service.js";

export const bicicletaRepository = AppDataSource.getRepository(Bicicleta);
const registroAlmacenRepository =
  AppDataSource.getRepository("RegistroAlmacen");

export async function createBicicleta(data) {
  if (
    !data ||
    typeof data.idUsuario === "undefined" ||
    data.idUsuario === null
  ) {
    throw new Error("El idUsuario es obligatorio para crear una bicicleta");
  }

  const usuario = await getUsuarioById(parseInt(data.idUsuario));
  if (!usuario) {
    throw new Error(
      "Usuario no encontrado. No se puede crear la bicicleta sin un usuario válido"
    );
  }

  const bicicleta = bicicletaRepository.create(data);
  return await bicicletaRepository.save(bicicleta);
}

export async function getBicicletaById(idBicicleta) {
  if (!idBicicleta) return null;
  const id = parseInt(idBicicleta);
  const bicicleta = await bicicletaRepository.findOneBy({ idBicicleta: id });
  return bicicleta;
}

export async function getBicicletas() {
  const bicicletas = await bicicletaRepository.find();
  return bicicletas;
}

export async function getBicicletasByUsuarioId(idUsuario) {
  if (!idUsuario) return [];
  const id = parseInt(idUsuario);
  const bicicletas = await bicicletaRepository.find({
    where: { idUsuario: id },
  });
  return bicicletas;
}

export async function updateBicicleta(idBicicleta, data) {
  const bicicleta = await getBicicletaById(idBicicleta);
  if (!bicicleta) {
    throw new Error("Bicicleta no encontrada");
  }

  if (
    data &&
    typeof data.idUsuario !== "undefined" &&
    data.idUsuario !== null
  ) {
    const usuario = await getUsuarioById(parseInt(data.idUsuario));
    if (!usuario) {
      throw new Error(
        "Usuario no encontrado. No se puede reasignar la bicicleta a un usuario inexistente"
      );
    }
  }

  bicicletaRepository.merge(bicicleta, data);
  const resultado = await bicicletaRepository.save(bicicleta);
  return resultado;
}

export async function deleteBicicleta(idBicicleta) {
  const bicicleta = await getBicicletaById(idBicicleta);
  if (!bicicleta) {
    throw new Error("Bicicleta no encontrada");
  }

  // Verificar si la bicicleta tiene registros de custodia activos (sin salida)
  const registrosActivos = await registroAlmacenRepository.findBy({
    idBicicleta: parseInt(idBicicleta),
    fechaSalida: null,
  });

  if (registrosActivos && registrosActivos.length > 0) {
    throw new Error(
      "No se puede eliminar la bicicleta porque tiene registros de custodia activos. " +
        "Por favor, registre la salida primero o elimine el registro de custodia."
    );
  }

  await bicicletaRepository.remove(bicicleta);
  return true;
}
