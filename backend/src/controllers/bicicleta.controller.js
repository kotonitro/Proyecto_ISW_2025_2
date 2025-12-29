import {
  handleSuccess,
  handleErrorClient,
  handleErrorServer,
} from "../handlers/responseHandlers.js";
import {
  createBicicleta,
  getBicicletas,
  getBicicletasByUsuarioId,
  updateBicicleta,
  deleteBicicleta,
} from "../services/bicicleta.service.js";
import { bicicletaValidation } from "../validations/bicicleta.validation.js";

export async function handleGetBicicletas(req, res) {
  try {
    const bicicletas = await getBicicletas();
    return handleSuccess(
      res,
      200,
      "Bicicletas obtenidas correctamente",
      bicicletas
    );
  } catch (error) {
    return handleErrorServer(
      res,
      500,
      "Error al obtener bicicletas",
      error.message
    );
  }
}

export async function handleGetBicicletasByUsuario(req, res) {
  try {
    const { idUsuario } = req.params;
    const bicicletas = await getBicicletasByUsuarioId(idUsuario);
    return handleSuccess(
      res,
      200,
      `Bicicletas del usuario ${idUsuario} obtenidas correctamente`,
      bicicletas
    );
  } catch (error) {
    return handleErrorServer(
      res,
      500,
      "Error al obtener bicicletas por usuario",
      error.message
    );
  }
}

export async function handleCreateBicicleta(req, res) {
  try {
    const bicicletaData = req.body;

    // Validación de campos obligatorios (marca, modelo, color)
    const { error, value } = bicicletaValidation.validate(bicicletaData, {
      abortEarly: false,
    });
    if (error) {
      const errorDetails = error.details.map((detail) => ({
        field: detail.context.key,
        message: detail.message.replace(/['"]/g, ""),
      }));
      return handleErrorClient(
        res,
        400,
        "Error de validación en los datos.",
        errorDetails
      );
    }

    // El servicio validará que exista idUsuario (y que el usuario exista)
    if (!value.idUsuario && typeof value.idUsuario !== "number") {
      return handleErrorClient(res, 400, "El campo idUsuario es obligatorio");
    }

    const newBicicleta = await createBicicleta(value);
    return handleSuccess(
      res,
      201,
      "Bicicleta creada correctamente",
      newBicicleta
    );
  } catch (error) {
    // Errores del service relacionados con usuario inexistente
    if (error.message && error.message.toLowerCase().includes("usuario")) {
      return handleErrorClient(res, 404, error.message);
    }
    return handleErrorServer(
      res,
      500,
      "Error al crear la bicicleta",
      error.message
    );
  }
}

export async function handleUpdateBicicleta(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body || {};

    if (!id) {
      return handleErrorClient(res, 400, "El id de la bicicleta es requerido");
    }

    if (Object.keys(updateData).length === 0) {
      return handleErrorClient(res, 400, "No hay datos para actualizar");
    }

    // Validar campos parciales: usar el esquema pero permitiendo campos opcionales
    const partialSchema = bicicletaValidation.fork(
      Object.keys(bicicletaValidation.describe().keys),
      (schema) => schema.optional()
    );
    const { error } = partialSchema.validate(updateData, { abortEarly: false });
    if (error) {
      const errorDetails = error.details.map((detail) => ({
        field: detail.context.key,
        message: detail.message.replace(/['"]/g, ""),
      }));
      return handleErrorClient(
        res,
        400,
        "Error de validación en los datos de actualización.",
        errorDetails
      );
    }

    // Dejar que el service valide reasignación de usuario si viene idUsuario
    const updated = await updateBicicleta(id, updateData);
    return handleSuccess(
      res,
      200,
      "Bicicleta actualizada correctamente",
      updated
    );
  } catch (error) {
    if (
      error.message &&
      error.message.toLowerCase().includes("no encontrada")
    ) {
      return handleErrorClient(res, 404, error.message);
    }
    if (error.message && error.message.toLowerCase().includes("usuario")) {
      return handleErrorClient(res, 404, error.message);
    }
    return handleErrorServer(
      res,
      500,
      "Error al actualizar la bicicleta",
      error.message
    );
  }
}

export async function handleDeleteBicicleta(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return handleErrorClient(res, 400, "El id de la bicicleta es requerido");
    }
    await deleteBicicleta(id);
    return handleSuccess(res, 200, "Bicicleta eliminada correctamente", null);
  } catch (error) {
    if (
      error.message &&
      error.message.toLowerCase().includes("no encontrada")
    ) {
      return handleErrorClient(res, 404, error.message);
    }
    if (
      error.message &&
      error.message.toLowerCase().includes("registros de custodia activos")
    ) {
      return handleErrorClient(res, 409, error.message);
    }
    return handleErrorServer(
      res,
      500,
      "Error al eliminar la bicicleta",
      error.message
    );
  }
}
