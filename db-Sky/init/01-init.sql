-- Asegurar que usamos la base de datos correcta configurada en el Docker Compose
USE `skymanager_db`;

-- =========================================================================
-- 1. TABLAS PRINCIPALES
-- =========================================================================

-- Tabla de Aerolíneas
CREATE TABLE IF NOT EXISTS `airlines` (
    `id` BINARY(16) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `iata_code` VARCHAR(3) NOT NULL,
    `country` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Aeropuertos
CREATE TABLE IF NOT EXISTS `airports` (
    `id` BINARY(16) NOT NULL,
    `iata_code` VARCHAR(3) NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `city` VARCHAR(100) NOT NULL,
    `country` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Vuelos
CREATE TABLE IF NOT EXISTS `flights` (
    `id` BINARY(16) NOT NULL,
    `origin` VARCHAR(3) NOT NULL,
    `destination` VARCHAR(3) NOT NULL,
    `airline_id` BINARY(16) NOT NULL,
    `departure_time` DATETIME NOT NULL,
    `arrival_time` DATETIME NOT NULL,
    `status` ENUM('scheduled', 'boarding', 'departed', 'arrived', 'cancelled') NOT NULL DEFAULT 'scheduled',
    `gate` VARCHAR(10) NOT NULL,
    `capacity` INT NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`airline_id`) REFERENCES `airlines`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Pasajeros
CREATE TABLE IF NOT EXISTS `passengers` (
    `id` BINARY(16) NOT NULL,
    `first_name` VARCHAR(50) NOT NULL,
    `last_name` VARCHAR(50) NOT NULL,
    `passport` VARCHAR(20) NOT NULL,
    `nationality` VARCHAR(50) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Reservas
CREATE TABLE IF NOT EXISTS `bookings` (
    `id` BINARY(16) NOT NULL,
    `passenger_id` BINARY(16) NOT NULL,
    `flight_id` BINARY(16) NOT NULL,
    `seat_number` VARCHAR(5) NOT NULL,
    `booking_date` DATETIME NOT NULL,
    `status` ENUM('confirmed', 'cancelled', 'pending') NOT NULL DEFAULT 'pending',
    PRIMARY KEY (`id`),
    FOREIGN KEY (`passenger_id`) REFERENCES `passengers`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`flight_id`) REFERENCES `flights`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- 2. CONTROL DE ACCESO (Usuarios y Permisos)
-- =========================================================================

-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS `users` (
    `id` BINARY(16) NOT NULL,
    `username` VARCHAR(100) NOT NULL UNIQUE,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Permisos
CREATE TABLE IF NOT EXISTS `permissions` (
    `id` BINARY(16) NOT NULL,
    `name` VARCHAR(100) NOT NULL UNIQUE,
    `description` VARCHAR(255),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla Pivote Usuarios <-> Permisos
CREATE TABLE IF NOT EXISTS `user_permission` (
    `user_id` BINARY(16) NOT NULL,
    `permission_id` BINARY(16) NOT NULL,
    PRIMARY KEY (`user_id`, `permission_id`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- 3. INSERCIÓN DE DATOS INICIALES (Semillas)
-- =========================================================================

-- Variables para almacenar los UUIDs temporales y asegurar las relaciones correctas
SET @airline1_id = UUID_TO_BIN('a1b2c3d4-1234-4abc-9def-0123456789ab');
SET @airline2_id = UUID_TO_BIN('b2c3d4e5-2345-4bcd-abcd-123456789abc');
SET @airline3_id = UUID_TO_BIN('c3d4e5f6-3456-4cde-bcde-23456789abcd');

SET @airport_mex = UUID_TO_BIN('d4e5f6a7-4567-4def-bcde-3456789abcde');
SET @airport_pty = UUID_TO_BIN('e5f6a7b8-5678-4ef0-cdef-4567890abcde');
SET @airport_sap = UUID_TO_BIN('f6a7b8c9-6789-4f01-def0-5678901abcde');
SET @airport_rtb = UUID_TO_BIN('a7b8c9d0-7890-4a12-ef01-6789012abcde');
SET @airport_sal = UUID_TO_BIN('b8c9d0e1-8901-4b23-f012-7890123abcde');

SET @passenger1_id = UUID_TO_BIN('c9d0e1f2-9012-4c34-0123-8901234abcde');
SET @passenger2_id = UUID_TO_BIN('d0e1f2a3-0123-4d45-1234-9012345abcde');

SET @flight1_id = UUID_TO_BIN('e1f2a3b4-1234-4e56-2345-0123456abcde');
SET @flight2_id = UUID_TO_BIN('f2a3b4c5-2345-4f67-3456-123456789abc');

SET @booking1_id = UUID_TO_BIN('a1b2c3d4-e5f6-7890-abcd-ef1234567890');
SET @booking2_id = UUID_TO_BIN('b2c3d4e5-f6a7-8901-bcde-f12345678901');

-- Insertar Aerolíneas
INSERT INTO `airlines` (`id`, `name`, `iata_code`, `country`) VALUES 
(@airline1_id, 'Aeromexico', 'AM', 'Mexico'),
(@airline2_id, 'Copa Airlines', 'CM', 'Panama'),
(@airline3_id, 'American Airlines', 'AA', 'United States');

-- Insertar Aeropuertos
INSERT INTO `airports` (`id`, `iata_code`, `name`, `city`, `country`) VALUES 
(@airport_mex, 'MEX', 'Aeropuerto Internacional de la Ciudad de Mexico', 'Ciudad de Mexico', 'Mexico'),
(@airport_pty, 'PTY', 'Aeropuerto Internacional de Tocumen', 'Ciudad de Panama', 'Panama'),
(@airport_sap, 'SAP', 'Aeropuerto Internacional Ramon Villeda Morales', 'San Pedro Sula', 'Honduras'),
(@airport_rtb, 'RTB', 'Aeropuerto Internacional Juan Manuel Galvez', 'Roatan', 'Honduras'),
(@airport_sal, 'SAL', 'Aeropuerto Internacional de El Salvador', 'San Salvador', 'El Salvador');

-- Insertar Pasajeros
INSERT INTO `passengers` (`id`, `first_name`, `last_name`, `passport`, `nationality`, `email`) VALUES 
(@passenger1_id, 'Carlos', 'Lopez', 'HN123456', 'Honduras', 'carlos@email.com'),
(@passenger2_id, 'Maria', 'Garcia', 'SV789012', 'El Salvador', 'maria@email.com');

-- Insertar Vuelos
INSERT INTO `flights` (`id`, `origin`, `destination`, `airline_id`, `departure_time`, `arrival_time`, `status`, `gate`, `capacity`) VALUES 
(@flight1_id, 'MEX', 'PTY', @airline1_id, '2026-07-20 08:00:00', '2026-07-20 12:30:00', 'scheduled', 'A12', 180),
(@flight2_id, 'PTY', 'SAL', @airline2_id, '2026-07-20 14:00:00', '2026-07-20 15:00:00', 'boarding', 'B5', 120);

-- Insertar Reservas
INSERT INTO `bookings` (`id`, `passenger_id`, `flight_id`, `seat_number`, `booking_date`, `status`) VALUES 
(@booking1_id, @passenger1_id, @flight1_id, '12A', '2026-07-15 10:00:00', 'confirmed'),
(@booking2_id, @passenger2_id, @flight1_id, '12B', '2026-07-15 11:00:00', 'confirmed');

-- Insertar Usuarios
SET @user1_id = UUID_TO_BIN('c9d0e1f2-9012-4c34-0123-8901234abcdf');
INSERT INTO `users` (`id`, `username`, `email`, `password`) VALUES 
(@user1_id, 'admin', 'admin@skymanager.com', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36PQm4sEPhMNPfFhpYN76q');

-- Insertar Permisos
SET @perm_flight_create = UUID_TO_BIN('d0e1f2a3-0123-4d45-1234-9012345abcdf');
SET @perm_flight_delete = UUID_TO_BIN('d0e1f2a3-0123-4d45-1234-9012345abce0');
SET @perm_booking_create = UUID_TO_BIN('d0e1f2a3-0123-4d45-1234-9012345abce1');
INSERT INTO `permissions` (`id`, `name`, `description`) VALUES 
(@perm_flight_create, 'flight:create', 'Crear vuelos'),
(@perm_flight_delete, 'flight:delete', 'Eliminar vuelos'),
(@perm_booking_create, 'booking:create', 'Crear reservas');

-- Asignar permisos al admin
INSERT INTO `user_permission` (`user_id`, `permission_id`) VALUES 
(@user1_id, @perm_flight_create),
(@user1_id, @perm_flight_delete),
(@user1_id, @perm_booking_create);
