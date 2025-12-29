import { Encargado } from "../models/encargado.entity.js";
import { Bicicletero } from "../models/bicicletero.entity.js";
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

    await Promise.all([
      encargadoRepository.save(
        encargadoRepository.create({
          nombre: "Administrador",
          esAdmin: true,
          rut: "12345678-9",
          email: "admin@example.com",
          contrasena: await encryptPassword("123456"),
          telefono: "12345678",
        })
      ),
    ]);
    console.log("Admin creado satisfactoriamente");
  } catch (error) {
    console.error("Error al crear el administrador:", error);
  }
}

export async function createBicicleteros() {
  try {
    const bicicleteroRepository = AppDataSource.getRepository(Bicicletero);
    const count = await bicicleteroRepository.count();
    if (count > 0) return;

    // Asumiendo que el servidor corre en el puerto 3000 por defecto.
    // Si usas variable de entorno PORT, podrías importarla, pero localhost:3000 es estándar para desarrollo.
    const baseUrl = "http://localhost:3000/uploads";

    await Promise.all([
      bicicleteroRepository.save(
        bicicleteroRepository.create({
          nombre: "Bicicletero Face",
          ubicacion: "Frente a edificio Face",
          capacidad: 15,
        })
      ),
      bicicleteroRepository.save(
        bicicleteroRepository.create({
          nombre: "Bicicletero Gantes",
          ubicacion: "Detrás de edificio Gantes",
          capacidad: 15,
        })
      ),
      bicicleteroRepository.save(
        bicicleteroRepository.create({
          nombre: "Bicicletero Entrada",
          ubicacion: "Delante de entrada principal",
          capacidad: 15,
        })
      ),
      bicicleteroRepository.save(
        bicicleteroRepository.create({
          nombre: "Bicicletero Idiomas",
          ubicacion: "Al lado de edificio Idiomas",
          capacidad: 15,
        })
      ),
    ]);
    console.log("Bicicleteros creados satisfactoriamente");
  } catch (error) {
    console.error("Error al crear los bicicleteros:", error);
  }
}
