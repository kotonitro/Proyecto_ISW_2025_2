import jwt from "jsonwebtoken";
import { handleErrorClient } from "../handlers/responseHandlers.js";
import { JWT_SECRET } from "../config/configEnv.js";

export function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return handleErrorClient(
      res,
      401,
      "Acceso denegado. No se proporcionó token."
    );
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return handleErrorClient(res, 401, "Acceso denegado. Token malformado.");
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.encargado = payload;
    next();
  } catch (error) {
    return handleErrorClient(
      res,
      401,
      "Token inválido o expirado.",
      error.message
    );
  }
}

export function esAdmin(req, res, next) {
  if (req.encargado && req.encargado.esAdmin == true) {
    next();
  } else {
    return handleErrorClient(
      res,
      403,
      "Acceso denegado. Se requiere permiso de administrador."
    );
  }
}
