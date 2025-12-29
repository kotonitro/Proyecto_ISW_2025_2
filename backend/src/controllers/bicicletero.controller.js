import {
  getBicicleteros,
  createBicicletero,
  deleteBicicletero,
  getBicicleteroById,
  getBicicleteroByUbicacion,
  updateBicicletero,
} from "../services/bicicletero.service.js";
import {
  handleSuccess,
  handleErrorClient,
  handleErrorServer,
} from "../handlers/responseHandlers.js";
import {
  bicicleteroValidation,
  bicicleteroUpdateValidation,
} from "../validations/bicicletero.validation.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const bicicleterosDir = path.resolve(__dirname, "../../uploads/bicicleteros");

export async function handleGetBicicleteros(req, res) {
  try {
    const Bicicleteros = await getBicicleteros();
    return handleSuccess(
      res,
      200,
      "Bicicleteros obtenidos correctamente.",
      Bicicleteros
    );
  } catch (error) {
    return handleErrorServer(
      res,
      500,
      "Error interno al obtener los bicicleteros.",
      error.message
    );
  }
}

export async function handleGetBicicletero(req, res) {
  const { id } = req.params;
  const idBicicletero = parseInt(id, 10);

  if (isNaN(idBicicletero)) {
    return handleErrorClient(
      res,
      400,
      "El ID del bicicletero debe ser un número."
    );
  }

  try {
    const Bicicletero = await getBicicleteroById(idBicicletero);

    if (!Bicicletero) {
      return handleErrorClient(res, 404, "Bicicletero no encontrado.");
    }

    handleSuccess(res, 200, "Bicicletero obtenido correctamente.", Bicicletero);
  } catch (error) {
    handleErrorServer(
      res,
      500,
      "Error interno al obtener el bicicletero.",
      error.message
    );
  }
}

export async function handleCreateBicicletero(req, res) {
  let bicicleteroData = { ...req.body };

  if (req.file) {
    bicicleteroData.imagen = req.file.filename;
  }

  try {
    const { error, value } = bicicleteroValidation.validate(bicicleteroData, {
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

    const conflictos = [];
    const [bicicleteroUbicacion] = await Promise.all([
      getBicicleteroByUbicacion(value.ubicacion),
    ]);

    if (bicicleteroUbicacion) {
      conflictos.push({
        field: "ubicacion",
        message: "Ya existe un bicicletero con esa ubicación.",
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

    const newBicicletero = await createBicicletero(value);
    handleSuccess(
      res,
      201,
      "Bicicletero creado correctamente.",
      newBicicletero
    );
  } catch (error) {
    handleErrorServer(
      res,
      500,
      "Error interno al crear el bicicletero.",
      error.message
    );
  }
}
export async function handleDeleteBicicletero(req, res) {
  const { id } = req.params;
  const idBicicletero = parseInt(id, 10);

  if (isNaN(idBicicletero)) {
    return handleErrorClient(
      res,
      400,
      "El ID del bicicletero debe ser un número."
    );
  }

  try {
    const Bicicletero = await getBicicleteroById(idBicicletero);

    if (!Bicicletero) {
      return handleErrorClient(res, 404, "Bicicletero no encontrado.");
    }

    if (Bicicletero.imagen) {
      const rutaImagen = path.join(bicicleterosDir, Bicicletero.imagen);
      if (fs.existsSync(rutaImagen)) {
        fs.unlinkSync(rutaImagen); // Borrado síncrono
      }
    }

    await deleteBicicletero(idBicicletero);
    handleSuccess(res, 200, "Bicicletero eliminado correctamente.");
  } catch (error) {
    if (error.code === "23503") {
      return handleErrorClient(
        res,
        409,
        "No se puede eliminar el bicicletero porque tiene bicicletas o informes asociados. Intenta mejor desactivarlo."
      );
    }

    handleErrorServer(
      res,
      500,
      "Error interno al eliminar el bicicletero.",
      error.message
    );
  }
}

export async function handleUpdateBicicletero(req, res) {
  const { id } = req.params;
  const idBicicletero = parseInt(id, 10);
  let bicicleteroData = { ...req.body };

  if (req.file) {
    bicicleteroData.imagen = req.file.filename;
  } else if (req.body.eliminarImagen === "true") {
    bicicleteroData.imagen = null;
  }

  if (isNaN(idBicicletero)) {
    return handleErrorClient(
      res,
      400,
      "El ID del bicicletero debe ser un número."
    );
  }

  try {
    const { error, value } = bicicleteroUpdateValidation.validate(
      bicicleteroData,
      { abortEarly: false }
    );

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

    const Bicicletero = await getBicicleteroById(idBicicletero);

    if (!Bicicletero) {
      return handleErrorClient(res, 404, "Bicicletero no encontrado.");
    }

    const conflictos = [];
    const promises = [];

    if (value.ubicacion) {
      promises.push(
        getBicicleteroByUbicacion(value.ubicacion).then((resultado) => ({
          campo: "ubicacion",
          resultado,
        }))
      );
    }

    const comprobaciones = await Promise.all(promises);

    comprobaciones.forEach(({ campo, resultado }) => {
      if (resultado && resultado.idBicicletero !== idBicicletero) {
        if (campo == "ubicacion") {
          conflictos.push({
            field: campo,
            message: "Ya existe un bicicletero con esa ubicación.",
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

    const debeBorrarImagenAntigua =
      req.file || req.body.eliminarImagen === "true";

    if (debeBorrarImagenAntigua && Bicicletero.imagen) {
      const rutaImagenAntigua = path.join(bicicleterosDir, Bicicletero.imagen);
      if (fs.existsSync(rutaImagenAntigua)) {
        fs.unlinkSync(rutaImagenAntigua);
      }
    }

    const updatedBicicletero = await updateBicicletero(idBicicletero, value);
    handleSuccess(
      res,
      200,
      "Bicicletero actualizado correctamente.",
      updatedBicicletero
    );
  } catch (error) {
    handleErrorServer(
      res,
      500,
      "Error interno al actualizar el bicicletero.",
      error.message
    );
  }
}
