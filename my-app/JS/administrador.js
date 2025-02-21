document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        locale: 'es', // Configurar el idioma a español
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: [
            // Aquí puedes agregar eventos de ejemplo
            {
                title: 'Evento 1',
                start: '2025-02-20'
            },
            {
                title: 'Evento 2',
                start: '2025-02-21',
                end: '2025-02-23'
            }
        ],
        nowIndicator: true, // Mostrar un indicador para el tiempo actual
        dayCellClassNames: function(arg) {
            var today = new Date();
            var tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);

            if (arg.date.getFullYear() === today.getFullYear() &&
                arg.date.getMonth() === today.getMonth() &&
                arg.date.getDate() === today.getDate()) {
                return ['fc-day-today'];
            } else if (arg.date.getFullYear() === tomorrow.getFullYear() &&
                arg.date.getMonth() === tomorrow.getMonth() &&
                arg.date.getDate() === tomorrow.getDate()) {
                return ['fc-day-tomorrow'];
            }
            return [];
        }
    });
    calendar.render();
});