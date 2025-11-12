"use strict";
import Joi from "joi";
import { TIPOS_INCIDENTE } from "../utils/tiposIncidente.js";

export const informeValidation = Joi.object({
  idEncargado: Joi.number().integer().required().messages({
    "number.base": "El idEncargado debe ser un número entero",
    "any.required": "El idEncargado es obligatorio",
  }),

  idRegistroAlmacen: Joi.number().integer().allow(null).messages({
    "number.base": "El idRegistroAlmacen debe ser un número entero",
  }),

  tipoIncidente: Joi.string()
    .trim()
    .uppercase()
    .valid(...TIPOS_INCIDENTE)
    .required()
    .messages({
      "any.only": `El tipo de incidente debe ser uno de: ${TIPOS_INCIDENTE.join(", ")}`,
      "any.required": "El tipo de incidente es obligatorio",
    }),

  descripcion: Joi.string().trim().max(255).required().messages({
    "string.empty": "La descripción no puede estar vacía",
    "string.max": "La descripción puede tener como máximo 255 caracteres",
    "any.required": "La descripción es obligatoria",
  }),

  fechaInforme: Joi.date().max("now").required().messages({
    "date.base": "La fecha de informe no es válida",
    "date.max": "La fecha de informe no puede ser una fecha futura",
    "any.required": "La fecha de informe es obligatoria",
  }),
});
