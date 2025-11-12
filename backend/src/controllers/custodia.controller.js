import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";
import {
  registerEntrada,
  registerSalida,
  getAllRegistros,
  getRegistroById,
  getBicicletasAlmacenadas,
  getBicicletasRetiradas,
} from "../services/custodia.service.js";

//registra la entrada de una bicicleta
export async function createEntrada(req, res) {
  try {
    const { rutUsuario, nombreUsuario, emailUsuario, telefonoUsuario, idBicicleta, idBicicletero } = req.body;
    const idEncargado = req.user.idEncargado || req.user.sub;

    const registro = await registerEntrada(
      {
        rutUsuario,
        nombreUsuario,
        emailUsuario,
        telefonoUsuario,
        idBicicleta,
        idBicicletero,
      },
      idEncargado
    );

    return handleSuccess(res, 201, "Entrada registrada correctamente", registro);
  } catch (error) {
    return handleErrorClient(res, 400, error.message, error.message);
  }
}

//registra la salida de una bicicleta
export async function createSalida(req, res) {
  try {
    const { idRegistroAlmacen } = req.body;
    const idEncargado = req.user.idEncargado || req.user.sub;

    const registro = await registerSalida(idRegistroAlmacen, idEncargado);

    return handleSuccess(res, 201, "Salida registrada correctamente", registro);
  } catch (error) {
    return handleErrorClient(res, 400, error.message, error.message);
  }
}

//obtiene todos los registros 
export async function getRegistros(req, res) {
  try {
  const { idEncargado, rutUsuario, estadoBicicleta } = req.query;

  const filtros = {};
  if (idEncargado) filtros.idEncargado = parseInt(idEncargado);
  if (rutUsuario) filtros.rutUsuario = rutUsuario;
  if (estadoBicicleta) filtros.estadoBicicleta = estadoBicicleta;

    const registros = await getAllRegistros(filtros);

    return handleSuccess(res, 200, "Registros obtenidos correctamente", registros);
  } catch (error) {
    return handleErrorServer(res, 500, "Error al obtener registros", error.message);
  }
}

//registro específico
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
    return handleErrorServer(res, 500, "Error al obtener el registro", error.message);
  }
}

//bicicletas almacenadas
export async function getBicicletasAlmacendasController(req, res) {
  try {
    const bicicletas = await getBicicletasAlmacenadas();
    return handleSuccess(res, 200, "Bicicletas almacenadas obtenidas correctamente", bicicletas);
  } catch (error) {
    return handleErrorServer(res, 500, "Error al obtener bicicletas almacenadas", error.message);
  }
}

//bicicletas retiradas
export async function getBicicletasRetiradasController(req, res) {
  try {
    const bicicletas = await getBicicletasRetiradas();
    return handleSuccess(res, 200, "Bicicletas retiradas obtenidas correctamente", bicicletas);
  } catch (error) {
    return handleErrorServer(res, 500, "Error al obtener bicicletas retiradas", error.message);
  }
}
