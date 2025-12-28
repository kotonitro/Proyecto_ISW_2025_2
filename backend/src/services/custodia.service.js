import { AppDataSource } from "../config/configDB.js";

export const registroAlmacenRepository = AppDataSource.getRepository("RegistroAlmacen");
export const usuarioRepository = AppDataSource.getRepository("Usuario");
export const bicicletaRepository = AppDataSource.getRepository("Bicicleta");


//Valida si la hora actual está dentro del horario permitido 
 
export function isWithinAllowedHours() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentTime = hours * 60 + minutes;
  
  const startTime = 7 * 60 + 30; // 7:30 AM
  const endTime = 20 * 60; // 8:00 PM
  
  return currentTime >= startTime && currentTime < endTime;
}
  

/**
 * Determina el estado de una bicicleta basado en el registro
 * almacenada: está en un bicicletero Y fechaSalida es NULL
 * retirada: fechaSalida no es NULL
 */
export function determineEstadoBicicleta(registro) {
  if (!registro) return null;
  if (registro.fechaSalida === null && registro.bicicletero) {
    return "ALMACENADA";
  }
  if (registro.fechaSalida !== null) {
    return "RETIRADA";
  }
  return "DESCONOCIDO";
}

//registro entrada de bicicleta
export async function registerEntrada(data, idEncargado) {
  // Validar horario
  if (!isWithinAllowedHours()) {
    throw new Error("El registro de entrada solo es permitido entre 7:30 AM y 2:00 PM");
  }

  // Validar que el usuario exista en el sistema
  const usuario = await usuarioRepository.findOneBy({ rut: data.rutUsuario });
  if (!usuario) {
    throw new Error(`Usuario con RUT ${data.rutUsuario} no existe en el sistema`);
  }

  // Validar que los datos del usuario coincidan
  if (usuario.nombre !== data.nombreUsuario) {
    throw new Error(`El nombre no coincide con el registrado para el RUT ${data.rutUsuario}`);
  }
  if (usuario.email !== data.emailUsuario) {
    throw new Error(`El email no coincide con el registrado para el RUT ${data.rutUsuario}`);
  }
  if (usuario.telefono !== data.telefonoUsuario) {
    throw new Error(`El teléfono no coincide con el registrado para el RUT ${data.rutUsuario}`);
  }

  // Validar que la bicicleta exista
  const bicicleta = await bicicletaRepository.findOneBy({ 
    idBicicleta: data.idBicicleta 
  });
  if (!bicicleta) {
    throw new Error(`Bicicleta con ID ${data.idBicicleta} no existe en el sistema`);
  }

  // Validar que el bicicletero exista
  const bicicleteroRepository = AppDataSource.getRepository("Bicicletero");
  const bicicletero = await bicicleteroRepository.findOneBy({ 
    idBicicletero: data.idBicicletero 
  });
  if (!bicicletero) {
    throw new Error(`Bicicletero con ID ${data.idBicicletero} no existe en el sistema`);
  }

  // Validar que no haya una entrada pendiente de salida para esta bicicleta
  const registroActivo = await registroAlmacenRepository.findOneBy({
    idBicicleta: data.idBicicleta,
    fechaSalida: null,
  });
  if (registroActivo) {
    throw new Error(`La bicicleta ${data.idBicicleta} ya tiene un registro activo sin salida`);
  }

  // Crear el registro
  const nuevoRegistro = registroAlmacenRepository.create({
    idEncargado,
    idBicicletero: data.idBicicletero,
    idBicicleta: data.idBicicleta,
    rutUsuario: data.rutUsuario,
    nombreUsuario: data.nombreUsuario,
    emailUsuario: data.emailUsuario,
    telefonoUsuario: data.telefonoUsuario,
    fechaEntrada: data.fechaEntrada ? new Date(data.fechaEntrada) : new Date(),
  });

  const registroGuardado = await registroAlmacenRepository.save(nuevoRegistro);
  
  return {
    ...registroGuardado,
    estadoBicicleta: determineEstadoBicicleta(registroGuardado),
  };
}

//registra la salida de una bicicleta
export async function registerSalida(idRegistroAlmacen, idEncargado, fechaSalida) {
  // Validar horario
  if (!isWithinAllowedHours()) {
    throw new Error("El registro de salida solo es permitido entre 7:30 AM y 2:00 PM");
  }

  // Buscar el registro con sus relaciones
  const registro = await registroAlmacenRepository
    .createQueryBuilder("registro")
    .leftJoinAndSelect("registro.bicicletero", "bicicletero")
    .where("registro.idRegistroAlmacen = :id", { id: idRegistroAlmacen })
    .getOne();

  if (!registro) {
    throw new Error(`Registro con ID ${idRegistroAlmacen} no existe`);
  }

  if (registro.fechaSalida !== null) {
    throw new Error(`El registro ${idRegistroAlmacen} ya tiene una salida registrada`);
  }

  // Actualizar el registro con la fecha de salida (usar la proporcionada o la actual)
  registro.fechaSalida = fechaSalida ? new Date(fechaSalida) : new Date();

  const registroActualizado = await registroAlmacenRepository.save(registro);
  
  return {
    ...registroActualizado,
    estadoBicicleta: determineEstadoBicicleta(registroActualizado),
  };
}

//obteer bicicletas almacenadas
export async function getBicicletasAlmacenadas() {
  return await registroAlmacenRepository
    .createQueryBuilder("registro")
    .leftJoinAndSelect("registro.bicicleta", "bicicleta")
    .leftJoinAndSelect("registro.bicicletero", "bicicletero")
    .leftJoinAndSelect("registro.encargado", "encargado")
  .where("registro.fechaSalida IS NULL")
  .andWhere("registro.bicicletero IS NOT NULL")
  .orderBy("registro.fechaEntrada", "DESC")
    .getMany()
    .then(registros => 
      registros.map(r => ({
        ...r,
  estadoBicicleta: "ALMACENADA",
      }))
    );
}

//obtener bicicletas retiradas
export async function getBicicletasRetiradas() {
  return await registroAlmacenRepository
    .createQueryBuilder("registro")
    .leftJoinAndSelect("registro.bicicleta", "bicicleta")
    .leftJoinAndSelect("registro.bicicletero", "bicicletero")
    .leftJoinAndSelect("registro.encargado", "encargado")
  .where("registro.fechaSalida IS NOT NULL")
  .orderBy("registro.fechaSalida", "DESC")
    .getMany()
    .then(registros => 
      registros.map(r => ({
        ...r,
  estadoBicicleta: "RETIRADA",
      }))
    );
}

//todos los registros del almacen
export async function getAllRegistros(filtros = {}) {
  let query = registroAlmacenRepository.createQueryBuilder("registro")
    .leftJoinAndSelect("registro.bicicleta", "bicicleta")
    .leftJoinAndSelect("registro.bicicletero", "bicicletero")
    .leftJoinAndSelect("registro.encargado", "encargado");

  // Filtro por Encargado
  if (filtros.idEncargado) {
    query = query.where("registro.idEncargado = :idEncargado", { 
      idEncargado: filtros.idEncargado 
    });
  }

  // Filtro por RUT de Usuario
  if (filtros.rutUsuario) {
    query = query.andWhere("registro.rutUsuario = :rutUsuario", { 
      rutUsuario: filtros.rutUsuario 
    });
  }

  // NUEVO: Filtro para el Buscador del Frontend (ID Bicicleta)
  if (filtros.idBicicleta) {
    query = query.andWhere("registro.idBicicleta = :idBicicleta", { 
      idBicicleta: filtros.idBicicleta 
    });
  }

  // Filtro por Estado (ALMACENADA/RETIRADA)
  if (filtros.estadoBicicleta) {
    // Ajuste para coincidir con lo que envía el frontend ("entrada" o "salida")
    if (filtros.estadoBicicleta === "entrada" || filtros.estadoBicicleta === "ALMACENADA") {
      query = query.andWhere("registro.fechaSalida IS NULL");
    } else if (filtros.estadoBicicleta === "salida" || filtros.estadoBicicleta === "RETIRADA") {
      query = query.andWhere("registro.fechaSalida IS NOT NULL");
    }
  }

  const registros = await query.orderBy("registro.fechaEntrada", "DESC").getMany();
  
  // Agregar el estado calculado a cada registro para el frontend
  return registros.map(r => ({
    ...r,
    estadoBicicleta: determineEstadoBicicleta(r),
  }));
}

//registro específico
export async function getRegistroById(idRegistroAlmacen) {
  const registro = await registroAlmacenRepository
    .createQueryBuilder("registro")
    .leftJoinAndSelect("registro.bicicleta", "bicicleta")
    .leftJoinAndSelect("registro.bicicletero", "bicicletero")
    .leftJoinAndSelect("registro.encargado", "encargado")
    .where("registro.idRegistroAlmacen = :id", { id: idRegistroAlmacen })
    .getOne();
  
  if (!registro) return null;
  
  return {
    ...registro,
    estadoBicicleta: determineEstadoBicicleta(registro),
  };
}
