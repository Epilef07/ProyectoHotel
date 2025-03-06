CREATE DATABASE IF NOT EXISTS hoteleria;
USE hoteleria;	

CREATE TABLE IF NOT EXISTS hotel(
    nit BIGINT NOT NULL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    telefono BIGINT NOT NULL,
    direccion VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS administrador(
    id BIGINT NOT NULL PRIMARY KEY,
    nit BIGINT NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    fechaNacimiento DATE NOT NULL,
    telefono BIGINT NOT NULL,
    correoElectronico VARCHAR(255),
    FOREIGN KEY (nit) REFERENCES hotel(nit)
);

CREATE TABLE IF NOT EXISTS aprendiz(
    id BIGINT NOT NULL PRIMARY KEY,
    idAdministrador BIGINT NOT NULL,
    tipoDocumento VARCHAR(255) NOT NULL,
    numeroFicha BIGINT NOT NULL,
    nombreCompleto VARCHAR(255) NOT NULL,
    telefono BIGINT NOT NULL,
    correoElectronico VARCHAR(255) NOT NULL,
    fechaHoraIngreso TIMESTAMP,
    FOREIGN KEY (idAdministrador) REFERENCES administrador(id)
);

CREATE TABLE IF NOT EXISTS huesped(
    id BIGINT NOT NULL PRIMARY KEY,
    idAdministrador BIGINT,
    tipoDocumento VARCHAR(255) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    telefono BIGINT NOT NULL,
    fechaNacimiento DATE NOT NULL,
    contactoEmergencia VARCHAR(255) NOT NULL,
    telefonoEmergencia BIGINT NOT NULL,
    FOREIGN KEY(idAdministrador) REFERENCES administrador(id)
);

CREATE TABLE IF NOT EXISTS habitacion(
    numeroHabitacion SMALLINT NOT NULL PRIMARY KEY,
    nit BIGINT NOT NULL,
    ocupada BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY(nit) REFERENCES hotel(nit)
);

CREATE TABLE IF NOT EXISTS reserva(
    codigoReserva BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    idAdministrador BIGINT ,
    idAprendiz BIGINT ,
    numeroHabitacion SMALLINT NOT NULL,
    idHuesped BIGINT NOT NULL,
    fechaIngreso DATE NOT NULL,
    fechaSalida DATE NOT NULL,
    abono DECIMAL(10,2),
    FOREIGN KEY(idAdministrador) REFERENCES administrador(id),
    FOREIGN KEY(idAprendiz) REFERENCES aprendiz(id),
    FOREIGN KEY(numeroHabitacion) REFERENCES habitacion(numeroHabitacion),
    FOREIGN KEY(idHuesped) REFERENCES huesped(id)
);

CREATE TABLE IF NOT EXISTS tareas(
id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
idAdministrador BIGINT NOT NULL ,
idAprendiz BIGINT NOT NULL ,
descripcion VARCHAR(255),
FOREIGN KEY (idAdministrador) REFERENCES administrador(id),
FOREIGN KEY (idAprendiz) REFERENCES aprendiz(id)
);

CREATE TABLE IF NOT EXISTS usuarios (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombreUsuario VARCHAR(255) NOT NULL UNIQUE, -- Nombre de usuario (nombre del aprendiz o administrador)
    password VARCHAR(255) NOT NULL, -- Contraseña (número de identificación)
    rol ENUM('admin', 'user') NOT NULL, -- Rol del usuario
    idAdministrador BIGINT, -- ID del administrador
    idAprendiz BIGINT, -- ID del aprendiz
    FOREIGN KEY (idAdministrador) REFERENCES administrador(id),
    FOREIGN KEY (idAprendiz) REFERENCES aprendiz(id)
);
