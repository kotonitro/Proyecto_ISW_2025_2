# Frontend - Proyecto ISW

Front-end minimal para gestionar la custodia (entradas y salidas de bicicletas).

Qué incluye:
- Página para registrar entrada de bicicleta (formulario).
- Listado de bicicletas almacenadas con botón para registrar salida.
- Cliente API que llama los endpoints del backend en `http://localhost:3000/api` por defecto.

Cómo ejecutar (Windows PowerShell):

1) Ir a la carpeta `frontend`:

```powershell
cd c:\Users\OMEN\Desktop\Proyecto_ISW_2025_2\frontend
```

2) Instalar dependencias:

```powershell
npm install
```

3) Ejecutar en modo desarrollo:

```powershell
npm run dev
```

Notas:
- El frontend espera que el backend esté corriendo en `http://localhost:3000`. Si tu backend usa otro puerto, puedes definir la variable de entorno `VITE_API_URL` antes de arrancar (por ejemplo: `$env:VITE_API_URL = 'http://localhost:4000/api'` en PowerShell).
- Los endpoints del backend requieren autenticación (JWT). Esta implementacion mínima asume que el token está en `localStorage.token`. Ajusta según tu flujo de auth.

Siguientes mejoras:
- Integración con el sistema de login.
- Paginación y filtros en el listado.
- Mejor manejo de errores y diseño.
