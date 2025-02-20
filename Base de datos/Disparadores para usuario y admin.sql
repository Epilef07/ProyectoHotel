DELIMITER $$

CREATE TRIGGER after_insert_aprendiz
AFTER INSERT ON aprendiz
FOR EACH ROW
BEGIN
    -- Insertar un nuevo usuario en la tabla `usuarios`
    INSERT INTO usuarios (
        nombreAprendiz, 
        idAprendiz, 
        rol
    ) VALUES (
        NEW.nombreCompleto, -- Usar el nombre del aprendiz recién insertado
        NEW.id,             -- Usar el ID del aprendiz recién insertado
        'user'              -- Asignar el rol 'user' por defecto
    );
END$$
DELIMITER ;
DELIMITER $$

CREATE TRIGGER after_insert_administrador
AFTER INSERT ON administrador
FOR EACH ROW
BEGIN
    -- Insertar un nuevo usuario en la tabla `usuarios`
    INSERT INTO usuarios (
        nombreAdministrador, 
        idAdministrador, 
        rol
    ) VALUES (
        CONCAT(NEW.nombre, ' ', NEW.apellido), -- Usar el nombre completo del administrador
        NEW.id,                               -- Usar el ID del administrador recién insertado
        'admin'                                -- Asignar el rol 'admin' por defecto
    );
END$$

DELIMITER ;

INSERT INTO hotel (nit,nombre,telefono,direccion) VALUES (11,"Hotel Sena",3105554320,"Carrera 27");
INSERT INTO administrador(
    id, 
    nit, 
    nombre, 
    apellido, 
    fechaNacimiento, 
    telefono, 
    correoElectronico
) VALUES (
    1, 
    11, 
    'Juan', 
    'Pérez', 
    '1990-01-01', 
    987654321, 
    'juan@example.com'
);
INSERT INTO aprendiz (
    id, 
    idAdministrador, 
    tipoDocumento, 
    numeroFicha, 
    nombreCompleto, 
    telefono, 
    correoElectronico, 
    fechaHoraIngreso
) VALUES (
    1, 
    1, 
    'CC', 
    123456, 
    'Carlos Gómez', 
    555555555, 
    'carlos@example.com', 
    NOW()
);
SELECT * FROM usuarios;
