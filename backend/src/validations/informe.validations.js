"use strict";
import Joi from "joi";
import { TIPOS_INCIDENTE } from "../utils/tiposIncidete.js";

export const informeValidation = Joi.object({
  TipoIncidente: Joi.string()
    .trim()
    .uppercase()
    .valid(...TIPOS_INCIDENTE)
    .required()
    .messages({
      "any.only": `El tipo de incidente debe ser uno de: ${TIPOS_INCIDENTE.join(", ")}`,
      "any.required": "El tipo de incidente es obligatorio",
    }),

  Descripcion: Joi.string().trim().min(20).max(255).required().messages({
    "string.empty": "La descripción no puede estar vacía",
    "string.min": "La descripción debe tener al menos 20 caracteres",
    "string.max": "La descripción puede tener como máximo 255 caracteres",
    "any.required": "La descripción es obligatoria",
  }),

  FechaInforme: Joi.date().iso().max("now").required().messages({
    "date.base": "La fecha de informe no es válida",
    "date.max": "La fecha de informe no puede ser una fecha futura",
    "any.required": "La fecha de informe es obligatoria",
  }),
});
