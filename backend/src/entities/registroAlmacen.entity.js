import { EntitySchema } from "typeorm";

export const RegistroAlmacen = new EntitySchema({
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
    rutUsuario: {
      type: "varchar",
      length: 8,
      nullable: false,
    },
    nombreUsuario: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    emailUsuario: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    telefonoUsuario: {
      type: "int",
      nullable: false,
    },
    fechaEntrada: {
      type: "timestamp",
      nullable: false,
      default: () => "CURRENT_TIMESTAMP",
    },
    fechaSalida: {
      type: "timestamp",
      nullable: true,
    },
  },
  relations: {
    bicicletero: {
      type: "many-to-one",
      target: "Bicicletero",
      joinColumn: {
        name: "idBicicletero",
      },
    },
    bicicleta: {
      type: "many-to-one",
      target: "Bicicleta",
      joinColumn: {
        name: "idBicicleta",
      },
    },
    encargado: {
      type: "many-to-one",
      target: "Encargado",
      joinColumn: {
        name: "idEncargado",
      },
    },
  informes: {
      type: "one-to-many",
      target: "Informe",
      inverseSide: "registrosAlmacen"
    },
  },
});
