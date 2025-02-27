const connection = require('./dbConnection');

// Función para agregar una reserva
function agregarReserva(reserva, callback) {
    const query = 'INSERT INTO reserva (numeroHabitacion, idHuesped, fechaIngreso, fechaSalida, abono) VALUES (?, ?, ?, ?, ?)';
    const values = [reserva.numeroHabitacion, reserva.idHuesped, reserva.fechaIngreso, reserva.fechaSalida, reserva.abono]; // Valores predeterminados para idAdministrador e idAprendiz

    console.log('Iniciando la función agregarReserva'); // Agregar log para depuración
    console.log('Query:', query); // Agregar log para depuración
    console.log('Values:', values); // Agregar log para depuración

    connection.query(query, values, (err, results) => {
        if (err) {
            console.error('Error al agregar la reserva:', err.message, err.code);
            console.error('Detalles del error:', err); // Agregar detalles del error
            return callback(new Error(`No se pudo agregar la reserva: ${err.message}`));
        }
        console.log('Resultados de la consulta de inserción:', results); // Confirmar éxito
        console.log('Reserva agregada correctamente'); // Mensaje de éxito
        callback(null, results);
    });
}

module.exports = {
    agregarReserva
};