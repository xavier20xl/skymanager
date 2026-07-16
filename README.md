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

Paso 2 — Arrancar el servidor en modo desarrollo:

```bash
npm run dev
```

## Endpoints disponibles

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Health check |
| GET | `/flights` | Listar todos los vuelos |
| GET | `/flights/:id` | Obtener un vuelo por ID |

## Probando los endpoints

Se probaron los endpoints utilizando el archivo `api.http` con la extensión **REST Client** de VS Code.

## Arquitectura del proyecto

El proyecto sigue el patrón **MVC** (Model-View-Controller):

```
skymanager-api/
├── src/
│   ├── controllers/    # Lógica de cada endpoint
│   ├── models/         # Acceso a datos (mock/SQL)
│   ├── routes/         # Definición de rutas Express
│   ├── helpers/        # Utilidades (jsonResponse)
│   └── mock/           # Datos de prueba en JSON
├── api.http            # Pruebas de endpoints
├── index.js            # Punto de entrada del servidor
└── package.json
```

## Códigos de Estado HTTP

### Códigos de Éxito (2xx)

- **200 OK** — Solicitud exitosa, datos devueltos
- **201 Created** — Recurso creado exitosamente

### Códigos de Error del Cliente (4xx)

- **400 Bad Request** — Datos de entrada inválidos o faltantes
- **404 Not Found** — Recurso no encontrado

### Códigos de Error del Servidor (5xx)

- **500 Internal Server Error** — Error interno del servidor

## Tecnologías utilizadas

- **Express** — Framework web para Node.js
- **dotenv** — Manejo de variables de entorno
- **Zod** — Validación de esquemas
- **MySQL2** — Conexión a base de datos (fase pendiente)
- **Docker** — Contenedor para MySQL (fase pendiente)
