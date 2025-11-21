import {
  createInforme,
  getInformeById,
  deleteInforme,
  getInformes,
  updateInforme,
} from "../services/informe.service.js";
import {
  handleSuccess,
  handleErrorClient,
  handleErrorServer,
} from "../handlers/responseHandlers.js";
import {
  informeValidation,
  informeUpdateValidation,
} from "../validations/informe.validation.js";

export async function handleCreateInforme(req, res) {
  const informeData = req.body;
  try {
    const { error, value } = informeValidation.validate(informeData, {
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
        errorDetails,
      );
    }

    const newInforme = await createInforme(value);
    handleSuccess(res, 201, "Informe creado exitosamente", newInforme);
  } catch (error) {
    handleErrorServer(
      res,
      500,
      "Error interno al crear el informe",
      error.message,
    );
  }
}

export async function handleDeleteInforme(req, res) {
  const idInforme = req.body.idInforme;
  try {
    const Informe = await getInformeById(idInforme);
    if (!Informe) {
      return req.status(404).json({ message: "Informe no encontrado" });
    }
    await deleteInforme(idInforme);
    handleSuccess(res, 201, "Informe eliminado exitosamente");
  } catch (error) {
    handleErrorServer(
      res,
      500,
      "Error interno al eliminar el informe",
      error.message,
    );
  }
}
export async function handleGetInformes(req, res) {
  try {
    const Informes = await getInformes();
    return handleSuccess(
      res,
      200,
      "Informes obtenidos correctamente",
      Informes,
    );
  } catch (error) {
    return handleErrorServer(
      res,
      500,
      "Error interno al obtener los informes",
      error.message,
    );
  }
}

export async function updateInforme(req, res) {
  const { id } = req.params;
  const idInforme = parseInt(id, 10);
  const informeData = req.body;

  if (isNaN(idInforme)) {
    return handleErrorClient(res, 400, "El ID del informe debe ser un numero");
  }
  try {
    const { error, value } = informeUpdateValidation.validate(informeData, {
      abortEarly: false,
    });

    if (error) {
      const errorDetails = error.details.map((details) => ({
        field: details.context.key,
        message: details.message.replace(/['"]/g, ""),
      }));
      return handleErrorClient(
        res,
        400,
        "Error al validar datos",
        errorDetails,
      );
    }
    const Informe = await getInformeById(idInforme);
    if (!Informe) {
      return handleErrorClient(res, 404, "Informe no encontrado");
    }
    const updatedInforme = await updateInforme(idInforme, value);
    handleSuccess(res, 200, "Informe actualizado con exito", updatedInforme);
  } catch (error) {
    handleErrorServer(
      res,
      500,
      "Error al actualizar el informe",
      error.message,
    );
  }

  //export async function downloadInformePdf(req, res){
  //
}
