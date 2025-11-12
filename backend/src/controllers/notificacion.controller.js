import {
  createNotificacion,
  getNotificaciones,
  marcarLeida,
} from "../services/notificacion.service.js";
import { crearNotificacion } from "../validations/notificacion.validation.js";

export async function handleCreateNotificacion(req, res) {
  try {
    const { error } = crearNotificacion.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        message: "Error de validación",
        errors: error.details.map((d) => d.message),
      });
    }

    const nueva = await createNotificacion(req.body);
    return res.status(201).json(nueva);
  } catch (err) {
    console.error("Error al crear notificación:", err);
    return res
      .status(500)
      .json({ message: err.message || "Error interno del servidor" });
  }
}

export async function handleGetNotificaciones(req, res) {
  try {
    const data = await getNotificaciones();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ message: "Error interno" });
  }
}

export async function handleMarcarLeida(req, res) {
  try {
    const { id } = req.params;
    const data = await marcarLeida(parseInt(id));
    return res.status(200).json(data);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
}
