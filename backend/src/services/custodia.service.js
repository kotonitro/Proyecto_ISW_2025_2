import { AppDataSource } from "../config/configDB.js";

export const registroAlmacenRepository =
  AppDataSource.getRepository("RegistroAlmacen");
export const usuarioRepository = AppDataSource.getRepository("Usuario");
export const bicicletaRepository = AppDataSource.getRepository("Bicicleta");
export const historialCustodiaRepository =
  AppDataSource.getRepository("HistorialCustodia");

export function isWithinAllowedHours() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentTime = hours * 60 + minutes;

  const startTime = 7 * 60 + 30; // 7:30 AM
  const endTime = 20 * 60; // 8:00 PM

  const day = now.getDay();
  const isWeekday = day >= 1 && day <= 5;
  return isWeekday && currentTime >= startTime && currentTime < endTime;
}

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
    throw new Error(
      "El registro de entrada sólo está permitido de lunes a viernes entre 7:30 y 20:00."
    );
  }

  // Validar que el usuario exista en el sistema
  const usuario = await usuarioRepository.findOneBy({ rut: data.rutUsuario });
  if (!usuario) {
    throw new Error(
      `Usuario con RUT ${data.rutUsuario} no existe en el sistema`
    );
  }

  // Validar que los datos del usuario coincidan
  if (usuario.nombre !== data.nombreUsuario) {
    throw new Error(
      `El nombre no coincide con el registrado para el RUT ${data.rutUsuario}`
    );
  }
  if (usuario.email !== data.emailUsuario) {
    throw new Error(
      `El email no coincide con el registrado para el RUT ${data.rutUsuario}`
    );
  }
  if (usuario.telefono !== data.telefonoUsuario) {
    throw new Error(
      `El teléfono no coincide con el registrado para el RUT ${data.rutUsuario}`
    );
  }

  // Validar que la bicicleta exista
  const bicicleta = await bicicletaRepository.findOneBy({
    idBicicleta: data.idBicicleta,
  });
  if (!bicicleta) {
    throw new Error(
      `Bicicleta con ID ${data.idBicicleta} no existe en el sistema`
    );
  }

  // Validar que el bicicletero exista
  const bicicleteroRepository = AppDataSource.getRepository("Bicicletero");
  const bicicletero = await bicicleteroRepository.findOneBy({
    idBicicletero: data.idBicicletero,
  });
  if (!bicicletero) {
    throw new Error(
      `Bicicletero con ID ${data.idBicicletero} no existe en el sistema`
    );
  }

  // Validar que no haya una entrada pendiente de salida para esta bicicleta
  const registroActivo = await registroAlmacenRepository.findOneBy({
    idBicicleta: data.idBicicleta,
    fechaSalida: null,
  });
  if (registroActivo) {
    throw new Error(`Bicicleta ya almacenada.`);
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

//eliminar registro de custodia y guardar en historial
export async function registerSalida(
  idRegistroAlmacen,
  idEncargado,
  fechaSalida
) {
  // Validar horario
  if (!isWithinAllowedHours()) {
    throw new Error(
      "La eliminación de registro sólo está permitida de lunes a viernes entre 7:30 y 20:00."
    );
  }

  // Buscar el registro
  const registro = await registroAlmacenRepository.findOneBy({
    idRegistroAlmacen: parseInt(idRegistroAlmacen),
  });

  if (!registro) {
    throw new Error(`Registro con ID ${idRegistroAlmacen} no existe`);
  }

  console.log(
    `[ELIMINAR] Guardando registro ID: ${idRegistroAlmacen} en historial antes de eliminar`
  );

  // Crear entrada en historial antes de eliminar
  const historialEntry = historialCustodiaRepository.create({
    idRegistroAlmacen: registro.idRegistroAlmacen,
    idEncargado: registro.idEncargado,
    idBicicletero: registro.idBicicletero,
    idBicicleta: registro.idBicicleta,
    rutUsuario: registro.rutUsuario,
    nombreUsuario: registro.nombreUsuario,
    emailUsuario: registro.emailUsuario,
    telefonoUsuario: registro.telefonoUsuario,
    fechaEntrada: registro.fechaEntrada,
    fechaSalida: new Date(),
  });

  await historialCustodiaRepository.save(historialEntry);
  console.log(`[HISTORIAL] Registro guardado en historial`);

  // Eliminar el registro de la tabla activa
  await registroAlmacenRepository.remove(registro);

  console.log(`[ELIMINAR] Registro eliminado de tabla activa exitosamente`);

  return { message: "Registro eliminado y guardado en historial" };
}

//obteer bicicletas almacenadas
export async function getBicicletasAlmacenadas() {
  return await registroAlmacenRepository
    .createQueryBuilder("registro")
    .leftJoinAndSelect("registro.bicicleta", "bicicleta")
    .leftJoinAndSelect("registro.bicicletero", "bicicletero")
    .leftJoinAndSelect("registro.encargado", "encargado")
    .where("registro.fechaSalida IS NULL")
    .orderBy("registro.fechaEntrada", "DESC")
    .getMany()
    .then((registros) =>
      registros.map((r) => ({
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
    .then((registros) =>
      registros.map((r) => ({
        ...r,
        estadoBicicleta: "RETIRADA",
      }))
    );
}

//todos los registros del almacen
export async function getAllRegistros(filtros = {}) {
  let query = registroAlmacenRepository
    .createQueryBuilder("registro")
    .leftJoinAndSelect("registro.bicicleta", "bicicleta")
    .leftJoinAndSelect("registro.bicicletero", "bicicletero")
    .leftJoinAndSelect("registro.encargado", "encargado");

  // Filtro por Encargado
  if (filtros.idEncargado) {
    query = query.where("registro.idEncargado = :idEncargado", {
      idEncargado: filtros.idEncargado,
    });
  }

  // Filtro por RUT de Usuario
  if (filtros.rutUsuario) {
    query = query.andWhere("registro.rutUsuario = :rutUsuario", {
      rutUsuario: filtros.rutUsuario,
    });
  }

  // NUEVO: Filtro para el Buscador del Frontend (ID Bicicleta)
  if (filtros.idBicicleta) {
    query = query.andWhere("registro.idBicicleta = :idBicicleta", {
      idBicicleta: filtros.idBicicleta,
    });
  }

  // Filtro por Estado (ALMACENADA/RETIRADA)
  if (filtros.estadoBicicleta) {
    if (
      filtros.estadoBicicleta === "entrada" ||
      filtros.estadoBicicleta === "ALMACENADA"
    ) {
      query = query.andWhere("registro.fechaSalida IS NULL");
    } else if (
      filtros.estadoBicicleta === "salida" ||
      filtros.estadoBicicleta === "RETIRADA"
    ) {
      query = query.andWhere("registro.fechaSalida IS NOT NULL");
    }
  }

  const registros = await query
    .orderBy("registro.fechaEntrada", "DESC")
    .getMany();

  // Agregar el estado calculado a cada registro para el frontend
  return registros.map((r) => ({
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

//eliminar un registro de custodia
export async function deleteRegistro(idRegistroAlmacen) {
  const registro = await registroAlmacenRepository.findOneBy({
    idRegistroAlmacen: parseInt(idRegistroAlmacen),
  });

  if (!registro) {
    throw new Error(`Registro con ID ${idRegistroAlmacen} no encontrado`);
  }

  await registroAlmacenRepository.remove(registro);
  return true;
}

//obtener historial de custodia
export async function getHistorial(filtros = {}) {
  let query = historialCustodiaRepository.createQueryBuilder("historial");

  // Filtro por ID de Bicicleta
  if (filtros.idBicicleta) {
    query = query.where("historial.idBicicleta = :idBicicleta", {
      idBicicleta: filtros.idBicicleta,
    });
  }

  // Filtro por RUT de Usuario
  if (filtros.rutUsuario) {
    query = query.andWhere("historial.rutUsuario = :rutUsuario", {
      rutUsuario: filtros.rutUsuario,
    });
  }

  const registros = await query
    .orderBy("historial.fechaSalida", "DESC")
    .getMany();

  return registros;
}

export async function getUbicacionBicicleta(rutUsuario) {
  const registros = await registroAlmacenRepository.find({
    where: {
      rutUsuario: rutUsuario,
      fechaSalida: null, // Solo registros activos (bicicleta en custodia)
    },
    relations: ["bicicleta", "bicicletero"],
  });

  return registros.map((r) => ({
    idRegistro: r.idRegistroAlmacen,
    bicicleta: {
      marca: r.bicicleta.marca,
      modelo: r.bicicleta.modelo,
      color: r.bicicleta.color,
    },
    bicicletero: {
      nombre: r.bicicletero.nombre,
      ubicacion: r.bicicletero.ubicacion,
      imagen: r.bicicletero.imagen,
    },
    fechaEntrada: r.fechaEntrada,
  }));
}
