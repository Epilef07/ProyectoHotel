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

    // Establecer la fecha de ingreso al valor actual
    var today = new Date().toISOString().split('T')[0];
    document.getElementById('fecha-ingreso').value = today;

    // Toggle logout option
    var profileBtn = document.querySelector('.profile-btn');
    var logoutOption = document.querySelector('.logout-option');
    profileBtn.addEventListener('click', function () {
        logoutOption.classList.toggle('show');
        if (document.documentElement.classList.contains('dark')) {
            logoutOption.style.backgroundColor = 'black';
            logoutOption.style.color = 'white';
        } else {
            logoutOption.style.backgroundColor = 'white';
            logoutOption.style.color = 'black';
        }
    });

    // Obtener el modal
    var modal = document.getElementById("mensajeModal");

    // Obtener el botón que abre el modal
    var btn = document.getElementById("reservas-btn");

    // Obtener el elemento <span> que cierra el modal
    var span = document.getElementsByClassName("close")[0];

    // Cuando el usuario hace clic en el botón, abre el modal
    btn.onclick = function() {
        modal.style.display = "block";
    }

    // Cuando el usuario hace clic en <span> (x), cierra el modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    // Cuando el usuario hace clic en cualquier lugar fuera del modal, lo cierra
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Evitar que se ingresen números o caracteres especiales en el campo de nombre
    document.getElementById('nombre').addEventListener('input', function (e) {
        var value = e.target.value;
        e.target.value = value.replace(/[^A-Za-z\s]/g, '');
    });

    // Manejar el menú desplegable del perfil
    var profileBtn = document.querySelector('.profile-btn');
    var profileContainer = document.querySelector('.profile-container');

    profileBtn.addEventListener('click', function() {
        profileContainer.classList.toggle('show');
    });

    window.addEventListener('click', function(event) {
        if (!event.target.matches('.profile-btn') && !event.target.matches('.profile-btn *')) {
            var dropdowns = document.getElementsByClassName("profile-container");
            for (var i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    });

    // Obtener el botón de perfil y la lista desplegable
    var profileBtn = document.getElementById("profile-btn");
    var profileDropdown = document.getElementById("profile-dropdown");

    // Mostrar/ocultar la lista desplegable al hacer clic en el botón de perfil
    profileBtn.onclick = function() {
        profileDropdown.style.display = profileDropdown.style.display === "block" ? "none" : "block";
    }

    // Cerrar la lista desplegable si el usuario hace clic fuera de ella
    window.onclick = function(event) {
        if (!event.target.matches('.profile-btn') && !event.target.closest('.profile-container')) {
            profileDropdown.style.display = "none";
        }
    }

    // Alternar entre modo oscuro y claro
    document.querySelector('.mode-switch').addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        document.body.classList.toggle('light-mode');
    });
});