import { AppDataSource } from "../config/configDB.js";
import { Notificacion } from "../entities/notificacion.entity.js";

export async function createNotificacion(notificacionData) {
  const notificacionRepo = AppDataSource.getRepository(Notificacion);

  const nuevaNotificacion = notificacionRepo.create(notificacionData);

  await notificacionRepo.save(nuevaNotificacion);

  return nuevaNotificacion;
}

export async function getNotificaciones() {
  const notificacionRepo = AppDataSource.getRepository(Notificacion);

  const notificaciones = await notificacionRepo.find({
    where: { leida: false },
    order: { createdAt: "DESC" }, // Muestra las más nuevas primero
  });

  return notificaciones;
}
