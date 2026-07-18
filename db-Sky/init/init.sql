CREATE DATABASE IF NOT EXISTS skymanager_db;
USE skymanager_db;

-- Tabla de aerolíneas
CREATE TABLE IF NOT EXISTS airlines (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    iata_code VARCHAR(3) NOT NULL,
    country VARCHAR(50) NOT NULL
);

-- Tabla de aeropuertos
CREATE TABLE IF NOT EXISTS airports (
    id VARCHAR(36) PRIMARY KEY,
    iata_code VARCHAR(3) NOT NULL,
    name VARCHAR(150) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(50) NOT NULL
);

-- Tabla de vuelos
CREATE TABLE IF NOT EXISTS flights (
    id VARCHAR(36) PRIMARY KEY,
    origin VARCHAR(3) NOT NULL,
    destination VARCHAR(3) NOT NULL,
    airline_id VARCHAR(36) NOT NULL,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    status ENUM('scheduled', 'boarding', 'departed', 'arrived', 'cancelled') NOT NULL DEFAULT 'scheduled',
    gate VARCHAR(10) NOT NULL,
    capacity INT NOT NULL,
    FOREIGN KEY (airline_id) REFERENCES airlines(id)
);

-- Tabla de pasajeros
CREATE TABLE IF NOT EXISTS passengers (
    id VARCHAR(36) PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    passport VARCHAR(20) NOT NULL,
    nationality VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL
);

-- Tabla de reservas
CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(36) PRIMARY KEY,
    passenger_id VARCHAR(36) NOT NULL,
    flight_id VARCHAR(36) NOT NULL,
    seat_number VARCHAR(5) NOT NULL,
    booking_date DATETIME NOT NULL,
    status ENUM('confirmed', 'cancelled', 'pending') NOT NULL DEFAULT 'pending',
    FOREIGN KEY (passenger_id) REFERENCES passengers(id),
    FOREIGN KEY (flight_id) REFERENCES flights(id)
);
