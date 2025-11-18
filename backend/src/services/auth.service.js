import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getEncargadoByEmail } from "./encargado.service.js";

export async function loginEncargado(email, contrasena) {
  const encargado = await getEncargadoByEmail(email);
  if (!encargado) {
    throw new Error("Credenciales incorrectas");
  }

  const isMatch = await bcrypt.compare(contrasena, encargado.contrasena);
  if (!isMatch) {
    throw new Error("Credenciales incorrectas");
  }

  const payload = { 
    id: encargado.idEncargado, 
    email: encargado.email,
    esAdmin: encargado.esAdmin,
    nombre: encargado.nombre
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

  delete encargado.contrasena;
  return { encargado, token };
}
