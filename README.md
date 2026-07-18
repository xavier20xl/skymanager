# PROYECTO - IS711 II PAC 2026

API REST para la gestión de vuelos de un aeropuerto **(SkyManager)**

## Responsable

Carlos Xavier López Mendoza — 20182030892

## Recursos necesarios

- VS Code
- Git
- Node.js (v18+)
- Docker (para la fase de base de datos)

## Para clonar el repositorio

Ejecutar el siguiente comando desde la consola de su computadora (después de haber instalado git):

```bash
git clone https://github.com/xavier20xl/skymanager.git
```

## Para correr el servidor

Paso 1 — Instalar dependencias:

```bash
npm install
```

Paso 2 — Configurar las variables de entorno:

```bash
cp .env.example .env
```

Luego editar el archivo `.env` con los valores necesarios:

```env
PORT=3000

# Base de datos MySQL
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_PORT=
```

Paso 3 — Arrancar el servidor en modo desarrollo:

```bash
npm run dev
```

## Endpoints disponibles

### Health Check

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Health check |

### Flights

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/flights` | Listar todos los vuelos |
| GET | `/flights/:id` | Obtener un vuelo por ID |
| POST | `/flights` | Crear un vuelo |
| PUT | `/flights/:id` | Actualizar un vuelo |
| DELETE | `/flights/:id` | Eliminar un vuelo |

### Airlines

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/airlines` | Listar todas las aerolíneas |
| GET | `/airlines/:id` | Obtener una aerolínea por ID |
| POST | `/airlines` | Crear una aerolínea |
| PUT | `/airlines/:id` | Actualizar una aerolínea |
| DELETE | `/airlines/:id` | Eliminar una aerolínea |

### Airports

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/airports` | Listar todos los aeropuertos |
| GET | `/airports/:id` | Obtener un aeropuerto por ID |
| POST | `/airports` | Crear un aeropuerto |
| PUT | `/airports/:id` | Actualizar un aeropuerto |
| DELETE | `/airports/:id` | Eliminar un aeropuerto |

### Passengers

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/passengers` | Listar todos los pasajeros |
| GET | `/passengers/:id` | Obtener un pasajero por ID |
| POST | `/passengers` | Crear un pasajero |
| PUT | `/passengers/:id` | Actualizar un pasajero |
| DELETE | `/passengers/:id` | Eliminar un pasajero |

### Bookings

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/bookings` | Listar todas las reservas |
| GET | `/bookings/:id` | Obtener una reserva por ID |
| POST | `/bookings` | Crear una reserva (verifica pasajero, vuelo y asiento) |
| PUT | `/bookings/:id` | Actualizar una reserva |
| DELETE | `/bookings/:id` | Eliminar una reserva |

## Arquitectura del proyecto

El proyecto sigue el patrón **MVC** (Model-View-Controller):

```
skymanager-api/
├── src/
│   ├── controllers/    # Lógica de cada endpoint
│   ├── models/         # Acceso a datos (mock/SQL)
│   ├── routes/         # Definición de rutas Express
│   ├── schemas/        # Validación de esquemas con Zod
│   ├── middlewares/    # Middlewares (isAuth)
│   ├── helpers/        # Utilidades (jsonResponse)
│   └── mock/           # Datos de prueba en JSON
├── index.js            # Punto de entrada del servidor
└── package.json
```

## Códigos de Estado HTTP

### Códigos de Éxito (2xx)

- **200 OK** — Solicitud exitosa, datos devueltos
- **201 Created** — Recurso creado exitosamente

### Códigos de Error del Cliente (4xx)

- **400 Bad Request** — Datos de entrada inválidos o faltantes
- **401 Unauthorized** — Token de autenticación faltante o inválido
- **404 Not Found** — Recurso no encontrado

### Códigos de Error del Servidor (5xx)

- **500 Internal Server Error** — Error interno del servidor

## Tecnologías utilizadas

- **Express** — Framework web para Node.js
- **dotenv** — Manejo de variables de entorno
- **Zod** — Validación de esquemas
- **MySQL2** — Conexión a base de datos (fase pendiente)
- **Docker** — Contenedor para MySQL (fase pendiente)

## Middlewares

### isAuth

Middleware de autenticación que valida la presencia de encabezados de autorización en las peticiones. Requerido para endpoints de escritura (POST, PUT, DELETE).
