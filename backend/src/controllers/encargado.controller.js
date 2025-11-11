import { createEncargado } from "../services/encargado.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";
import { encargadoValidation } from "../validations/encargado.validation.js";

export async function handleCreateEncargado(req, res) {
    const encargadoData = req.body;

    try {
        const { error, value } = encargadoValidation.validate(encargadoData, {abortEarly: false});
        if (error){
            const errorDetails = error.details.map((detail) => ({
                field: detail.context.key,
                message: detail.message.replace(/['"]/g, ""),
            }));
            return handleErrorClient(res, 400, "Error de validacion en los datos.", errorDetails,);
        }
        const newEncargado = await createEncargado(value);
        handleSuccess(res, 201, "Encargado creado exitosamente", newEncargado);
    } catch (error) {
        handleErrorServer(res, 500, "Error interno al crear el encargado", error.message);
    }
}