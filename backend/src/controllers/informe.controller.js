import {
  createInforme,
  getInformeById,
  deleteInforme,
  updateInforme,
} from "../services/informe.service.js";
import {
  handleSuccess,
  handleErrorClient,
  handleErrorServer,
} from "../handlers/responseHandlers.js";
import { informeValidation } from "../validators/informe.validator.js";

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

export async function downloadInformePdf(req, res) {}
