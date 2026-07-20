# Servidor de Base de Datos - SkyManager

Este proyecto levanta un contenedor de MySQL 8.0 con una estructura de base de datos preconfigurada para gestionar vuelos, aerolíneas, aeropuertos, pasajeros y reservaciones del sistema SkyManager, incluyendo datos de prueba.

## Prerrequisitos

- Tener instalado [Docker](https://www.docker.com/get-started) y Docker Compose en tu máquina.

## Instrucciones para ponerlo en marcha

1. Abre tu terminal y navega hasta la carpeta raíz de este proyecto (donde se encuentra el archivo `docker-compose.yml`).

2. Ejecuta el siguiente comando para construir y levantar el contenedor en segundo plano:

   ```bash
   docker compose up -d
   ```

3. Una vez que el contenedor esté corriendo, puedes conectarte a la base de datos usando las siguientes credenciales:

   - **Host:** localhost
   - **Puerto:** 3307
   - **Usuario:** skymanager
   - **Contraseña:** skymanager2026
   - **Base de datos:** skymanager_db

   También puedes usar el usuario root con contraseña `root2026`.

## Estructura de la Base de Datos

La base de datos `skymanager_db` contiene las siguientes tablas:

- **airlines**: Almacena información de aerolíneas (id, name, iata_code, country)
- **airports**: Almacena información de aeropuertos (id, iata_code, name, city, country)
- **flights**: Almacena información de vuelos (id, origin, destination, airline_id, departure_time, arrival_time, status, gate, capacity)
- **passengers**: Almacena información de pasajeros (id, first_name, last_name, passport, nationality, email)
- **bookings**: Almacena información de reservaciones (id, passenger_id, flight_id, seat_number, booking_date, status)

## Datos de Prueba

Se incluyen datos de prueba con:

- 3 aerolíneas (Aeromexico, Copa Airlines, American Airlines)
- 5 aeropuertos (MEX, PTY, SAP, RTB, SAL)
- 2 pasajeros de ejemplo
- 2 vuelos programados
- 2 reservas confirmadas

## Consultas Útiles

### Obtener todos los vuelos con aerolínea y rutas

```sql
SELECT
    BIN_TO_UUID(f.id) AS id,
    f.origin,
    f.destination,
    a.name AS airline,
    f.departure_time,
    f.arrival_time,
    f.status,
    f.gate,
    f.capacity
FROM flights f
JOIN airlines a ON f.airline_id = a.id;
```

### Obtener reservas con datos del pasajero y vuelo

```sql
SELECT
    BIN_TO_UUID(b.id) AS booking_id,
    b.seat_number,
    b.booking_date,
    b.status,
    p.first_name,
    p.last_name,
    p.passport,
    f.origin,
    f.destination,
    f.departure_time
FROM bookings b
JOIN passengers p ON b.passenger_id = p.id
JOIN flights f ON b.flight_id = f.id;
```

### Buscar vuelos por origen y destino

```sql
SELECT
    BIN_TO_UUID(f.id) AS id,
    f.origin,
    f.destination,
    a.name AS airline,
    f.departure_time,
    f.status,
    f.capacity
FROM flights f
JOIN airlines a ON f.airline_id = a.id
WHERE f.origin = 'MEX' AND f.destination = 'PTY';
```

## Detener el Contenedor

Para detener el contenedor, ejecuta:

```bash
docker compose down
```

Esto detendrá y eliminará el contenedor, pero conservará los datos en el volumen persistente.
