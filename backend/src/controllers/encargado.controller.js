import {
  getEncargados,
  createEncargado,
  deleteEncargado,
  getEncargadoById,
  getEncargadoByEmail,
  getEncargadoByRut,
  getEncargadoByTelefono,
  updateEncargado,
} from "../services/encargado.service.js";
import {
  handleSuccess,
  handleErrorClient,
  handleErrorServer,
} from "../handlers/responseHandlers.js";
import {
  encargadoValidation,
  encargadoUpdateValidation,
} from "../validations/encargado.validation.js";

export async function handleGetEncargados(req, res) {
  try {
    const Encargados = await getEncargados();
    return handleSuccess(
      res,
      200,
      "Encargados obtenidos correctamente.",
      Encargados
    );
  } catch (error) {
    return handleErrorServer(
      res,
      500,
      "Error interno al obtener los encargados.",
      error.message
    );
  }
}

export async function handleGetEncargado(req, res) {
  const { id } = req.params;
  const idEncargado = parseInt(id, 10);

  if (isNaN(idEncargado)) {
    return handleErrorClient(
      res,
      400,
      "El ID del encargado debe ser un número."
    );
  }

  try {
    const Encargado = await getEncargadoById(idEncargado);

    if (!Encargado) {
      return handleErrorClient(res, 404, "Encargado no encontrado.");
    }

    handleSuccess(res, 200, "Encargado obtenido correctamente.", Encargado);
  } catch (error) {
    handleErrorServer(
      res,
      500,
      "Error interno al obtener el encargado.",
      error.message
    );
  }
}

export async function handleCreateEncargado(req, res) {
  const encargadoData = req.body;

  try {
    const { error, value } = encargadoValidation.validate(encargadoData, {
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

    const conflictos = [];
    const [encargadoEmail, encargadoRut, encargadoTelefono] = await Promise.all(
      [
        getEncargadoByEmail(value.email),
        getEncargadoByRut(value.rut),
        getEncargadoByTelefono(value.telefono),
      ]
    );

    if (encargadoEmail) {
      conflictos.push({
        field: "email",
        message: "Ya existe un encargado con ese email.",
      });
    }

    if (encargadoRut) {
      conflictos.push({
        field: "rut",
        message: "Ya existe un encargado con ese rut.",
      });
    }

    if (encargadoTelefono) {
      conflictos.push({
        field: "telefono",
        message: "Ya existe un encargado con ese teléfono.",
      });
    }

    if (conflictos.length > 0) {
      return handleErrorClient(
        res,
        409,
        "Error de conflicto en los datos.",
        conflictos
      );
    }

    const newEncargado = await createEncargado(value);
    handleSuccess(res, 201, "Encargado creado correctamente.", newEncargado);
  } catch (error) {
    handleErrorServer(
      res,
      500,
      "Error interno al crear el encargado.",
      error.message
    );
  }
}

export async function handleDeleteEncargado(req, res) {
  const { id } = req.params;
  const idEncargado = parseInt(id, 10);
  const idAdminLogueado = req.encargado.id;

  if (isNaN(idEncargado)) {
    return handleErrorClient(
      res,
      400,
      "El ID del encargado debe ser un número."
    );
  }

  try {
    if (idEncargado == idAdminLogueado) {
      return handleErrorClient(res, 403, "No puedes eliminarte a ti mismo.");
    }

    const Encargado = await getEncargadoById(idEncargado);

    if (!Encargado) {
      return handleErrorClient(res, 404, "Encargado no encontrado.");
    }

    if (Encargado.esAdmin) {
      return handleErrorClient(
        res,
        403,
        "No puedes eliminar a otro administrador."
      );
    }

    await deleteEncargado(idEncargado);
    handleSuccess(res, 200, "Encargado eliminado correctamente.");
  } catch (error) {
    if (error.code === "23503") {
      return handleErrorClient(
        res,
        409,
        "No se puede eliminar el encargado porque tiene informes o registros asociados. Intenta mejor desactivarlo."
      );
    }
    handleErrorServer(
      res,
      500,
      "Error interno al eliminar el encargado.",
      error.message
    );
  }
}

export async function handleUpdateEncargado(req, res) {
  const { id } = req.params;
  const idEncargado = parseInt(id, 10);
  const encargadoData = req.body;
  const idAdminLogueado = req.encargado.id;

  if (isNaN(idEncargado)) {
    return handleErrorClient(
      res,
      400,
      "El ID del encargado debe ser un número."
    );
  }

  try {
    const { error, value } = encargadoUpdateValidation.validate(encargadoData, {
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
        "Error de validacion en los datos.",
        errorDetails
      );
    }

    const Encargado = await getEncargadoById(idEncargado);

    if (!Encargado) {
      return handleErrorClient(res, 404, "Encargado no encontrado.");
    }

    if (idAdminLogueado != idEncargado && Encargado.esAdmin) {
      return handleErrorClient(
        res,
        403,
        "No puedes modificar a otro administrador."
      );
    }

    if (idAdminLogueado == idEncargado && !encargadoData.activo) {
      return handleErrorClient(res, 403, "No puedes desactivarte a ti mismo.");
    }

    const conflictos = [];
    const promises = [];

    if (value.email) {
      promises.push(
        getEncargadoByEmail(value.email).then((resultado) => ({
          campo: "email",
          resultado,
        }))
      );
    }

    if (value.rut) {
      promises.push(
        getEncargadoByRut(value.rut).then((resultado) => ({
          campo: "rut",
          resultado,
        }))
      );
    }

    if (value.telefono) {
      promises.push(
        getEncargadoByTelefono(value.telefono).then((resultado) => ({
          campo: "telefono",
          resultado,
        }))
      );
    }

    const comprobaciones = await Promise.all(promises);

    comprobaciones.forEach(({ campo, resultado }) => {
      if (resultado && resultado.idEncargado !== idEncargado) {
        if (campo == "email") {
          conflictos.push({
            field: campo,
            message: "Ya existe un encargado con ese email.",
          });
        }

        if (campo == "rut") {
          conflictos.push({
            field: campo,
            message: "Ya existe un encargado con ese rut.",
          });
        }

        if (campo == "telefono") {
          conflictos.push({
            field: campo,
            message: "Ya existe un encargado con ese teléfono.",
          });
        }
      }
    });

    if (conflictos.length > 0) {
      return handleErrorClient(
        res,
        409,
        "Error de conflicto en los datos.",
        conflictos
      );
    }

    const updatedEncargado = await updateEncargado(idEncargado, value);
    handleSuccess(
      res,
      200,
      "Encargado actualizado correctamente.",
      updatedEncargado
    );
  } catch (error) {
    handleErrorServer(
      res,
      500,
      "Error interno al actualizar el encargado.",
      error.message
    );
  }
}
