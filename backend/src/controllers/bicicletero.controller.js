import { getBicicleteroById, getBicicleteros, createBicicletero, deleteBicicletero } from "../services/bicicletero.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";
import { bicicleteroValidation } from "../validations/bicicletero.validation.js";

export async function handleGetBicicleteros(req, res){
    try {
        const Bicicleteros = await getBicicleteros();
        return handleSuccess(res, 200, "Bicicleteros obtenidos correctamente", Bicicleteros);
    } catch (error) {
        return handleErrorServer(res, 500, "Error interno al obtener los bicicleteros", error.message);
    }
}

export async function handleCreateBicicletero(req, res) {
    const bicicleteroData = req.body;

    try {
        const { error, value } = bicicleteroValidation.validate(bicicleteroData, {abortEarly: false});
        if (error){
            const errorDetails = error.details.map((detail) => ({
                field: detail.context.key,
                message: detail.message.replace(/['"]/g, ""),
            }));
            return handleErrorClient(res, 400, "Error de validacion en los datos.", errorDetails,);
        }
        const newBicicletero = await createBicicletero(value);
        handleSuccess(res, 201, "Bicicletero creado exitosamente", newBicicletero);
    } catch (error) {
        handleErrorServer(res, 500, "Error interno al crear el bicicletero", error.message);
    }
}

export async function handleDeleteBicicletero(req, res) {
    const { id } = req.params;
    const idNum = parseInt(id, 10)
    
    if (isNaN(idNum)) {
        return handleErrorClient(res, 400, "El ID del bicicletero debe ser un numero.");
    }

    try {
        await deleteBicicletero(idNum);
        handleSuccess(res, 200, "Bicicletero eliminado exitosamente");
    } catch (error) {
        if (error.message.includes("Bicicletero no encontrado")) {
            return handleErrorClient(res, 404, error.message);
        }
        handleErrorServer(res, 500, "Error interno al eliminar el bicicletero", error.message);
    }
}