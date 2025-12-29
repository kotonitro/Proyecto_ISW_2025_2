import {handleSuccess,handleErrorClient,handleErrorServer,} from "../handlers/responseHandlers.js";
import {
  registerEntrada,
  registerSalida,
  getAllRegistros,
  getRegistroById,
  getBicicletasAlmacenadas,
  getBicicletasRetiradas,
  deleteRegistro,
  getHistorial,
  getUbicacionBicicleta,
} from "../services/custodia.service.js";
import { AppDataSource } from "../config/configDB.js";
import { registroEntradaValidation, registroSalidaValidation } from "../validations/registroAlmacen.validation.js";

export async function createEntrada(req, res) {
  try {
    
    const { error, value } = registroEntradaValidation.validate(req.body);

    if (error) {
      return handleErrorClient(res, 400, error.details[0].message);
    }

  
    const idEncargado =
      req.encargado.idEncargado || req.encargado.idUsuario || req.encargado.id;

    if (!idEncargado) {
      return handleErrorClient(
        res,
        401,
        "No se pudo identificar al encargado en el token."
      );
    }

    const registro = await registerEntrada(value, idEncargado);

    return handleSuccess(res, 201, "Entrada registrada", registro);
  } catch (error) {
    return handleErrorClient(res, 400, error.message);
  }
}

export async function createSalida(req, res) {
  try {
    console.log("Intentando salida...");
  
    const { error, value } = registroSalidaValidation.validate(req.body);

    if (error) {
      return handleErrorClient(res, 400, error.details[0].message);
    }

    const idEncargado =
      req.encargado.idEncargado || req.encargado.idUsuario || req.encargado.id;

    if (!idEncargado) {
      return handleErrorClient(
        res,
        401,
        "No se pudo identificar al encargado."
      );
    }

    const { idRegistroAlmacen, fechaSalida } = value;

    const registro = await registerSalida(
      idRegistroAlmacen,
      idEncargado,
      fechaSalida
    );

    return handleSuccess(res, 201, "Salida registrada correctamente", registro);
  } catch (error) {
    return handleErrorClient(res, 400, error.message);
  }
}

export async function getRegistros(req, res) {
  try {
    const { idEncargado, rutUsuario, estadoBicicleta, idBicicleta } = req.query;

    const filtros = {};
    if (idEncargado) filtros.idEncargado = parseInt(idEncargado);
    if (rutUsuario) filtros.rutUsuario = rutUsuario;
    if (estadoBicicleta) filtros.estadoBicicleta = estadoBicicleta;

    if (idBicicleta) filtros.idBicicleta = parseInt(idBicicleta);

    const registros = await getAllRegistros(filtros);

    return handleSuccess(
      res,
      200,
      "Registros obtenidos correctamente",
      registros
    );
  } catch (error) {
    return handleErrorServer(
      res,
      500,
      "Error al obtener registros",
      error.message
    );
  }
}

export async function getRegistroDetalle(req, res) {
  try {
    const { id } = req.params;
    const registro = await getRegistroById(parseInt(id));

    if (!registro) {
      return handleErrorClient(
        res,
        404,
        `Registro con ID ${id} no encontrado`,
        null
      );
    }

    return handleSuccess(res, 200, "Registro obtenido correctamente", registro);
  } catch (error) {
    return handleErrorServer(
      res,
      500,
      "Error al obtener el registro",
      error.message
    );
  }
}

// Bicicletas almacenadas "Hoy"
export async function getBicicletasAlmacendasController(req, res) {
  try {
    const bicicletas = await getBicicletasAlmacenadas();
    return handleSuccess(
      res,
      200,
      "Bicicletas almacenadas obtenidas correctamente",
      bicicletas
    );
  } catch (error) {
    return handleErrorServer(
      res,
      500,
      "Error al obtener bicicletas almacenadas",
      error.message
    );
  }
}

// Bicicletas retiradas
export async function getBicicletasRetiradasController(req, res) {
  try {
    const bicicletas = await getBicicletasRetiradas();
    return handleSuccess(
      res,
      200,
      "Bicicletas retiradas obtenidas correctamente",
      bicicletas
    );
  } catch (error) {
    return handleErrorServer(
      res,
      500,
      "Error al obtener bicicletas retiradas",
      error.message
    );
  }
}

export async function getDisponibilidadBicicleteros(req, res) {
  try {
    const bicicleteroRepo = AppDataSource.getRepository("Bicicletero");
    const registroRepo = AppDataSource.getRepository("RegistroAlmacen");

    const bicicleteros = await bicicleteroRepo.find();

    const disponibilidad = await Promise.all(
      bicicleteros.map(async (b) => {
        const ocupados = await registroRepo
          .createQueryBuilder("registro")
          .where("registro.idBicicletero = :idBicicletero", {
            idBicicletero: b.idBicicletero,
          })
          .andWhere("registro.fechaSalida IS NULL")
          .getCount();

        console.log(
          `[CAPACIDAD] Bicicletero ${b.idBicicletero} (${b.nombre}): ${ocupados} / ${b.capacidad}`
        );

        return {
          id: b.idBicicletero,
          title: b.nombre,
          location: b.ubicacion,
          ocupados: ocupados,
          total: b.capacidad,
          activo: b.activo,
          imagen: b.imagen
        };
      })
    );

    // Enviar la respuesta con la estructura que necesitamos
    return res.status(200).json({ status: "Success", data: disponibilidad });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "Error", message: error.message });
  }
}

export async function deleteRegistroController(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return handleErrorClient(res, 400, "El ID del registro es requerido");
    }

    await deleteRegistro(id);
    return handleSuccess(res, 200, "Registro eliminado correctamente", null);
  } catch (error) {
    if (error.message && error.message.includes("no encontrado")) {
      return handleErrorClient(res, 404, error.message);
    }
    return handleErrorServer(
      res,
      500,
      "Error al eliminar el registro",
      error.message
    );
  }
}

export async function getHistorialController(req, res) {
  try {
    const { idBicicleta, rutUsuario } = req.query;

    const filtros = {};
    if (idBicicleta) filtros.idBicicleta = parseInt(idBicicleta);
    if (rutUsuario) filtros.rutUsuario = rutUsuario;

    const historial = await getHistorial(filtros);

    return handleSuccess(
      res,
      200,
      "Historial obtenido correctamente",
      historial
    );
  } catch (error) {
    return handleErrorServer(
      res,
      500,
      "Error al obtener historial",
      error.message
    );
  }
}

export async function getUbicacionController(req, res) {
  try {
    const { rut } = req.params;
    if (!rut) {
      return handleErrorClient(res, 400, "El RUT es requerido");
    }

    const ubicacion = await getUbicacionBicicleta(rut);
    return handleSuccess(
      res,
      200,
      "Ubicación obtenida correctamente",
      ubicacion
    );
  } catch (error) {
    return handleErrorServer(
      res,
      500,
      "Error al obtener la ubicación",
      error.message
    );
  }
}