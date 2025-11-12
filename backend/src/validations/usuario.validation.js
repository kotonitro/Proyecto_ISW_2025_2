import Joi from "joi";
function validateRut(value, helpers) {
  if (!value || typeof value !== "string")
    return helpers.message("RUT inválido");

  const clean = value.replace(/\./g, "").replace(/-/g, "").toUpperCase();

  if (!/^\d+([0-9K])$/.test(clean))
    return helpers.message("Formato de RUT inválido");

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

  if (dv !== dvExpected)
    return helpers.message("Dígito verificador de RUT inválido");
  return value;
}

export const createUsuario = Joi.object({
  rut: Joi.string().required().custom(validateRut, "RUT validation").messages({
    "any.required": "El RUT es obligatorio",
    "string.base": "El RUT debe ser una cadena",
  }),

  nombre: Joi.string()
    .trim()
    .max(50)
    .pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/)
    .required()
    .messages({
      "string.max": "El nombre debe tener como máximo 50 caracteres",
      "string.pattern.base": "El nombre sólo puede contener letras y espacios",
      "any.required": "El nombre es obligatorio",
    }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "El correo debe ser un email válido",
      "any.required": "El correo es obligatorio",
    }),

  telefono: Joi.string()
    .pattern(/^\d{8}$/)
    .required()
    .messages({
      "string.pattern.base":
        "El teléfono debe contener sólo números y obligatoriamente 8 dígitos",
      "any.required": "El teléfono es obligatorio",
    }),
});
