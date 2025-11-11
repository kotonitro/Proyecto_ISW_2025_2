# Frontend - Proyecto ISW - Gestión de Custodia

Frontend profesional para que los encargados de bicicleteros gestionen la custodia de bicicletas en la Universidad del Bío-Bío.

## Características

### Login de Encargado
- Interfaz limpia y profesional con logo UBB
- Autenticación RUT + Clave
- Guarda sesión con JWT en localStorage
- Muestra nombre del encargado en el header

### Panel de Custodia
- **Registrar Entrada**: Formulario para registrar entrada de bicicleta (usuario, bicicleta, bicicletero)
- **Bicicletas Almacenadas**: Listado en tiempo real de bicicletas en custodia con botón para registrar salida
- **Historial de Registros**: Tabla completa con todas las entradas/salidas
- **Filtros**: Por estado (entrada/salida)
- **Cerrar Sesión**: Botón para terminar la sesión

## Cómo ejecutar (Windows PowerShell)

1. Ir a la carpeta `frontend`:

```powershell
cd c:\Users\OMEN\Desktop\Proyecto_ISW_2025_2\frontend
```

2. Instalar dependencias:

```powershell
npm install
```

3. Arrancar en modo desarrollo:

```powershell
npm run dev
```

4. Abrir en navegador: `http://localhost:5173`

## Configuración

### URL del Backend
Por defecto apunta a `http://localhost:3000/api`. Para cambiar:

```powershell
$env:VITE_API_URL = 'http://localhost:4000/api'
npm run dev
```

## Estructura de Archivos

```
frontend/
├── src/
│   ├── components/
│   │   ├── CustodiaForm.jsx      # Formulario de entrada
│   │   ├── CustodiaList.jsx      # Listado de bicicletas almacenadas
│   │   └── HistorialRegistros.jsx # Tabla con historial
│   ├── pages/
│   │   ├── Login.jsx             # Página de login
│   │   └── CustodiaPage.jsx      # Página principal
│   ├── api/
│   │   └── custodiaApi.js        # Cliente fetch para endpoints
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── index.html
└── package.json
```

## Requisitos Funcionales

- ✅ Login con RUT y Clave
- ✅ Registrar entrada de bicicleta
- ✅ Registrar salida de bicicleta
- ✅ Listar bicicletas almacenadas
- ✅ Ver historial de entradas/salidas
- ✅ Filtrar registros por estado
- ✅ Cerrar sesión
- ✅ Diseño responsivo

## Notas

- El horario de custodia es **7:30 AM - 2:00 PM** (validado en backend)
- El backend rechazará operaciones fuera del horario permitido
- Los datos de bicicleteros, bicicletas y usuarios deben existir en la BD
- El token JWT se guarda en localStorage y se envía en todas las peticiones

## Mejoras Futuras

- Exportar historial a PDF/Excel
- Notificaciones en tiempo real
- Gráficas de estadísticas
- Búsqueda avanzada en historial
- Integración con QR para bicicletas

