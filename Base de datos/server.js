const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const connection = require('./dbConnection');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Servir archivos estáticos desde las diferentes carpetas
app.use(express.static(path.join(__dirname, '../HTML')));
app.use('/CSS', express.static(path.join(__dirname, '../CSS')));
app.use('/JS', express.static(path.join(__dirname, '../JS')));
app.use('/IMAGENES', express.static(path.join(__dirname, '../IMAGENES')));

// Función para generar un ID único
function generateUniqueId() {
    return Date.now(); // Genera un ID basado en la fecha y hora actual
}

// Ruta para manejar el registro de aprendices
app.post('/api/register', (req, res) => {
    const { tipoDocumento, numeroDocumento, nombreCompleto, telefono, numeroFicha, correoElectronico } = req.body;

    const query = 'INSERT INTO aprendiz (id, idAdministrador, tipoDocumento, numeroDocumento, numeroFicha, nombreCompleto, telefono, correoElectronico, fechaHoraIngreso) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [
        generateUniqueId(), // Genera un ID único
        1, // ID del administrador, puedes cambiarlo según tu lógica
        tipoDocumento,
        numeroDocumento,
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
        res.status(200).json({ success: true, message: 'Aprendiz registrado exitosamente' });
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});