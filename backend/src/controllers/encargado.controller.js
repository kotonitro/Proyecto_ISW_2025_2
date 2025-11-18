import { getEncargados, createEncargado, deleteEncargado } from "../services/encargado.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";
import { encargadoValidation } from "../validations/encargado.validation.js";

export async function handleGetEncargados(req, res){
    try {
        const Encargados = await getEncargados();
        return handleSuccess(res, 200, "Encargados obtenidos correctamente", Encargados);
    } catch (error) {
        return handleErrorServer(res, 500, "Error interno al obtener los encargados", error.message);
    }
}

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

export async function handleDeleteEncargado(req, res) {
    const { id } = req.params;
    const idEncargado = parseInt(id, 10)
    
    if (isNaN(idEncargado)) {
        return handleErrorClient(res, 400, "El ID del encargado debe ser un numero.");
    }

    try {
        await deleteEncargado(idEncargado);
        handleSuccess(res, 200, "Encargado eliminado exitosamente");
    } catch (error) {
        if (error.message.includes("Encargado no encontrado")) {
            return handleErrorClient(res, 404, error.message);
        }
        handleErrorServer(res, 500, "Error interno al eliminar el encargado", error.message);
    }
}