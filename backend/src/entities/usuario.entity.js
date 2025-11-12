import { EntitySchema } from "typeorm";

export const Usuario = new EntitySchema({
  name: "Usuario",
  tableName: "usuarios",
  columns: {
    idUsuario: {
      primary: true,
      type: "int",
      generated: "increment",
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
      nullable: false,
    },
    email: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    telefono: {
      type: "int",
      unique: true,
    },
  },
  relations: {
    bicicletas: {
      type: "one-to-many",
      target: "Bicicleta", 
      inverseSide: "usuario", 
    },
  },
});
