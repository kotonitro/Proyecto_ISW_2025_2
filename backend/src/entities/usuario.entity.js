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
      length: 8,
      unique: true,
      nullable: false,
    },
    nombre: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
  },
});
