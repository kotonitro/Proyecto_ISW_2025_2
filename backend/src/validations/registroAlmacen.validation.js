"use strict";
import Joi from "joi";

const rutPattern = /^[0-9]{7,8}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const registroEntradaValidation = Joi.object({
  rutUsuario: Joi.string()
    .trim()
    .pattern(rutPattern)
    .required()
    .messages({
      "string.base": "RUT debe ser una cadena",
      "string.empty": "RUT no puede estar vacío",
      "string.pattern.base": "RUT debe contener 7 u 8 dígitos",
      "any.required": "RUT es obligatorio"
    }),

  nombreUsuario: Joi.string()
    .trim()
    .max(255)
    .required()
    .messages({
      "string.base": "Nombre debe ser una cadena",
      "string.empty": "Nombre no puede estar vacío",
      "string.max": "Nombre puede tener como máximo 255 caracteres",
      "any.required": "Nombre es obligatorio"
    }),

  emailUsuario: Joi.string()
    .trim()
    .lowercase()
    .pattern(emailPattern)
    .required()
    .messages({
      "string.base": "Email debe ser una cadena",
      "string.empty": "Email no puede estar vacío",
      "string.pattern.base": "Email debe ser válido",
      "any.required": "Email es obligatorio"
    }),

  telefonoUsuario: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "Teléfono debe ser un número",
      "number.integer": "Teléfono debe ser un número entero",
      "number.positive": "Teléfono debe ser positivo",
      "any.required": "Teléfono es obligatorio"
    }),

  idBicicleta: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "ID de bicicleta debe ser un número",
      "number.integer": "ID de bicicleta debe ser un número entero",
      "number.positive": "ID de bicicleta debe ser positivo",
      "any.required": "ID de bicicleta es obligatorio"
    }),

  idBicicletero: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "ID de bicicletero debe ser un número",
      "number.integer": "ID de bicicletero debe ser un número entero",
      "number.positive": "ID de bicicletero debe ser positivo",
      "any.required": "ID de bicicletero es obligatorio"
    }),

  fechaEntrada: Joi.date()
    .iso()
    .optional()
    .messages({
      "date.base": "Fecha de entrada debe ser una fecha válida",
      "date.format": "Fecha de entrada debe estar en formato (YYYY-MM-DDTHH:mm:ss.sssZ)"
    }),

  fechaSalida: Joi.date()
    .iso()
    .optional()
    .messages({
      "date.base": "Fecha de salida debe ser una fecha válida",
      "date.format": "Fecha de salida debe estar en formato (YYYY-MM-DDTHH:mm:ss.sssZ)"
    }),
});

export const registroSalidaValidation = Joi.object({
  idRegistroAlmacen: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "ID del registro debe ser un número",
      "number.integer": "ID del registro debe ser un número entero",
      "number.positive": "ID del registro debe ser positivo",
      "any.required": "ID del registro es obligatorio"
    }),

  fechaSalida: Joi.date()
    .iso()
    .optional()
    .messages({
      "date.base": "Fecha de salida debe ser una fecha válida",
      "date.format": "Fecha de salida debe estar en formato ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)"
    }),
});
