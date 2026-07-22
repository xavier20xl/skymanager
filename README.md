# PROYECTO - IS711 II PAC 2026

API REST para la gestión de vuelos de un aeropuerto **(SkyManager)**

## Responsable

Carlos Xavier López Mendoza — 20182030892

## Recursos necesarios

- VS Code
- Git
- Node.js (v24+)
- Docker Desktop

## Para clonar el repositorio

Ejecutar el siguiente comando desde la consola de su computadora (después de haber instalado git):

```bash
git clone https://github.com/xavier20xl/skymanager.git
```

## Para correr el servidor (con Docker)

Paso 1 — Abrir Docker Desktop y esperar a que esté corriendo.

Paso 2 — Levantar el contenedor de MySQL:

```bash
cd db-Sky
docker compose up -d
cd ..
```

Paso 3 — Instalar dependencias:

```bash
cd api-Sky
npm install
```

Paso 4 — Configurar las variables de entorno:

```bash
cp .env.example .env
```

Luego editar el archivo `.env` con los valores necesarios (las credenciales de la BD están en `db-Sky/README.md`):

```env
PORT=3000

DB_HOST=localhost
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_PORT=
```

Paso 5 — Arrancar el servidor en modo desarrollo:

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

**Nota:** Todos los recursos (Flights, Airlines, Airports, Passengers y Bookings) están conectados a MySQL. Las reservas incluyen validaciones de existencia de pasajero/vuelo y disponibilidad de asiento.

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
├── api-Sky/            # API REST (Express + MVC + Zod)
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── middlewares/
│   │   ├── helpers/
│   │   └── mock/
│   └── index.js
├── db-Sky/             # Base de datos MySQL (Docker)
│   ├── init/
│   │   ├── 01-init.sql         # Estructura, semillas y permisos
│   │   └── 02-alter-tables.sql # Migraciones futuras (vacío por ahora)
│   ├── docker-compose.yml
│   └── README.md
├── .gitignore
└── README.md
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
- **MySQL2** — Conexión a base de datos
- **Docker** — Contenedor para MySQL

## Validaciones

Todos los recursos validan sus datos con **Zod** antes de llegar al modelo:

- Los `id` son generados por el servidor con `randomUUID()` y validados como **UUID**.
- Las llaves foráneas (`airline_id`, `passenger_id`, `flight_id`) deben ser **UUID** válidos — un formato incorrecto responde `400 Bad Request` en lugar de generar un error en la base de datos.
- Las fechas (`departure_time`, `arrival_time`, `booking_date`) usan formato ISO 8601 (ej: `2026-08-01T10:00:00Z`).
- Los esquemas son `.strict()`: cualquier campo extra en el body es rechazado.

## Middlewares

### isAuth

Middleware de autenticación que valida la presencia de encabezados de autorización en las peticiones. Requerido para endpoints de escritura (POST, PUT, DELETE).
