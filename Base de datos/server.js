const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const connection = require('./dbConnection');
const { agregarHuesped, buscarHuesped, actualizarHuesped } = require('./crudHuespedes');
const { agregarTarea, obtenerTareas, actualizarTarea, eliminarTarea } = require('./crudTareas');
const { agregarReserva, obtenerReservas } = require('./reservaciones'); // Ruta corregida

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Asegúrate de que esto esté presente

// Rutas estáticas
app.use(express.static(path.join(__dirname, '../my-app/HTML')));
app.use('/CSS', express.static(path.join(__dirname, '../my-app/CSS')));
app.use('/JS', express.static(path.join(__dirname, '../my-app/JS')));
app.use('/IMAGENES', express.static(path.join(__dirname, '../my-app/IMAGENES')));

// Ruta para servir el archivo index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../my-app/HTML/index.html'));
});

// Ruta para servir otros archivos HTML
app.get('/HTML/:file', (req, res) => {
    const file = req.params.file;
    res.sendFile(path.join(__dirname, `../my-app/HTML/${file}`));
});

// Ejemplo de otras rutas: Registro de aprendices, login, etc…
app.post('/api/register', (req, res) => {
    const { tipoDocumento, id, nombreCompleto, telefono, numeroFicha, correoElectronico } = req.body;

    const query = `
        INSERT INTO aprendiz 
        (id, idAdministrador, tipoDocumento, numeroFicha, nombreCompleto, telefono, correoElectronico, fechaHoraIngreso) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        id, // Usar el id proporcionado
        1, // ID del administrador por defecto
        tipoDocumento,
        numeroFicha,
        nombreCompleto,
        telefono,
        correoElectronico,
        new Date()
    ];

    connection.query(query, values, (err, results) => {
        if (err) {
            console.error('Error al registrar aprendiz:', err);
            return res.status(500).json({ 
                success: false, 
                message: 'Error al registrar aprendiz',
                error: err.message 
            });
        }
        
        console.log('Aprendiz registrado exitosamente:', results);
        res.json({ 
            success: true, 
            message: 'Aprendiz registrado exitosamente',
            data: results 
        });
    });
});

// Ruta para manejar el inicio de sesión
app.post('/api/login', (req, res) => {
    const { nombreUsuario, password } = req.body;

    const query = 'SELECT * FROM usuarios WHERE nombreUsuario = ? AND password = ?';
    connection.query(query, [nombreUsuario, password], (err, results) => {
        if (err) {
            console.error('Error al iniciar sesión:', err);
            return res.status(500).json({ success: false, message: 'Error al iniciar sesión' });
        }

        if (results.length > 0) {
            const user = results[0];
            if (user.rol === 'admin') {
                // Usuario admin encontrado, redirigir al menú de admin
                res.redirect('/HTML/menu.html');
            } else {
                // Usuario normal encontrado, redirigir al menú de usuario
                res.redirect('/HTML/menuUser.html');
            }
        } else {
            // Usuario no encontrado, redirigir a la página de inicio de sesión con un mensaje de error
            res.redirect('/?error=Nombre de usuario o contraseña incorrectos');
        }
    });
});

// Ruta para manejar el registro de huéspedes
app.post('/api/huespedes', (req, res) => {
    const nuevoHuesped = req.body;
    agregarHuesped(nuevoHuesped, (err, results) => {
        if (err) {
            return res.status(500).send('Error al agregar huésped');
        }
        res.status(200).json(results);
    });
});

// Ruta para buscar huéspedes por documento
app.get('/api/huespedes/:documento', (req, res) => {
    const documento = req.params.documento;
    buscarHuesped(documento, (err, results) => {
        if (err) {
            return res.status(500).send('Error al buscar huésped');
        }
        res.status(200).json(results);
    });
});

// Ruta para obtener un huésped por ID
app.get('/api/huespedes/:id', (req, res) => {
    const id = req.params.id;
    buscarHuesped(id, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error al buscar el huésped' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Huésped no encontrado' });
        }
        res.json(results);
    });
});

// Ruta para actualizar un huésped por ID
app.put('/api/huespedes/:id', (req, res) => {
    const id = req.params.id;
    const updatedHuesped = req.body;
    console.log('Solicitud de actualización recibida para ID:', id);
    console.log('Datos actualizados del huésped:', updatedHuesped);
    actualizarHuesped(id, updatedHuesped, (err, results) => {
        if (err) {
            console.error('Error al actualizar el huésped:', err);
            return res.status(500).json({ message: 'Error al actualizar el huésped', error: err });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Huésped no encontrado' });
        }
        res.json({ message: 'Huésped actualizado exitosamente', results });
    });
});

// Ruta para agregar una tarea
app.post('/api/tareas', (req, res) => {
    const nuevaTarea = { descripcion: req.body.descripcion };
    agregarTarea(nuevaTarea, (err, results) => {
        if (err) {
            console.error('Error al agregar la tarea:', err);
            return res.status(500).json({ success: false, message: 'Error al agregar la tarea' });
        }
        res.json({ success: true, message: 'Tarea agregada exitosamente', results });
    });
});

// Ruta para obtener todas las tareas
app.get('/api/tareas', (req, res) => {
    obtenerTareas((err, results) => {
        if (err) {
            console.error('Error al obtener las tareas:', err);
            return res.status(500).json({ success: false, message: 'Error al obtener las tareas' });
        }
        res.json(results);
    });
});

// Ruta para actualizar una tarea
app.put('/api/tareas/:id', (req, res) => {
    const id = req.params.id;
    const tareaActualizada = { descripcion: req.body.descripcion };
    actualizarTarea(id, tareaActualizada, (err, results) => {
        if (err) {
            console.error('Error al actualizar la tarea:', err);
            return res.status(500).json({ success: false, message: 'Error al actualizar la tarea' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Tarea no encontrada' });
        }
        res.json({ success: true, message: 'Tarea actualizada exitosamente', results });
    });
});

// Ruta para eliminar una tarea
app.delete('/api/tareas/:id', (req, res) => {
    const id = req.params.id;
    eliminarTarea(id, (err, results) => {
        if (err) {
            console.error('Error al eliminar la tarea:', err);
            return res.status(500).json({ success: false, message: 'Error al eliminar la tarea' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Tarea no encontrada' });
        }
        res.json({ success: true, message: 'Tarea eliminada exitosamente', results });
    });
});

// Ruta para agregar una reserva
app.post('/api/reservas', (req, res) => {
    const reserva = req.body;
    console.log('Datos de la reserva recibidos:', reserva); // Verificar los datos recibidos

    agregarReserva(reserva, (err, results) => {
        if (err) {
            console.error('Error al agregar la reserva:', err.message);
            return res.status(500).json({ success: false, message: 'Error al agregar la reserva', error: err });
        }
        console.log('Reserva agregada correctamente');
        res.json({ success: true, message: 'Reserva agregada correctamente', results });
    });
});

// Ruta para obtener las reservas actuales
app.get('/api/reservas', (req, res) => {
    obtenerReservas((err, results) => {
        if (err) {
            console.error('Error al obtener las reservas:', err.message);
            return res.status(500).json({ success: false, message: 'Error al obtener las reservas', error: err });
        }
        res.json(results);
    });
});

// Ruta para resetear contraseña de administrador o aprendiz
app.post('/api/reset-password', (req, res) => {
    const { token } = req.body; // Solo necesitamos el token
    
    console.log('Intento de reseteo de contraseña para token:', token);

    if (!token) {
        console.log('Token no proporcionado');
        return res.status(400).json({ 
            success: false, 
            message: 'Token es requerido' 
        });
    }

    // Primero buscar en administrador
    const queryAdmin = 'SELECT id FROM administrador WHERE resetToken = ?';
    
    try {
        connection.query(queryAdmin, [token], (err, results) => {
            if (err) {
                console.error('Error en la consulta SQL (admin):', err);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Error interno del servidor',
                    error: err.message
                });
            }
            
            if (results.length > 0) {
                const adminId = results[0].id;
                connection.query('UPDATE administrador SET resetToken = NULL WHERE resetToken = ?', [token], (err, results) => {
                    if (err) {
                        console.error('Error al limpiar token:', err);
                        return res.status(500).json({ 
                            success: false, 
                            message: 'Error interno del servidor',
                            error: err.message
                        });
                    }
                    
                    console.log('Token limpiado correctamente para administrador');
                    return res.status(200).json({ 
                        success: true, 
                        message: 'Contraseña restablecida correctamente',
                        id: adminId // Devolver el ID como contraseña
                    });
                });
            } else {
                // Si no está en administrador, buscar en aprendiz
                const queryAprendiz = 'SELECT id FROM aprendiz WHERE resetToken = ?';
                connection.query(queryAprendiz, [token], (err, results) => {
                    if (err) {
                        console.error('Error en la consulta SQL (aprendiz):', err);
                        return res.status(500).json({ 
                            success: false, 
                            message: 'Error interno del servidor',
                            error: err.message
                        });
                    }
                    
                    if (results.length > 0) {
                        const aprendizId = results[0].id;
                        connection.query('UPDATE aprendiz SET resetToken = NULL WHERE resetToken = ?', [token], (err, results) => {
                            if (err) {
                                console.error('Error al limpiar token:', err);
                                return res.status(500).json({ 
                                    success: false, 
                                    message: 'Error interno del servidor',
                                    error: err.message
                                });
                            }
                            
                            console.log('Token limpiado correctamente para aprendiz');
                            return res.status(200).json({ 
                                success: true, 
                                message: 'Contraseña restablecida correctamente',
                                id: aprendizId // Devolver el ID como contraseña
                            });
                        });
                    } else {
                        return res.status(404).json({ 
                            success: false, 
                            message: 'No se encontró un usuario con ese token' 
                        });
                    }
                });
            }
        });
    } catch (error) {
        console.error('Error inesperado:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Error interno del servidor',
            error: error.message
        });
    }
});

// Ruta para envío de correo de reseteo que valida la existencia del correo en las tablas administrador y aprendiz
app.post('/api/send-reset-email', async (req, res) => {
    const { email } = req.body;
    console.log('Solicitud de recuperación para:', email);

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetLink = `http://localhost:3000/HTML/mostrarContrasena.html?token=${resetToken}`;

    // Consulta unificada para verificar si el correo existe en las tablas "administrador" y "aprendiz"
    // Se ha eliminado cualquier referencia a "numeroDocumento"
    const query = `
        SELECT id, 'administrador' AS tipo FROM administrador WHERE correoElectronico = ?
        UNION ALL
        SELECT id, 'aprendiz' AS tipo FROM aprendiz WHERE correoElectronico = ?
    `;
    connection.query(query, [email, email], async (err, results) => {
        if (err) {
            console.error('Error en la consulta unificada:', err);
            return res.status(500).json({ 
                success: false, 
                message: 'Error interno del servidor', 
                error: err.message 
            });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Correo electrónico no encontrado'
            });
        }
        
        const user = results[0];
        const updateQuery = `UPDATE ${user.tipo} SET resetToken = ? WHERE id = ?`;
        connection.query(updateQuery, [resetToken, user.id], async (errUpdate) => {
            if (errUpdate) {
                console.error(`Error al actualizar token en ${user.tipo}:`, errUpdate);
                return res.status(500).json({
                    success: false,
                    message: 'Error al procesar la solicitud',
                    error: errUpdate.message
                });
            }
            try {
                await emailService.sendPasswordReset(email, resetLink);
                return res.json({
                    success: true,
                    message: 'Correo enviado exitosamente'
                });
            } catch (emailError) {
                console.error('Error al enviar correo:', emailError);
                return res.status(500).json({
                    success: false,
                    message: 'Error al enviar el correo'
                });
            }
        });
    });
});

// Ruta para resetear contraseña (al hacer clic en el botón del correo)
app.post('/api/reset-password', (req, res) => {
    const { token } = req.body;
    console.log('Intento de resetear contraseña para token:', token);
    if (!token) {
        console.log('Token no proporcionado');
        return res.status(400).json({ success: false, message: 'Token es requerido' });
    }
    // Buscar en administrador
    const queryAdmin = 'SELECT id FROM administrador WHERE resetToken = ?';
    connection.query(queryAdmin, [token], (err, results) => {
        if (err) {
            console.error('Error en consulta (admin):', err);
            return res.status(500).json({ success: false, message: 'Error interno del servidor', error: err.message });
        }
        if (results.length > 0) {
            const adminId = results[0].id;
            connection.query('UPDATE administrador SET resetToken = NULL WHERE resetToken = ?', [token], (err) => {
                if (err) {
                    console.error('Error al limpiar token (admin):', err);
                    return res.status(500).json({ success: false, message: 'Error interno del servidor', error: err.message });
                }
                console.log('Token limpiado para administrador');
                return res.status(200).json({ success: true, message: 'Contraseña restablecida correctamente', id: adminId });
            });
        } else {
            // Buscar en aprendiz
            const queryAprendiz = 'SELECT id FROM aprendiz WHERE resetToken = ?';
            connection.query(queryAprendiz, [token], (err, results) => {
                if (err) {
                    console.error('Error en consulta (aprendiz):', err);
                    return res.status(500).json({ success: false, message: 'Error interno del servidor', error: err.message });
                }
                if (results.length > 0) {
                    const aprendizId = results[0].id;
                    connection.query('UPDATE aprendiz SET resetToken = NULL WHERE resetToken = ?', [token], (err) => {
                        if (err) {
                            console.error('Error al limpiar token (aprendiz):', err);
                            return res.status(500).json({ success: false, message: 'Error interno del servidor', error: err.message });
                        }
                        console.log('Token limpiado para aprendiz');
                        return res.status(200).json({ success: true, message: 'Contraseña restablecida correctamente', id: aprendizId });
                    });
                } else {
                    return res.status(404).json({ success: false, message: 'No se encontró un usuario con ese token' });
                }
            });
        }
    });
});

// Ruta para agregar productos del minibar
app.post('/api/productos_minibar', (req, res) => {
    console.log("POST /api/productos_minibar recibido"); // Para depuración
    const { nombre, referencia, precio, imagen, cantidad } = req.body;
    const query = `
        INSERT INTO producto_minibar (nombre, referencia, precio, imagen, cantidad) 
        VALUES (?, ?, ?, ?, ?)
    `;
    connection.query(query, [nombre, referencia, precio, imagen, cantidad], (err, results) => {
        if (err) {
            console.error("Error al guardar producto del minibar:", err);
            return res.status(500).json({ 
                success: false, 
                message: "Error al guardar producto",
                error: err.message 
            });
        }
        console.log("Producto del minibar guardado:", results.insertId);
        res.json({ 
            success: true, 
            message: "Producto guardado correctamente", 
            id: results.insertId 
        });
    });
});

// Nueva ruta para buscar productos del minibar
app.get('/api/productos_minibar', (req, res) => {
    const { referencia, nombre } = req.query;
    let sql = 'SELECT * FROM producto_minibar WHERE 1';
    const params = [];

    if (referencia && referencia !== 'todos') {
       sql += ' AND referencia = ?';
       params.push(referencia);
    }

    if (nombre) {
       sql += ' AND LOWER(nombre) LIKE ?';
       params.push(`%${nombre.toLowerCase()}%`);
    }

    connection.query(sql, params, (err, results) => {
        if (err) {
            console.error("Error al buscar productos del minibar:", err);
            return res.status(500).json({ 
                success: false, 
                message: "Error al buscar productos",
                error: err.message 
            });
        }
        res.json({
            success: true, 
            products: results
        });
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

