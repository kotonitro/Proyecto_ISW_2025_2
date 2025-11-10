"use strict";
import Joi from "joi";

function validateRut(value, helpers) {    //queremos validar el rut chileno
  if (!value || typeof value !== "string") return helpers.message("RUT inválido");

  const clean = value.replace(/\./g, "").replace(/-/g, "").toUpperCase();

  if (!/^\d+([0-9K])$/.test(clean)) return helpers.message("Formato de RUT inválido");

  const dv = clean.slice(-1);
  const num = clean.slice(0, -1);

  let sum = 0;
  let factor = 2;
  for (let i = num.length - 1; i >= 0; i--) {
    sum += parseInt(num[i], 10) * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }
  const res = 11 - (sum % 11);
  const dvExpected = res === 11 ? "0" : res === 10 ? "K" : String(res);

  if (dv !== dvExpected) return helpers.message("Dígito verificador de RUT inválido");
  return value;
}

export const encargadoValidation = Joi.object({
  
  rut: Joi.string().required().custom(validateRut, "RUT validation").messages({
    "any.required": "El RUT es obligatorio",
    "string.base": "El RUT debe ser una cadena"
  }),

 
  nombre: Joi.string()
    .trim()
    .max(50)
    .pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/)
    .required()
    .messages({
      "string.max": "El nombre debe tener como máximo 50 caracteres",
      "string.pattern.base": "El nombre sólo puede contener letras y espacios",
      "any.required": "El nombre es obligatorio"
    }),

  
  correo: Joi.string()
    .email({ tlds: { allow: false } })
    .pattern(/\.mail$/i)
    .required()
    .messages({
      "string.email": "El correo debe ser un email válido",
      "string.pattern.base": "El correo debe terminar en .mail",
      "any.required": "El correo es obligatorio"
    }),

  
  contrasena: Joi.string()
    .min(6)
    .max(12)
    // exige al menos 3 dígitos en cualquier posición
    .pattern(/(?=(.*\d){3,})/)
    .required()
    .messages({
      "string.min": "La contraseña debe tener al menos 6 caracteres",
      "string.max": "La contraseña debe tener como máximo 12 caracteres",
      "string.pattern.base": "La contraseña debe contener al menos 3 números",
      "any.required": "La contraseña es obligatoria"
    }),

 
  telefono: Joi.string()
    .pattern(/^\d{1,8}$/)
    .required()
    .messages({
      "string.pattern.base": "El teléfono debe contener sólo números y como máximo 8 dígitos",
      "any.required": "El teléfono es obligatorio"
    })
});