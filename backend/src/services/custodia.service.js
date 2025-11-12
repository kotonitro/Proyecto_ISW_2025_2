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
  const endTime = 14 * 60; // 2:00 PM
  
  return currentTime >= startTime && currentTime < endTime;
}

/**
 * Determina el estado de una bicicleta basado en el registro
 * almacenada: está en un bicicletero Y horaSalida es NULL
 * retirada: horaSalida no es NULL
 */
export function determineEstadoBicicleta(registro) {
  if (!registro) return null;
  
  if (registro.horaSalida === null && registro.bicicletero) {
    return "ALMACENADA";
  }
  
  if (registro.horaSalida !== null) {
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
    horaSalida: null,
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
    horaEntrada: new Date(),
  });

  const registroGuardado = await registroAlmacenRepository.save(nuevoRegistro);
  
  return {
    ...registroGuardado,
    estadoBicicleta: determineEstadoBicicleta(registroGuardado),
  };
}

//registra la salida de una bicicleta
export async function registerSalida(idRegistroAlmacen, idEncargado) {
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

  if (registro.horaSalida !== null) {
    throw new Error(`El registro ${idRegistroAlmacen} ya tiene una salida registrada`);
  }

  // Actualizar el registro con la hora de salida
  registro.horaSalida = new Date();


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
    .where("registro.horaSalida IS NULL")
    .andWhere("registro.bicicletero IS NOT NULL")
    .orderBy("registro.horaEntrada", "DESC")
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
    .where("registro.horaSalida IS NOT NULL")
    .orderBy("registro.horaSalida", "DESC")
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

  if (filtros.idEncargado) {
    query = query.where("registro.idEncargado = :idEncargado", { 
      idEncargado: filtros.idEncargado 
    });
  }

  if (filtros.estado) {
    // estado filtrado por horaSalida
    if (filtros.estado === "entrada") {
      query = query.andWhere("registro.horaSalida IS NULL");
    } else if (filtros.estado === "salida") {
      query = query.andWhere("registro.horaSalida IS NOT NULL");
    }
  }

  if (filtros.rutUsuario) {
    query = query.andWhere("registro.rutUsuario = :rutUsuario", { 
      rutUsuario: filtros.rutUsuario 
    });
  }

  if (filtros.estadoBicicleta) {
    if (filtros.estadoBicicleta === "ALMACENADA") {
      query = query.andWhere("registro.horaSalida IS NULL");
    } else if (filtros.estadoBicicleta === "RETIRADA") {
      query = query.andWhere("registro.horaSalida IS NOT NULL");
    }
  }

  const registros = await query.orderBy("registro.horaEntrada", "DESC").getMany();
  
  // Agregar el estado calculado a cada registro
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
