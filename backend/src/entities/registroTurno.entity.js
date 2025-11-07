import { EntitySchema } from 'typeorm';
import { Bicicletero } from "./bicicletero.entity.js";
import { Encargado } from "./encargado.entity.js";

export const RegistroTurno = new EntitySchema({
  name: 'RegistroTurno',
  tableName: 'registro_turnos',
  columns: {
    idRegistroTurno: {
      primary: true,
      type: 'int',
      generated: 'increment',
    },
    idBicicletero: {
      type: 'int',
    },
    idEncargado: {
      type: 'int',
    },
    fechaInicio: {
      type: 'date',
      nullable: false,
    },
    fechaFin: {
      type: 'date',
      nullable: true,
    },
  },
  relations: {
    bicicletero: {
      type: 'many-to-one',
      target: () => Bicicletero,
      joinColumn: {
        name: 'idBicicletero',
      },
    },
    encargado: {
      type: 'many-to-one',
      target: () => Encargado,
      joinColumn: {
        name: 'idEncargado',
      },
    },
  },
});