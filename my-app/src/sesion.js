document.querySelector('button[name="send2"]').addEventListener('click', function(event) {
    event.preventDefault();
    const email = document.querySelector('input[type="email"]').value;
    const password = document.querySelector('input[type="password"]').value;

    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = '/menu.html';
        } else {
            alert('Error al iniciar sesión');
        }
    })
    .catch(error => console.error('Error:', error));
});
