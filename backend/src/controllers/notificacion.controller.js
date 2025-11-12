import {
  createNotificacion,
  getNotificaciones,
} from "../services/notificacion.service.js";
import {
  handleSuccess,
  handleErrorClient,
  handleErrorServer,
} from "../handlers/responseHandlers.js";
import { crearNotificacion } from "../validations/notificacion.validation.js";

export async function handleCreateNotificacion(req, res) {
  const notificacionData = req.body;

  try {
    const { error, value } = crearNotificacion.validate(notificacionData, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      const errorDetails = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message.replace(/['"]/g, ""),
      }));
      return handleErrorClient(
        res,
        400,
        "Error de validacion en los datos.",
        errorDetails,
      );
    }

    const newNotificacion = await createNotificacion(value);

    return handleSuccess(
      res,
      201,
      "Notificación enviada exitosamente",
      newNotificacion,
    );
  } catch (error) {
    console.error("Error al crear notificación:", error);
    return handleErrorServer(
      res,
      500,
      "Error interno al crear la notificación",
      error.message,
    );
  }
}

export async function handleGetNotificaciones(req, res) {
  console.log(`Guardia (ID: ${req.user.id}) está pidiendo notificaciones.`);

  try {
    const notificaciones = await getNotificaciones();

    return handleSuccess(
      res,
      200,
      "Notificaciones obtenidas exitosamente",
      notificaciones,
    );
  } catch (error) {
    console.error("Error al obtener notificaciones:", error);
    return handleErrorServer(
      res,
      500,
      "Error al obtener las notificaciones",
      error.message,
    );
  }
}
