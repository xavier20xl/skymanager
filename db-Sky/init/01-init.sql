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
SET @airline1_id = UUID_TO_BIN('81eadc87-af17-45fd-9242-69a13120a815');
SET @airline2_id = UUID_TO_BIN('14c69c95-3928-4147-8f6b-a868205aafd7');
SET @airline3_id = UUID_TO_BIN('b44e1699-499e-44c6-bb44-0b0d79a1058f');

SET @airport_mex = UUID_TO_BIN('30331a16-2f2b-43e4-bba2-9f1182ee848c');
SET @airport_pty = UUID_TO_BIN('9328b220-c0ac-415d-a7b5-44b7e7ffe564');
SET @airport_sap = UUID_TO_BIN('1c7deec9-388e-46d8-936d-885dc26a6667');
SET @airport_rtb = UUID_TO_BIN('15101a50-3d46-47b1-9458-9e8683cc6d43');
SET @airport_sal = UUID_TO_BIN('fbfe3b69-f2bb-4087-8269-1a8fe83bfc05');

SET @passenger1_id = UUID_TO_BIN('00932999-7993-44d4-a146-92ee994ed5a1');
SET @passenger2_id = UUID_TO_BIN('8db424d4-c97c-4ec4-8b27-6eb7a87a2002');

SET @flight1_id = UUID_TO_BIN('00de318f-262b-4958-bd59-50cfc2db432c');
SET @flight2_id = UUID_TO_BIN('d5bcb0ad-3197-4649-885f-e9066cbefa21');

SET @booking1_id = UUID_TO_BIN('7e4da702-5389-4812-ba27-ca7de40d4006');
SET @booking2_id = UUID_TO_BIN('abbe24fd-8e0e-45df-89bc-da46191879ee');

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
SET @user1_id = UUID_TO_BIN('bc1ebff1-d078-4d78-8854-120af22ea1be');
INSERT INTO `users` (`id`, `username`, `email`, `password`) VALUES 
(@user1_id, 'admin', 'admin@skymanager.com', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36PQm4sEPhMNPfFhpYN76q');

-- Insertar Permisos
SET @perm_flight_create = UUID_TO_BIN('ff5a5c25-7fc9-48ab-94a3-40d2a6b7eba4');
SET @perm_flight_delete = UUID_TO_BIN('3a5c9795-1ebd-494a-afb6-285b42eaaa87');
SET @perm_booking_create = UUID_TO_BIN('26762c6d-e891-4933-91a7-ab7ad8c87fb5');
INSERT INTO `permissions` (`id`, `name`, `description`) VALUES 
(@perm_flight_create, 'flight:create', 'Crear vuelos'),
(@perm_flight_delete, 'flight:delete', 'Eliminar vuelos'),
(@perm_booking_create, 'booking:create', 'Crear reservas');

-- Asignar permisos al admin
INSERT INTO `user_permission` (`user_id`, `permission_id`) VALUES 
(@user1_id, @perm_flight_create),
(@user1_id, @perm_flight_delete),
(@user1_id, @perm_booking_create);
