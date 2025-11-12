import {
  handleSuccess,
  handleErrorClient,
  handleErrorServer,
} from "../handlers/responseHandlers.js";
import {
  createUsuario as createUsuarioService,
  getUsuarioByRut,
  getUsuarios as getUsuariosService,
  deleteUsuario as deleteUsuarioService,
  updateUsuario as updateUsuarioService,
  userRepository,
} from "../services/usuario.service.js";
import { createUsuario as createUsuarioValidation } from "../validations/usuario.validation.js";

/**
 * Obtiene todos los usuarios.
 */
export async function getUsuarios(req, res) {
  try {
    const usuarios = await getUsuariosService();
    return handleSuccess(
      res,
      200,
      "Usuarios obtenidos correctamente",
      usuarios,
    );
  } catch (error) {
    return handleErrorServer(
      res,
      500,
      "Error al obtener usuarios",
      error.message,
    );
  }
}

// Esta funcion nos permite crear un nuevo usuario.
export async function createUsuario(req, res) {
  try {
    const usuarioData = req.body;

    const { error, value } = createUsuarioValidation.validate(usuarioData, {
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
        errorDetails,
      );
    }

    // Verificar si ya existe un usuario con ese RUT
    const existing = await getUsuarioByRut(value.rut);
    if (existing) {
      return handleErrorClient(
        res,
        409,
        `Usuario con RUT ${value.rut} ya existe`,
      );
    }

    const newUsuario = await createUsuarioService(value);
    return handleSuccess(res, 201, "Usuario creado exitosamente", newUsuario);
  } catch (error) {
    return handleErrorServer(
      res,
      500,
      "Error interno al crear el usuario",
      error.message,
    );
  }
}

// Esta funcion nos permite actualizar un usuario por RUT.
export async function updateUsuario(req, res) {
  try {
    const rutParam = req.params?.rut;
    const rutBody = req.body?.rut;
    const rutFromToken =
      (req.usuario && req.usuario.sub) || (req.user && req.user.sub);
    const rut = rutParam || rutBody || rutFromToken;

    if (!rut) {
      return handleErrorClient(
        res,
        400,
        "RUT del usuario es requerido para actualizar",
      );
    }

    // Evitar que se modifique el RUT a través del payload
    const { rut: _, ...updateData } = req.body;

    // Verificar existencia
    const usuario = await getUsuarioByRut(rut);
    if (!usuario) {
      return handleErrorClient(res, 404, "Usuario no encontrado");
    }

    const updated = await updateUsuarioService(rut, updateData);
    return handleSuccess(
      res,
      200,
      "Usuario actualizado correctamente",
      updated,
    );
  } catch (error) {
    // service layer lanza errores descriptivos; distinguirlos si es posible
    if (error.message && error.message.includes("no encontrado")) {
      return handleErrorClient(res, 404, error.message);
    }
    return handleErrorServer(
      res,
      500,
      "Error al actualizar el usuario",
      error.message,
    );
  }
}

// Esta funcion elimina el usuario por RUT
export async function deleteUsuario(req, res) {
  try {
    // Priorizar RUT en params, luego en body, luego en token (compatibilidad)
    const rutParam = req.params?.rut;
    const rutBody = req.body?.rut;
    const rutFromToken =
      (req.usuario && req.usuario.sub) || (req.user && req.user.sub);
    const rut = rutParam || rutBody || rutFromToken;

    if (!rut) {
      return handleErrorClient(
        res,
        400,
        "RUT del usuario es requerido para eliminar",
      );
    }

    // Usar servicio para eliminar
    await deleteUsuarioService(rut);
    return handleSuccess(res, 200, "Usuario eliminado correctamente", null);
  } catch (error) {
    if (error.message && error.message.includes("no encontrado")) {
      return handleErrorClient(res, 404, error.message);
    }
    return handleErrorServer(
      res,
      500,
      "Error al eliminar el usuario",
      error.message,
    );
  }
}
