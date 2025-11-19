import { getEncargados, createEncargado, deleteEncargado, getEncargadoById, getEncargadoByEmail, getEncargadoByRut, getEncargadoByTelefono } from "../services/encargado.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";
import { encargadoValidation } from "../validations/encargado.validation.js";

export async function handleGetEncargados(req, res){
    try {
        const Encargados = await getEncargados();
        return handleSuccess(res, 200, "Encargados obtenidos correctamente.", Encargados);
    } catch (error) {
        return handleErrorServer(res, 500, "Error interno al obtener los encargados.", error.message);
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

        if (await getEncargadoByEmail(value.email)) {
            return handleErrorClient(res, 409, "Ya existe un encargado con ese email.");
        }

        if (await getEncargadoByRut(value.rut)) {
            return handleErrorClient(res, 409, "Ya existe un encargado con ese rut.");
        }
    
        if (await getEncargadoByTelefono(value.telefono)) {
            return handleErrorClient(res, 409, "Ya existe un encargado con ese teléfono.");
        }

        const newEncargado = await createEncargado(value);
        handleSuccess(res, 201, "Encargado creado correctamente.", newEncargado);
    } catch (error) {
        handleErrorServer(res, 500, "Error interno al crear el encargado.", error.message);
    }
}

export async function handleDeleteEncargado(req, res) {
    const { id } = req.params;
    const idEncargado = parseInt(id, 10)
    const idAdminLogueado = req.encargado.id
    const Encargado = await getEncargadoById(idEncargado);

    if (isNaN(idEncargado)) {
        return handleErrorClient(res, 400, "El ID del encargado debe ser un numero.");
    }

    try {

        if (idEncargado == idAdminLogueado){
            return handleErrorClient(res, 403, "No puedes eliminarte a ti mismo.");
        }

        if (Encargado.esAdmin === true) {
            return handleErrorClient(res, 403, "No puedes eliminar a otro administrador.");
        }

        if (!Encargado){
            return handleErrorClient(res, 404, "Encargado no encontrado.");
        }

        await deleteEncargado(idEncargado);
        handleSuccess(res, 200, "Encargado eliminado correctamente.");

    } catch (error) {
        handleErrorServer(res, 500, "Error interno al eliminar el encargado.", error.message);
    }
}