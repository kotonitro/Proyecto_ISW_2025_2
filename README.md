# Proyecto ISW 2025-2

Este repositorio contiene el código fuente del proyecto para el ramo de Ingeniería de Software (ISW) 2025-2.

## Descripción del Proyecto

WIP

## Características

* [Característica 1: Ejemplo - Autenticación de usuarios]
* [Característica 2: Ejemplo - Módulo de ventas]
* [Característica 3: ...]

## Stack Tecnológico

Este proyecto está dividido en un `frontend` y un `backend`, utilizando las siguientes tecnologías:

### Frontend

* **Framework/Librería:** React
* **Lenguaje:** JavaScript
* **Gestor de Paquetes:** npm

### Backend

* **Framework:** Node.js, Express.js
* **Lenguaje:** JavaScript
* **Base de Datos:** PostgreSQL, usando ORM
* **Gestor de Paquetes:** npm

## 🏗️ Estructura del Proyecto

Aquí está la estructura basada en tu imagen, pero formateada correctamente como un árbol:

```
Proyecto_ISW_2025_2/
├── .gitignore           # Archivos y carpetas ignorados por Git
├── README.md            # Este archivo
│
├── backend/
│   ├── package.json
│   └── src/             # Archivos fuentes del backend y script inicial
│       ├── config/      # Archivos para configurar la conexion de backend
│       ├── controllers/
│       ├── entities/    # Archivos de los modelos en la base de datos (Entidades y relaciones)
│       ├── handlers/
│       ├── middleware/
│       ├── routes/      # Archivos para la funcionalidad de los endpoints
│       ├── services/
│       ├── utils/
│       ├── validations/
│       └── index.js
│
└── frontend/
    ├── package.json
    └── src/
        └── index.html
```

## Instalación y Ejecución

Sigue estos pasos para levantar el proyecto en un entorno de desarrollo local.

### Prerrequisitos

* [Software Requerido 1 - Ej. Node.js]
* [Software Requerido 2 - Ej. Python]
* [Software Requerido 3 - Ej. Base de Datos]

### 1. Clonar el Repositorio

```bash
git clone [https://github.com/kotonitro/Proyecto_ISW_2025_2.git](https://github.com/kotonitro/Proyecto_ISW_2025_2.git)
cd Proyecto_ISW_2025_2
```
### 2. Configurar el Backend

```bash
# Ingresar al entorno Backend
cd backend
# Instalar dependencia
npm install
# Configurar variables de entorno(IMPORTANTE: solamente para trabajar en localhost)
cp .env.example .env
# Inicializar el servidor Backend
npm run dev
```

### 3. Configurar el Frontend
```bash
#OPCIONAL: si usted estaba en el backend, vuelva a la carpeta principal del proyecto
cd ..
# Ingresar al entorno Frontend 
cd frontend
# Instalar dependencias
npm install
# Configurar variables de entorno(IMPORTANTE: solamente para trabajar en localhost)
cp .env.example .env
# Complicación del frontend
npm run build
# Inicializar el servidor Frontend
```

## Contribuidores

* Juan Arévalo - [@iTzFireFoxX](https://github.com/iTzFireFoxX)
* José Hormazabal - [@Jose-hf](https://github.com/Jose-hf)
* Matias Muñoz - [@kotonitro](https://github.com/kotonitro)
* Christian Retabien - [@kithian](https://github.com/kithian)
* Matias Vilchometro - [@matias-vilchesb](https://github.com/matias-vilchesb)

