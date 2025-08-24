/**
 * Функции для работы с модальным окном авторизации
 */

// Показать форму регистрации
function showRegister() {
    document.getElementById('registerForm').classList.remove('hidden');
    document.getElementById('loginForm').classList.add('hidden');
}

// Показать форму входа
function showLogin() {
    document.getElementById('registerForm').classList.add('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
}

// Показать сообщение
function showMessage(elementId, message, type) {
    const messageElement = document.getElementById(elementId);
    messageElement.textContent = message;
    messageElement.className = `message ${type}`;
    messageElement.classList.remove('hidden');
    
    setTimeout(() => {
        messageElement.classList.add('hidden');
    }, 5000);
}

// Установить состояние загрузки
function setLoading(show) {
    document.getElementById('loading').classList.toggle('hidden', !show);
}

// Обработчик отправки формы регистрации
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerFormElement');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('regName').value,
                email: document.getElementById('regEmail').value,
                password: document.getElementById('regPassword').value,
                password_confirmation: document.getElementById('regPasswordConfirmation').value
            };

            if (formData.password !== formData.password_confirmation) {
                showMessage('registerMessage', 'Пароли не совпадают', 'error');
                return;
            }

            setLoading(true);
            
            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('authToken', data.token);
                    showMessage('registerMessage', 'Регистрация успешна!', 'success');
                    setTimeout(() => {
                        window.location.href = '/profile';
                    }, 1000);
                } else {
                    showMessage('registerMessage', data.error || 'Ошибка регистрации', 'error');
                }
            } catch (error) {
                showMessage('registerMessage', 'Ошибка сети', 'error');
            } finally {
                setLoading(false);
            }
        });
    }

    // Обработчик отправки формы входа
    const loginForm = document.getElementById('loginFormElement');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                email: document.getElementById('loginEmail').value,
                password: document.getElementById('loginPassword').value
            };

            setLoading(true);
            
            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('authToken', data.token);
                    showMessage('loginMessage', 'Вход успешен!', 'success');
                    setTimeout(() => {
                        window.location.href = '/profile';
                    }, 1000);
                } else {
                    showMessage('loginMessage', data.error || 'Ошибка входа', 'error');
                }
            } catch (error) {
                showMessage('loginMessage', 'Ошибка сети', 'error');
            } finally {
                setLoading(false);
            }
        });
    }
});