import { Encargado } from "../entities/encargado.entity.js";
import { AppDataSource } from "./configDB.js";
import bcrypt from "bcrypt";

async function encryptPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

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
          telefono: "12312312",
        }),
      ),
    ]);
    console.log("Admin creado satisfactoriamente");
  } catch (error) {
    console.error("Error al crear el administrador:", error);
  }
}
