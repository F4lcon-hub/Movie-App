// signup.js - Cadastro de usuário local
const form = document.getElementById('signup-form');
const message = document.getElementById('signup-message');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const username = form.username.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    if (!username || !email || !password) {
        message.textContent = 'Preencha todos os campos.';
        message.style.color = 'red';
        return;
    }
    // Salvar usuário no LocalStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) {
        message.textContent = 'E-mail já cadastrado.';
        message.style.color = 'red';
        return;
    }
    users.push({ username, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    message.textContent = 'Conta criada com sucesso!';
    message.style.color = 'green';
    form.reset();
});
