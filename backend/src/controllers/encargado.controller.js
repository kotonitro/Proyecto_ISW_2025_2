import { handleSuccess, handleErrorClient } from "../handlers/responseHandlers";
import { userRepository } from "../services/usuario.services.js";

export async function getUsuarios(req, res) {
  try {
    const usuarios = await userRepository.getAll();
    handleSuccess(res, usuarios);
  } catch (error) {
    handleErrorClient(res, error);
  }
}

export async function updateUsuario(req, res) {
  
}

export async function deleteUsuario(req, res) {
  try {
    const usuarioRut = req.usuario.sub;
    const usuario = await userRepository.findOneBy({ rut: usuarioRut });
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    await userRepository.remove(usuario);
    return res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al eliminar el usuario", error: error.message });
  }
}
