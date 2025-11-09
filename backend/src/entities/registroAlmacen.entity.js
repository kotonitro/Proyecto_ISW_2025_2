import { EntitySchema } from "typeorm";
import { Bicicletero } from "./bicicletero.entity.js";
import { Bicicleta } from "./bicicleta.entity.js";
import { Encargado } from "./encargado.entity.js";

export const registroAlmacen = new EntitySchema({
  name: "RegistroAlmacen",
  tableName: "registroalmacen",
  columns: {
    idRegistroAlmacen: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    idEncargado: {
      type: "int",
      nullable: false,
    },
    idBicicletero: {
      type: "int",
      nullable: false,
    },
    idBicicleta: {
      type: "int",
      nullable: false,
    },
    fechaEntrada: {
      type: "date",
      nullable: false,
    },
    fechaSalida: {
      type: "date",
      nullable: true,
    },
  },
  relations: {
    bicicletero: {
      type: "many-to-one",
      target: () => Bicicletero,
      joinColumn: {
        name: "idBicicletero",
      },
    },
    bicicleta: {
      type: "many-to-one",
      target: () => Bicicleta,
      joinColumn: {
        name: "idBicicleta",
      },
    },
    encargado: {
      type: "many-to-one",
      target: () => Encargado,
      joinColumn: {
        name: "idEncargado",
      },
    },
  },
});
