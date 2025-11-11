import { EntitySchema } from "typeorm";

export const Informe = new EntitySchema({
  name: "Informe",
  tableName: "informes",
  columns: {
    idInforme: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    idEncargado: {
      type: "int",
    },
    idRegistroAlmacen: {
      type: "int",
    },
    TipoIncidente: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    Descripcion: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    FechaInforme: {
      type: "date",
      nullable: false,
    },
  },
  relations: {
    encargados: {
      target: "Encargado",
      type: "many-to-one",
      joinColumn: {
        name: "idEncargado",
      },
    },
    registrosAlmacen: {
      target: "RegistroAlmacen",
      type: "many-to-one",
      joinColumn: {
        name: "idRegistroAlmacen",
      },
    },
  },
});
