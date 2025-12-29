import { AppDataSource } from "../config/configDB.js";
import { Usuario } from "../models/usuario.entity.js";

export const userRepository = AppDataSource.getRepository(Usuario);

export async function createUsuario(data) {
  const newUsuario = userRepository.create(data);
  return await userRepository.save(newUsuario);
}

export async function getUsuarioByRut(rut) {
  // Devolver también las bicicletas relacionadas para que el cliente pueda
  // obtener `usuario.bicicletas` y extraer `idBicicleta` cuando sea necesario.
  const usuario = await userRepository.findOne({
    where: { rut },
    relations: ["bicicletas"],
  });
  return usuario;
}

export async function getUsuarioById(idUsuario) {
  const usuario = await userRepository.findOne({
    where: { idUsuario },
    relations: ["bicicletas"],
  });
  return usuario;
}

export async function getUsuarioByTelefono(telefono) {
  const usuario = await userRepository.findOne({
    where: { telefono },
  });
  return usuario;
}

export async function getUsuarios() {
  // Incluir bicicletas en el listado para facilitar vistas administrativas.
  const usuarios = await userRepository.find({ relations: ["bicicletas"] });
  return usuarios;
}

export async function deleteUsuario(rut) {
  const Usuario = await getUsuarioByRut(rut);
  if (!Usuario) {
    throw new Error("Usuario no encontrado");
  }

  // Repositorios necesarios para eliminación en cascada manual
  const bicicletaRepository = AppDataSource.getRepository("Bicicleta");
  const registroRepository = AppDataSource.getRepository("RegistroAlmacen");
  const informeRepository = AppDataSource.getRepository("Informe");

  // 1. Obtener bicicletas del usuario
  const bicicletas = await bicicletaRepository.find({
    where: { idUsuario: Usuario.idUsuario },
  });

  for (const bici of bicicletas) {
    // 2. Eliminar Informes vinculados directamente a la bicicleta
    // Nota: Dependiendo de la definición de entidad, podría ser 'bicicleta' o 'idBicicleta' en el where
    const informesBici = await informeRepository.find({
      where: { bicicleta: { idBicicleta: bici.idBicicleta } },
    });
    if (informesBici.length > 0) {
      await informeRepository.remove(informesBici);
    }

    // 3. Manejar Registros de Almacén
    const registros = await registroRepository.find({
      where: { idBicicleta: bici.idBicicleta },
    });
    for (const reg of registros) {
      // Eliminar informes vinculados al registro
      const informesReg = await informeRepository.find({
        where: { idRegistroAlmacen: reg.idRegistroAlmacen },
      });
      if (informesReg.length > 0) {
        await informeRepository.remove(informesReg);
      }
      // Eliminar el registro de almacén
      await registroRepository.remove(reg);
    }

    // 4. Eliminar la bicicleta
    await bicicletaRepository.remove(bici);
  }

  // 5. Finalmente eliminar el usuario
  await userRepository.remove(Usuario);
  return true;
}

export async function updateUsuario(rut, data) {
  const Usuario = await getUsuarioByRut(rut);
  if (!Usuario) {
    throw new Error("Usuario no encontrado");
  }
  userRepository.merge(Usuario, data);
  const resultado = await userRepository.save(Usuario);
  return resultado;
}
