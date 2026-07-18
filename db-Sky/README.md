# Servidor de Base de Datos - SkyManager

Este proyecto levanta un contenedor de MySQL 8.0 con la estructura de base de datos preconfigurada para gestionar vuelos, aerolíneas, aeropuertos, pasajeros y reservaciones del sistema SkyManager.

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
   - **Base de datos:** db_skymanager

   También puedes usar el usuario root con contraseña `root`.

## Estructura de la Base de Datos

La base de datos `db_skymanager` contiene las siguientes tablas:

- **airlines**: Almacena información de aerolíneas (id, name, iata_code, country, created_at)
- **airports**: Almacena información de aeropuertos (id, name, iata_code, city, country, created_at)
- **flights**: Almacena información de vuelos (id, flight_number, airline_id, origin_id, destination_id, departure_time, arrival_time, price, capacity, created_at)
- **passengers**: Almacena información de pasajeros (id, first_name, last_name, email, phone, created_at)
- **bookings**: Almacena información de reservaciones (id, flight_id, passenger_id, booking_date, seat_number, status, created_at)

## Detener el Contenedor

Para detener el contenedor, ejecuta:

```bash
docker compose down
```

Esto detendrá y eliminará el contenedor, pero conservará los datos en el volumen persistente.
