import { EntitySchema } from "typeorm";

export const HistorialCustodia = new EntitySchema({
  name: "HistorialCustodia",
  tableName: "historialcustodia",
  columns: {
    idHistorialCustodia: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    idRegistroAlmacen: {
      type: "int",
      nullable: false,
    },
    idEncargado: {
      type: "int",
      nullable: true,
    },
    idBicicletero: {
      type: "int",
      nullable: true,
    },
    idBicicleta: {
      type: "int",
      nullable: true,
    },
    rutUsuario: {
      type: "varchar",
      length: 12,
      nullable: true,
    },
    nombreUsuario: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    emailUsuario: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    telefonoUsuario: {
      type: "int",
      nullable: true,
    },
    fechaEntrada: {
      type: "timestamp",
      nullable: false,
    },
    fechaSalida: {
      type: "timestamp",
      nullable: false,
    },
    createdAt: {
      type: "timestamp",
      nullable: false,
      default: () => "CURRENT_TIMESTAMP",
    },
  },
});
