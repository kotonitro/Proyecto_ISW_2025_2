"use strict";
import Joi from "joi";
import { COLOR_PALETA } from "../utils/colorPaleta.js";

//letras, números, espacios y guiones
const nombreMarcaModeloPattern = /^[A-Za-z0-9À-ÖØ-öø-ÿ\s\-]+$/;

export const bicicletaValidation = Joi.object({
	
	marca: Joi.string()
		.trim()
		.max(255)
		.pattern(nombreMarcaModeloPattern)
		.required()
		.messages({
			"string.base": "La marca debe ser una cadena",
			"string.empty": "La marca no puede estar vacía",
			"string.max": "La marca puede tener como máximo 255 caracteres",
			"string.pattern.base": "La marca sólo puede contener letras, números, espacios, guiones y puntos",
			"any.required": "La marca es obligatoria"
		}),

	modelo: Joi.string()
		.trim()
		.max(255)
		.pattern(nombreMarcaModeloPattern)
		.required()
		.messages({
			"string.base": "El modelo debe ser una cadena",
			"string.empty": "El modelo no puede estar vacío",
			"string.max": "El modelo puede tener como máximo 255 caracteres",
			"string.pattern.base": "El modelo sólo puede contener letras, números, espacios, guiones y puntos",
			"any.required": "El modelo es obligatorio"
		}),

	
	color: Joi.string()
		.trim()
		.lowercase()
		.valid(...COLOR_PALETA)
		.required()
		.messages({
			"any.only": `El color debe ser uno de: ${COLOR_PALETA.join(", ")}`,
			"any.required": "El color es obligatorio",
			"string.base": "El color debe ser una cadena"
		}),

	
});