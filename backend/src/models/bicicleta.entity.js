import { EntitySchema } from "typeorm";

export const Bicicleta = new EntitySchema({
  name: "Bicicleta",
  tableName: "bicicletas",
  columns: {
    idBicicleta: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    idUsuario: {
      type: "int",
      nullable: false,
    },
    marca: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    modelo: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    color: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
  },
  relations: {
    usuario: {
      target: "Usuario",
      type: "many-to-one",
      joinColumn: {
        name: "idUsuario",
      },
    },
    registrosAlmacen: {
      type: "one-to-many",
      target: "RegistroAlmacen", 
      inverseSide: "bicicleta", 
    },
  },
});
