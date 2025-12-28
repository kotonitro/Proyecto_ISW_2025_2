"use strict";
import Joi from "joi";

export const bicicleteroValidation = Joi.object({

  nombre: Joi.string()
    .trim()
    .max(100)
    .required()
    .messages({
      "string.empty": "El nombre es obligatorio.",
      "string.max": "El nombre debe tener como máximo 100 caracteres",
      "string.base": "EL nombre debe ser una cadena de texto.",
      "any.required": "El nombre es obligatorio."
    }),
  
  ubicacion: Joi.string()
    .trim()
    .max(255)
    .required()
    .messages({
      "string.empty": "La ubicación es obligatoria.",
      "string.max": "La ubicación debe tener como máximo 255 caracteres",
      "string.base": "La ubicación debe ser una cadena de texto.",
      "any.required": "La ubicación es obligatoria."
    }),

  capacidad: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "La capacidad debe ser un número.",
      "number.integer": "La capacidad debe ser un número entero.",
      "number.positive": "La capacidad debe ser un número positivo.",
      "any.required": "La capacidad es obligatoria."
    }),
}).required().messages({"any.required": "La petición no puede estar vacia."});

export const bicicleteroUpdateValidation = bicicleteroValidation.fork(
  ["nombre", "ubicacion", "capacidad"],
  (schema) => schema.optional()).append({
    activo: Joi.boolean().optional()
  }).min(1).required().messages({
  "object.min": "Debe haber al menos un campo para actualizar.",
  "any.required": "La petición no puede estar vacia."});