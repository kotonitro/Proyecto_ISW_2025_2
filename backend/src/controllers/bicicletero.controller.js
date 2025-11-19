import { getBicicleteros, createBicicletero, deleteBicicletero, getBicicleteroById, getBicicleteroByUbicacion } from "../services/bicicletero.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";
import { bicicleteroValidation } from "../validations/bicicletero.validation.js";

export async function handleGetBicicleteros(req, res){
    try {
        const Bicicleteros = await getBicicleteros();
        return handleSuccess(res, 200, "Bicicleteros obtenidos correctamente.", Bicicleteros);
    } catch (error) {
        return handleErrorServer(res, 500, "Error interno al obtener los bicicleteros.", error.message);
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
            
            return handleErrorClient(res, 400, "Error de validacion en los datos.", errorDetails);
        }

        if (await getBicicleteroByUbicacion(value.ubicacion)) {
            return handleErrorClient(res, 409, "Ya existe un bicicletero con esa ubicación.");
        }

        const newBicicletero = await createBicicletero(value);
        handleSuccess(res, 201, "Bicicletero creado correctamente.", newBicicletero);
    } catch (error) {
        handleErrorServer(res, 500, "Error interno al crear el bicicletero.", error.message);
    }
}

export async function handleDeleteBicicletero(req, res) {
    const { id } = req.params;
    const idBicicletero = parseInt(id, 10)
    const Bicicletero = getBicicleteroById(idBicicletero)
    
    if (isNaN(idBicicletero)) {
        return handleErrorClient(res, 400, "El ID del bicicletero debe ser un número.");
    }

    try {

        if (!Bicicletero){
            return handleErrorClient(res, 404, "Bicicletero no encontrado.");
        }

        await deleteBicicletero(idBicicletero);
        handleSuccess(res, 200, "Bicicletero eliminado correctamente.");

    } catch (error) {
        handleErrorServer(res, 500, "Error interno al eliminar el bicicletero.", error.message);
    }
}