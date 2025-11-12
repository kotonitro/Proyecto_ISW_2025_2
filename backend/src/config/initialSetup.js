import { Encargado } from "../models/encargado.entity.js";
import { AppDataSource } from "./configDB.js";
import bcrypt from "bcrypt";

// Funcion para hashear contraseñas
async function encryptPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// Funcion para crear un Encargado con rol de Administrador
export async function createAdmin() {
  try {
    const encargadoRepository = AppDataSource.getRepository(Encargado);
    const count = await encargadoRepository.count();
    if (count > 0) return;

    const now = new Date();

    await Promise.all([
      encargadoRepository.save(
        encargadoRepository.create({
          nombre: "Admin",
          esAdmin: true,
          rut: "12345678-9",
          email: "admin@example.com",
          contrasena: await encryptPassword("123456"),
          telefono: "12345678",
        }),
      ),
    ]);
    console.log("Admin creado satisfactoriamente");
  } catch (error) {
    console.error("Error al crear el administrador:", error);
  }
}
