import { EntitySchema } from "typeorm";

export const Notificacion = new EntitySchema({
  name: "Notificacion",
  tableName: "notificaciones",
  columns: {
    notificacionId: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    mensaje: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    leida: {
      type: "boolean",
      default: false,
      nullable: false,
    },
    fechaCreacion: {
      type: "timestamp",
      createDate: true,
      name: "fecha_creacion",
    },
    fechaActualizacion: {
      type: "timestamp",
      updateDate: true,
      name: "fecha_actualizacion",
    },
  },
  relations: {
    bicicletero: {
      type: "many-to-one",
      target: "Bicicletero",
      joinColumn: {
        name: "bicicletero_id",
      },
      nullable: false,
    },
  },
});
