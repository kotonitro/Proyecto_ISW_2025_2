import { getBicicleteroById, createBicicletero, deleteBicicletero } from "../services/bicicletero.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";
import { bicicleteroValidation } from "../validations/bicicletero.validation.js";

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
    const idBicicletero = req.body.idBicicletero;

    try {
        const Bicicletero = await getBicicleteroById(idBicicletero);
        if (!Bicicletero) {
            return res.status(404).json({ message: "Bicicletero no encontrado" });
        }
        await deleteBicicletero(idBicicletero)
        handleSuccess(res, 201, "Bicicletero eliminado exitosamente");
    } catch (error) {
        handleErrorServer(res, 500, "Error interno al eliminar el bicicletero", error.message);
    }
}