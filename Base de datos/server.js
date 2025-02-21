const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const connection = require('./dbConnection');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos estáticos desde las diferentes carpetas
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

// Ruta para manejar el registro de aprendices
app.post('/api/register', (req, res) => {
    const { tipoDocumento, numeroDocumento, nombreCompleto, telefono, numeroFicha, correoElectronico } = req.body;

    const query = 'INSERT INTO aprendiz (id, idAdministrador, tipoDocumento, numeroFicha, nombreCompleto, telefono, correoElectronico, fechaHoraIngreso) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [
        numeroDocumento, // Usar el número de documento como ID
        1, // ID del administrador, puedes cambiarlo según tu lógica
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
            return res.status(500).json({ success: false, message: 'Error al registrar aprendiz' });
        }
        console.log('Aprendiz registrado exitosamente:', results);
        res.redirect('/'); // Redirigir a la página de inicio después de un registro exitoso
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

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});