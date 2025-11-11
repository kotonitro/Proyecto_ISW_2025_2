import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findEncargadoByEmail } from "./encargado.service.js";

export async function loginEncargado(email, contrasena) {
  const encargado = await findEncargadoByEmail(email);
  if (!encargado) {
    throw new Error("Credenciales incorrectas");
  }

  const isMatch = await bcrypt.compare(contrasena, encargado.contrasena);
  if (!isMatch) {
    throw new Error("Credenciales incorrectas");
  }

  const payload = { sub: encargado.idEncargado, email: encargado.email };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

  delete encargado.contrasena;
  return { encargado, token };
}
