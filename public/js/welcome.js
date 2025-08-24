/**
 * Функции для работы с главной страницей
 */

// Скрытие flash сообщений через 5 секунд
setTimeout(() => {
    const flashMessages = document.querySelectorAll('.flash-message');
    flashMessages.forEach(msg => {
        msg.style.display = 'none';
    });
}, 5000);

// Проверка наличия приглашения после авторизации
function checkInviteAfterAuth() {
    const inviteToken = document.querySelector('meta[name="invite-token"]')?.content;
    if (inviteToken && localStorage.getItem('authToken')) {
        // Если есть приглашение и пользователь авторизован, обрабатываем приглашение
        window.location.href = '/company/invite/' + inviteToken + '?token=' + localStorage.getItem('authToken');
    }
}

// Открытие модального окна авторизации
function openAuthModal() {
    fetch('/auth/modal')
        .then(response => response.text())
        .then(html => {
            document.getElementById('authModalContent').innerHTML = html;
            document.getElementById('authModal').style.display = 'flex';
            initializeAuthScript();
        });
}

// Инициализация скриптов авторизации
function initializeAuthScript() {
    // Добавляем функции переключения форм в глобальную область видимости
    window.showRegister = function() {
        document.getElementById('registerForm').classList.remove('hidden');
        document.getElementById('loginForm').classList.add('hidden');
    }

    window.showLogin = function() {
        document.getElementById('registerForm').classList.add('hidden');
        document.getElementById('loginForm').classList.remove('hidden');
    }

    // Регистрация
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
                        // Закрываем модальное окно и перезагружаем страницу
                        closeAuthModal();
                        window.location.href = "/profile";
                    }, 1000);
                } else {
                    const errorMessage = data.error || (data.errors ? Object.values(data.errors).flat().join(', ') : 'Ошибка регистрации');
                    showMessage('registerMessage', errorMessage, 'error');
                }
            } catch (error) {
                showMessage('registerMessage', 'Ошибка сети', 'error');
            } finally {
                setLoading(false);
            }
        });
    }

    // Вход
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
                        // Закрываем модальное окно и перезагружаем страницу
                        closeAuthModal();
                        window.location.href = "/profile";
                    }, 1000);
                } else {
                    const errorMessage = data.error || (data.errors ? Object.values(data.errors).flat().join(', ') : 'Ошибка входа');
                    showMessage('loginMessage', errorMessage, 'error');
                }
            } catch (error) {
                showMessage('loginMessage', 'Ошибка сети', 'error');
            } finally {
                setLoading(false);
            }
        });
    }

    function showMessage(elementId, message, type) {
        const messageElement = document.getElementById(elementId);
        messageElement.textContent = message;
        messageElement.className = `message ${type}`;
        messageElement.classList.remove('hidden');
        
        setTimeout(() => {
            messageElement.classList.add('hidden');
        }, 5000);
    }

    function setLoading(show) {
        document.getElementById('loading').classList.toggle('hidden', !show);
    }
}

// Закрытие модального окна
function closeAuthModal() {
    document.getElementById('authModal').style.display = 'none';
}

// Закрытие модального окна при клике вне его
window.onclick = function(event) {
    const modal = document.getElementById('authModal');
    if (event.target === modal) {
        closeAuthModal();
    }
}

// Проверка авторизации при загрузке
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('authToken');
    if (token) {
        checkAuth();
    }
    
    // Проверяем приглашение при загрузке
    checkInviteAfterAuth();
});

// Проверка авторизации
function checkAuth() {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    fetch('/api/profile', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            window.location.href = "/profile";
        } else {
            localStorage.removeItem('authToken');
        }
    })
    .catch(() => {
        localStorage.removeItem('authToken');
    });
}