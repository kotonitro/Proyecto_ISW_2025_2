import { EntitySchema } from "typeorm";

export const Encargado = new EntitySchema({
  name: "Encargado",
  tableName: "encargados",
  columns: {
    idEncargado: {
      type: "int",
      primary: true,
      generated: "increment",
    },
    esAdmin: {
      type: "boolean",
      default: false,
      nullable: false,
    },
    rut: {
      type: "varchar",
      length: 10,
      unique: true,
      nullable: false,
    },
    nombre: {
      type: "varchar",
      length: 255,
    },
    email: {
      type: "varchar",
      length: 255,
      unique: true,
      nullable: false,
    },
    contrasena: {
      type: "varchar",
      length: 16,
      nullable: false,
    },
    telefono: {
      type: "int",
      unique: true,
      nullable: false,
    },
    esAdmin: {
      type: "boolean",
      default: false,
    },
  },
});
