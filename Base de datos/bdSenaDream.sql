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
    idAdministrador BIGINT NOT NULL,
    tipoDocumento VARCHAR(255) NOT NULL,
    nombreCompleto VARCHAR(255) NOT NULL,
    telefono BIGINT NOT NULL,
    fechaNacimiento DATE NOT NULL,
    ciudad VARCHAR(255) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    correoElectronico VARCHAR(255),
    contactoEmergencia BIGINT NOT NULL,
    FOREIGN KEY(idAdministrador) REFERENCES administrador(id)
);

CREATE TABLE IF NOT EXISTS habitacion(
    numeroHabitacion SMALLINT NOT NULL PRIMARY KEY,
    nit BIGINT NOT NULL,
    camas SMALLINT NOT NULL,
    sabana SMALLINT NOT NULL,
    sobreSabana SMALLINT NOT NULL,
    almohada SMALLINT NOT NULL,
    cobija SMALLINT NOT NULL,
    cobertor SMALLINT NOT NULL,
    fular SMALLINT NOT NULL,
    cojin SMALLINT NOT NULL,
    toallaCuerpo SMALLINT NOT NULL,
    toallaCara SMALLINT NOT NULL,
    FOREIGN KEY(nit) REFERENCES hotel(nit)
);

CREATE TABLE IF NOT EXISTS reserva(
    codigoReserva BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    idAdministrador BIGINT NOT NULL,
    idAprendiz BIGINT NOT NULL,
    numeroHabitacion SMALLINT NOT NULL,
    idHuesped BIGINT NOT NULL,
    tarifa SMALLINT NOT NULL,
    cantidadDias BIGINT NOT NULL,
    abono SMALLINT,
    FOREIGN KEY(idAdministrador) REFERENCES administrador(id),
    FOREIGN KEY(idAprendiz) REFERENCES aprendiz(id),
    FOREIGN KEY(numeroHabitacion) REFERENCES habitacion(numeroHabitacion),
    FOREIGN KEY(idHuesped) REFERENCES huesped(id)
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
CREATE TABLE IF NOT EXISTS permisos (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL UNIQUE -- Nombre del permiso (ej: 'crear_reserva', 'editar_huesped')
);

CREATE TABLE IF NOT EXISTS rol_permisos (
    idRol VARCHAR(50) NOT NULL, -- Rol (admin o user)
    idPermiso BIGINT NOT NULL,  -- Permiso asignado
    PRIMARY KEY (idRol, idPermiso),
    FOREIGN KEY (idPermiso) REFERENCES permisos(id)
);