import { EntitySchema } from "typeorm"


export const Usuario = new EntitySchema({
    name: "Usuario",
    tableName: "usuarios",
    columns: {
        id_usuario: {
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
            lenght: 255,
            nullable: false,
        },
    }
})
