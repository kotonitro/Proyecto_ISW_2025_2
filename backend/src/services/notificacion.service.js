import { AppDataSource } from "../config/configDB.js";
import { Notificacion } from "../models/notificacion.entity.js";
import { Bicicletero } from "../models/bicicletero.entity.js";
import { Encargado } from "../models/encargado.entity.js";
import { enviarAlertaCorreo } from "../utils/email.util.js";

// Crear notificación
export async function createNotificacion(notificacionData) {
  const now = new Date();
  const dia = now.getDay();
  const hora = now.getHours();
  const minutos = now.getMinutes();

  if (dia === 0 || dia === 6) throw new Error("El servicio no funciona los fines de semana.");
  if (hora < 7 || (hora === 7 && minutos < 30)) throw new Error("El servicio abre a las 07:30 hrs.");
  if (hora >= 20) throw new Error("El servicio cierra a las 20:00 hrs.");
  
  const notificacionRepo = AppDataSource.getRepository(Notificacion);
  const bicicleteroRepo = AppDataSource.getRepository(Bicicletero);
  const encargadoRepo = AppDataSource.getRepository(Encargado);

  const { mensaje, bicicleteroId, rutSolicitante } = notificacionData;
  const solicitudPendiente = await notificacionRepo.findOne({
        where: { 
          rutSolicitante: rutSolicitante,
          estado: "Pendiente" 
        }
      });
  
  if (solicitudPendiente) {
    throw new Error("Ya tienes una solicitud activa. Espera a que sea atendida.");
  }
  
  // Verificamos que el bicicletero exista
  const bicicletero = await bicicleteroRepo.findOne({
    where: { idBicicletero: bicicleteroId },
  });

  if (!bicicletero) {
    throw new Error("El bicicletero especificado no existe");
  }

  const nuevaNotificacion = notificacionRepo.create({
      mensaje,
      bicicletero,
      rutSolicitante,
      estado: "Pendiente",
  });
  const resultado = await notificacionRepo.save(nuevaNotificacion);
  
  try {
    const encargadosActivos = await encargadoRepo.find({
      where: { activo: true },
    });

    const listaEmails = encargadosActivos.map((e) => e.email).filter(Boolean);
    if (listaEmails.length > 0) {
      const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      const link = `${baseUrl}/aceptar/${resultado.notificacionId}`;

      await enviarAlertaCorreo(listaEmails, link, bicicleteroId, mensaje);
      console.log("Correo enviado");
    } else {
      console.warn("No hay encargados activos");
    }
  } catch (error) {
    console.error("Falló el envío de correo.");

    await notificacionRepo.remove(resultado);

    throw new Error(
      "No se pudo conectar con los guardias. Intenta nuevamente.",
    );
  }

  return resultado;
}

// Obtener notificaciones no leídas
export async function getNotificaciones(idEncargadologueado) {
  const notificacionRepo = AppDataSource.getRepository(Notificacion);

  const notificaciones = await notificacionRepo.find({
    relations: ["bicicletero", "encargado"],
    where: [{ estado: "Pendiente" }, { estado: "En Camino", encargado: { idEncargado: idEncargadologueado }}],
    order: { fechaCreacion: "DESC" },
  });

  return notificaciones;
}

// Marcar notificación como aceptada
export async function aceptarNotificacion(idNotificacion, idEncargado) {
  const notificacionRepo = AppDataSource.getRepository(Notificacion);
  const encargadoRepo = AppDataSource.getRepository(Encargado);

  const notificacion = await notificacionRepo.findOne({
    where: { notificacionId: idNotificacion },
    relations: ["encargado"],
  });

  if (!notificacion) {
    throw new Error("Notificación no encontrada");
  }
  if (notificacion.estado !== "Pendiente") {
    throw new Error(`Esta solicitud ya fue tomada por otro encargado.`);
  }

  const guardia = await encargadoRepo.findOne({ where: { idEncargado } });
  if (!guardia) throw new Error("Guardia no encontrado");

  notificacion.estado = "En Camino";
  notificacion.encargado = guardia;

  await notificacionRepo.save(notificacion);
  return notificacion;
}

// Funcion para que el usuario no logueado pueda ver el estado de una notificacion
export async function getEstadoNotificacion(id) {
  const notificacionRepo = AppDataSource.getRepository(Notificacion);

  const notificacion = await notificacionRepo.findOne({
    where: { notificacionId: id },
    select: ["estado", "fechaActualizacion"],
  });

  if (!notificacion) throw new Error("No existe");

  return { estado: notificacion.estado, timestamp: notificacion.fechaActualizacion };
}

export async function finalizarNotificacion(idNotificacion, idEncargado) {
  const notificacionRepo = AppDataSource.getRepository(Notificacion);
  const notificacion = await notificacionRepo.findOne({
    where: { notificacionId: idNotificacion },
    relations: ["encargado"],
  });

  if (!notificacion) throw new Error("Notificación no encontrada");

  if (notificacion.estado !== "En Camino") {
    throw new Error("No puedes finalizar una solicitud que no está en curso.");
  }

  if (notificacion.encargado.idEncargado !== idEncargado) {
      throw new Error("No puedes finalizar una tarea que no es tuya.");
  }
  
  notificacion.estado = "Finalizada";
  
  return await notificacionRepo.save(notificacion);
}