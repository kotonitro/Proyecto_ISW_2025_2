import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";
import {
  registerEntrada,
  registerSalida,
  getAllRegistros,
  getRegistroById,
  getBicicletasAlmacenadas,
  getBicicletasRetiradas,
} from "../services/custodia.service.js";
import { AppDataSource } from "../config/configDB.js"; // Verifica que la ruta sea correcta según tu estructura

// Registra la entrada de una bicicleta
// En custodia.controller.js
export async function createEntrada(req, res) {
  try {
    const { 
      rutUsuario, 
      idBicicleta, 
      idBicicletero, 
      nombreUsuario, 
      emailUsuario, 
      telefonoUsuario 
    } = req.body;
    
    // CAMBIO CLAVE: Usar req.encargado en lugar de req.user
    const idEncargado = req.encargado.idEncargado || req.encargado.idUsuario || req.encargado.id;

    if (!idEncargado) {
      return handleErrorClient(res, 401, "No se pudo identificar al encargado en el token.");
    }

    const registro = await registerEntrada(
      { rutUsuario, idBicicleta, idBicicletero, nombreUsuario, emailUsuario, telefonoUsuario },
      idEncargado
    );

    return handleSuccess(res, 201, "Entrada registrada", registro);
  } catch (error) {
    return handleErrorClient(res, 400, error.message);
  }
}

// Registra la salida de una bicicleta
// src/controllers/custodia.controller.js

export async function createSalida(req, res) {
  try {
    console.log("Intentando salida...");
    console.log("REQ.USER es:", req.user);           // ¿Existe esto?
    console.log("REQ.ENCARGADO es:", req.encargado);
    const { idRegistroAlmacen, fechaSalida } = req.body;
    
    // --- ESTA ES LA LÍNEA CLAVE ---
    // NO uses req.user, USA req.encargado
    const idEncargado = req.encargado.idEncargado || req.encargado.idUsuario || req.encargado.id;
    // ------------------------------

    if (!idEncargado) {
       return handleErrorClient(res, 401, "No se pudo identificar al encargado.");
    }

    const registro = await registerSalida(idRegistroAlmacen, idEncargado, fechaSalida);

    return handleSuccess(res, 201, "Salida registrada correctamente", registro);
  } catch (error) {
    return handleErrorClient(res, 400, error.message);
  }
}

// Obtiene todos los registros (MODIFICADO PARA SOPORTAR BÚSQUEDA POR ID BICI)
export async function getRegistros(req, res) {
  try {
    // Agregamos idBicicleta a la desestructuración del query
    const { idEncargado, rutUsuario, estadoBicicleta, idBicicleta } = req.query;

    const filtros = {};
    if (idEncargado) filtros.idEncargado = parseInt(idEncargado);
    if (rutUsuario) filtros.rutUsuario = rutUsuario;
    if (estadoBicicleta) filtros.estadoBicicleta = estadoBicicleta;
    
    // NUEVO: Filtro para el buscador del frontend
    if (idBicicleta) filtros.idBicicleta = parseInt(idBicicleta);

    const registros = await getAllRegistros(filtros);

    return handleSuccess(res, 200, "Registros obtenidos correctamente", registros);
  } catch (error) {
    return handleErrorServer(res, 500, "Error al obtener registros", error.message);
  }
}

// Registro específico
export async function getRegistroDetalle(req, res) {
  try {
    const { id } = req.params;
    const registro = await getRegistroById(parseInt(id));

    if (!registro) {
      return handleErrorClient(res, 404, `Registro con ID ${id} no encontrado`, null);
    }

    return handleSuccess(res, 200, "Registro obtenido correctamente", registro);
  } catch (error) {
    return handleErrorServer(res, 500, "Error al obtener el registro", error.message);
  }
}

// Bicicletas almacenadas (Para la lista "Hoy")
export async function getBicicletasAlmacendasController(req, res) {
  try {
    const bicicletas = await getBicicletasAlmacenadas();
    return handleSuccess(res, 200, "Bicicletas almacenadas obtenidas correctamente", bicicletas);
  } catch (error) {
    return handleErrorServer(res, 500, "Error al obtener bicicletas almacenadas", error.message);
  }
}

// Bicicletas retiradas
export async function getBicicletasRetiradasController(req, res) {
  try {
    const bicicletas = await getBicicletasRetiradas();
    return handleSuccess(res, 200, "Bicicletas retiradas obtenidas correctamente", bicicletas);
  } catch (error) {
    return handleErrorServer(res, 500, "Error al obtener bicicletas retiradas", error.message);
  }
}

export async function getDisponibilidadBicicleteros(req, res) {
  try {
    // Usamos el AppDataSource importado para obtener los repositorios
    const bicicleteroRepo = AppDataSource.getRepository("Bicicletero");
    const registroRepo = AppDataSource.getRepository("RegistroAlmacen");

    const bicicleteros = await bicicleteroRepo.find();
    
    const disponibilidad = await Promise.all(bicicleteros.map(async (b) => {
  const ocupados = await registroRepo.countBy({
    idBicicletero: b.idBicicletero,
    fechaSalida: null 
  });

  return {
    id: b.idBicicletero,
    title: b.nombre, // Ahora sí usamos b.nombre
    location: b.ubicacion,
    ocupados: ocupados,
    total: b.capacidad 
  };
}));

    // Importante: Enviar la respuesta con la estructura que espera tu frontend
    return res.status(200).json({ status: "Success", data: disponibilidad });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "Error", message: error.message });
  }
}