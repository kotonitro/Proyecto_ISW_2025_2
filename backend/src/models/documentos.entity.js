import { EntitySchema } from "typeorm";

export const Documento = new EntitySchema({
  name: "Documento",
  tableName: "documentos",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    nombreOriginal: {
      type: "varchar",
    },
    ruta: {
      type: "varchar",
    },
    mimetype: {
      type: "varchar",
    },
  },
  relations: {
    informe: {
      target: "Informe",
      type: "many-to-one",
      joinColumn: { name: "idInforme" },
      onDelete: "CASCADE",
    },
  },
});
