"use strict";
import dotenv from "dotenv";

// Exportar datos del .env

dotenv.config();

export const HOST = process.env.HOST || "localhost";
export const PORT = process.env.PORT || 3000;
export const DB_USERNAME = process.env.DB_USERNAME
export const PASSWORD = process.env.PASSWORD;
export const DATABASE = process.env.DATABASE;
export const JWT_SECRET = process.env.JWT_SECRET;
export const cookieKey = process.env.COOKIE_KEY;