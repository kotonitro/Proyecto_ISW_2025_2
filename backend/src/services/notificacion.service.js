import { AppDataSource } from "../config/configDB.js";
import { Notificacion } from "../entities/notificacion.entity.js";
import { Bicicletero } from "../entities/bicicletero.entity.js";

// Crear notificación
export async function createNotificacion(notificacionData) {
  const notificacionRepo = AppDataSource.getRepository(Notificacion);
  const bicicleteroRepo = AppDataSource.getRepository(Bicicletero);

  const { mensaje, bicicleteroId } = notificacionData;

  // Verificamos que el bicicletero exista
  const bicicletero = await bicicleteroRepo.findOne({
    where: { idBicicletero: bicicleteroId },
  });

  if (!bicicletero) {
    throw new Error("El bicicletero especificado no existe");
  }

  // Creamos la notificación
  const nuevaNotificacion = notificacionRepo.create({
    mensaje,
    bicicletero,
  });

  await notificacionRepo.save(nuevaNotificacion);
  return nuevaNotificacion;
}

// Obtener notificaciones no leídas
export async function getNotificaciones() {
  const notificacionRepo = AppDataSource.getRepository(Notificacion);

  const notificaciones = await notificacionRepo.find({
    relations: ["bicicletero"],
    where: { leida: false },
    order: { fechaCreacion: "DESC" },
  });

  return notificaciones;
}

// Marcar notificación como leída
export async function marcarLeida(id) {
  const notificacionRepo = AppDataSource.getRepository(Notificacion);

  const notificacion = await notificacionRepo.findOne({
    where: { notificacionId: id },
  });

  if (!notificacion) {
    throw new Error("Notificación no encontrada");
  }

  notificacion.leida = true;
  await notificacionRepo.save(notificacion);

  return notificacion;
}
