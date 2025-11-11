import {
  handleSuccess,
  handleErrorClient,
  handleErrorServer,
} from "../handlers/responseHandlers.js";
import { informeValidation } from "../validations/informeValidation.js";
import { informeRepository } from "../services/informe.services.js";
import { generateInformePdf } from "../services/pdf.service.js";

export async function createInforme(req, res) {
  const informeData = req.body;
  try {
    const { error, value } = informeValidation.validate(informeData, {
      abortEarly: false,
    });
    if (error) {
      const errorDetails = error.details.map((detail) => ({
        key: detail.context.key,
        message: detail.message.replace(/['"]+/g, ""),
      }));
      return handleErrorClient(
        res,
        400,
        "Error de validación en los datos del informe.",
        errorDetails,
      );
    }
    const newInforme = await informeRepository.create(value);
    handleSuccess(res, 201, "Informe creado exitosamente.", newInforme);
  } catch (error) {
    handleErrorServer(
      res,
      500,
      "Error interno al crear el informe.",
      error.message,
    );
  }
}

export async function getInformes(req, res) {
  try {
    const informes = await informeRepository.getAll({
      relations: ["encargado", "registroAlmacen"],
    });
    if (informes.length === 0) {
      return handleErrorClient(res, 404, "No se encontraron informes.", null);
    }
    handleSuccess(res, 200, "Informes obtenidos correctamente.", informes);
  } catch (error) {
    handleErrorServer(
      res,
      500,
      "Error interno al obtener los informes.",
      error.message,
    );
  }
}

export async function updateInforme(req, res) {
  const { id } = req.params;
  const idNum = parseInt(id);
  const updateData = req.body;
  if (isNaN(idNum)) {
    return handleErrorClient(
      res,
      400,
      "El ID del informe debe ser un número válido.",
    );
  }
  try {
    const { error, value } = informeValidation.validate(updateData, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      const errorDetails = error.details.map((detail) => ({
        key: detail.context.key,
        message: detail.message.replace(/['"]+/g, ""),
      }));
      return handleErrorClient(
        res,
        400,
        "Error de validación en los datos del informe.",
        errorDetails,
      );
    }
    const informe = await informeRepository.findOneBy({ idInforme: idNum });
    if (!informe) {
      return handleErrorClient(res, 404, `Informe con ID ${id} no encontrado.`);
    }
    const updatedInforme = await informeRepository.update(informe, value);
    handleSuccess(
      res,
      200,
      `Informe con ID ${id} actualizado correctamente.`,
      updatedInforme,
    );
  } catch (error) {
    handleErrorServer(
      res,
      500,
      "Error interno al actualizar el informe.",
      error.message,
    );
  }
}

export async function deleteInforme(req, res) {
  const { id } = req.params;
  const idNum = parseInt(id);
  if (isNaN(idNum)) {
    return handleErrorClient(
      res,
      400,
      "El ID del informe debe ser un número válido.",
    );
  }
  try {
    const informe = await informeRepository.findOneBy({ idInforme: idNum });
    if (!informe) {
      return handleErrorClient(res, 404, `Informe con ID ${id} no encontrado.`);
    }
    await informeRepository.remove(informe);
    handleSuccess(
      res,
      200,
      `Informe con ID ${id} eliminado correctamente.`,
      null,
    );
  } catch (error) {
    handleErrorServer(
      res,
      500,
      "Error interno al eliminar el informe.",
      error.message,
    );
  }
}

export async function downloadInformePdf(req, res) {
  const { id } = req.params;
  const idNum = parseInt(id);
  if (isNaN(idNum)) {
    return handleErrorClient(
      res,
      400,
      "El ID del informe debe ser un número válido.",
    );
  }
  try {
    const informe = await informeRepository.findOneBy(
      { idInforme: idNum },
      { relations: ["encargado", "registroAlmacen"] },
    );
    if (!informe) {
      return handleErrorClient(res, 404, `Informe con ID ${id} no encontrado.`);
    }
    const pdfBuffer = await generateInformePdf(informe);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=informe_${idNum}_${Date.now()}.pdf`,
    );
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error al generar o enviar PDF:", error);
    handleErrorServer(
      res,
      500,
      "Error interno al generar el PDF del informe.",
      error.message,
    );
  }
}
