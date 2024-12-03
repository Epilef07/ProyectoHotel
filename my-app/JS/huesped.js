document.addEventListener('DOMContentLoaded', function () {
    var modeSwitch = document.querySelector('.mode-switch');
    var isDarkMode = localStorage.getItem('darkMode') === 'true';

    if (isDarkMode) {
        document.documentElement.classList.add('dark');
        modeSwitch.classList.add('active');
        document.querySelector('footer').classList.add('dark');
    }

    modeSwitch.addEventListener('click', function () {
        document.documentElement.classList.toggle('dark');
        modeSwitch.classList.toggle('active');
        document.querySelector('footer').classList.toggle('dark');
        localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
    });

    var listView = document.querySelector('.list-view');
    var gridView = document.querySelector('.grid-view');
    var projectsList = document.querySelector('.project-boxes');
    listView.addEventListener('click', function () {
        gridView.classList.remove('active');
        listView.classList.add('active');
        projectsList.classList.remove('jsGridView');
        projectsList.classList.add('jsListView');
    });
    gridView.addEventListener('click', function () {
        gridView.classList.add('active');
        listView.classList.remove('active');
        projectsList.classList.remove('jsListView');
        projectsList.classList.add('jsGridView');
    });
    document.querySelector('.messages-btn').addEventListener('click', function () {
        document.querySelector('.messages-section').classList.add('show');
    });
    document.querySelector('.messages-close').addEventListener('click', function () {
        document.querySelector('.messages-section').classList.remove('show');
    });
});

document.getElementById('new-guest-btn').addEventListener('click', function () {
    document.getElementById('new-guest-form').classList.add('active');
    document.getElementById('old-guest-form').classList.remove('active');
    this.classList.add('active');
    document.getElementById('old-guest-btn').classList.remove('active');
});

document.getElementById('old-guest-btn').addEventListener('click', function () {
    document.getElementById('old-guest-form').classList.add('active');
    document.getElementById('new-guest-form').classList.remove('active');
    this.classList.add('active');
    document.getElementById('new-guest-btn').classList.remove('active');
});

// Nueva funcionalidad para buscar huésped
document.getElementById('old-guest-form').addEventListener('submit', function (event) {
    event.preventDefault();
    var documentType = document.getElementById('document-type').value;
    var documentId = document.getElementById('id').value;

    // Simulación de búsqueda de datos del huésped
    var guestData = {
        name: 'Juan Pérez',
        surname: 'Gómez',
        birthdate: '1990-01-01',
        phone: '123456789',
        emergencyContactName: 'María Pérez',
        emergencyContactPhone: '987654321'
    };

    // Mostrar los datos en la tabla
    var table = document.getElementById('guest-data-table');
    table.innerHTML = `
        <tr>
            <td>${guestData.name}</td>
            <td>${guestData.surname}</td>
            <td>${guestData.birthdate}</td>
            <td>${guestData.phone}</td>
            <td>${guestData.emergencyContactName}</td>
            <td>${guestData.emergencyContactPhone}</td>
        </tr>
    `;
    table.style.display = 'table';

    // Aplicar modo nocturno si está activo
    if (document.documentElement.classList.contains('dark')) {
        table.classList.add('dark');
    } else {
        table.classList.remove('dark');
    }
});