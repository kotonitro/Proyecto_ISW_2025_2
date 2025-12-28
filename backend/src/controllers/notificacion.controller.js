import {
  createNotificacion,
  getNotificaciones,
  aceptarNotificacion,
  getEstadoNotificacion,
  finalizarNotificacion,
} from "../services/notificacion.service.js";

import { crearNotificacion } from "../validations/notificacion.validation.js";

export async function handleCreateNotificacion(req, res) {
  try {
    const { error, value } = crearNotificacion.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: "Error de validación",
        errors: error.details.map((d) => d.message),
      });
    }

    const nueva = await createNotificacion(value);

    return res.status(201).json({
      message: "Solicitud enviada. Esperando a un guardia.",
      data: nueva,
    });

  } catch (err) {
    console.error("Error al crear notificación:", err);
    
    if (err.message.includes("El servicio")) { 
        return res.status(403).json({ message: err.message });
    }
    
    if (err.message.includes("solicitud activa") || err.message.includes("solicitud pendiente")) {
        return res.status(409).json({ message: err.message });
    }
    
    if (err.message.includes("No se pudo conectar")) {
      return res.status(503).json({ message: err.message });
    }

    if (err.message === "El bicicletero especificado no existe") {
      return res.status(404).json({ message: err.message });
    }

    return res.status(500).json({ message: err.message || "Error interno del servidor" });
  }
}

export async function handleGetNotificaciones(req, res) {
  try {
    const idGuardia = req.encargado.id;       
    const data = await getNotificaciones(idGuardia);
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error interno" });
  }
}

export async function handleAceptar(req, res) {
  try {
    const { id } = req.params;
    const idEncargado = req.encargado.id; 

    const data = await aceptarNotificacion(parseInt(id), idEncargado);
    
    return res.status(200).json({
      message: "Notificación asignada exitosamente",
      data,
    });
  } catch (err) {
    if (err.message.includes("ya fue tomada")) {
      return res.status(409).json({ message: err.message });
    }

    if (err.message.includes("no encontrada") || err.message.includes("no encontrado")) {
      return res.status(404).json({ message: err.message });
    }

    return res.status(500).json({ message: err.message });
  }
}

export async function handleGetEstado(req, res) {
  try {
    const { id } = req.params;
    const data = await getEstadoNotificacion(parseInt(id));
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(404).json({ message: "Notificación no encontrada" });
  }
}

export async function handleFinalizar(req, res) {
  try {
    const { id } = req.params;
    const idEncargado = req.encargado.id;

    const data = await finalizarNotificacion(parseInt(id), idEncargado);

    return res.status(200).json({ message: "Tarea finalizada.", data });

  } catch (err) {
    if (err.message.includes("No puedes finalizar")) return res.status(409).json({ message: err.message });
    if (err.message.includes("no es tuya")) return res.status(403).json({ message: err.message });
    
    return res.status(400).json({ message: err.message });
  }
}