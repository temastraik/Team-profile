/**
 * Функции для работы со страницей профиля
 */

const token = localStorage.getItem('authToken');

// Проверка авторизации
if (!token) {
    window.location.href = '/';
}

// Загрузка профиля пользователя
async function loadProfile() {
    try {
        const [profileResponse, companyResponse] = await Promise.all([
            fetch('/api/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            }),
            fetch('/api/company/info', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            })
        ]);

        if (profileResponse.ok) {
            const data = await profileResponse.json();
            displayProfile(data.user);
        } else {
            handleAuthError(profileResponse);
        }

        if (companyResponse.ok) {
            const companyData = await companyResponse.json();
            displayCompanyInfo(companyData);
        }

    } catch (error) {
        showMessage('Ошибка сети', 'error');
    }
}

// Отображение профиля пользователя
function displayProfile(user) {
    document.getElementById('userId').textContent = user.id;
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userEmail').textContent = user.email;
    document.getElementById('userRole').textContent = getRoleText(user.role);
    document.getElementById('userCreatedAt').textContent = new Date(user.created_at).toLocaleString();
    
    document.getElementById('userProfile').classList.remove('hidden');
    document.getElementById('logoutButton').classList.remove('hidden');
    document.getElementById('loading').classList.add('hidden');

    // Показываем форму создания компании только если пользователь не в компании
    if (!user.company_id) {
        document.getElementById('createCompanySection').classList.remove('hidden');
    }
}

// Отображение информации о компании
function displayCompanyInfo(companyData) {
    if (companyData.company) {
        document.getElementById('companyInfo').classList.remove('hidden');
        document.getElementById('companyNameValue').textContent = companyData.company.name;
        document.getElementById('companyManager').textContent = companyData.company.manager.name;
        document.getElementById('companyEmployeesCount').textContent = companyData.company.employees.length;

        if (companyData.is_manager) {
            document.getElementById('managerSection').classList.remove('hidden');
            document.getElementById('inviteLink').textContent = `${window.location.origin}/company/invite/${companyData.company.invite_token}`;
            
            // Отображаем список сотрудников (исключая самого менеджера)
            const employees = companyData.company.employees.filter(emp => emp.id !== companyData.company.manager_id);
            displayEmployees(employees);
        }
    }
}

// Отображение списка сотрудников
function displayEmployees(employees) {
    const employeesList = document.getElementById('employeesList');
    employeesList.innerHTML = '';

    if (employees.length === 0) {
        employeesList.innerHTML = '<div class="no-employees">Нет сотрудников</div>';
        return;
    }

    employees.forEach(employee => {
        const employeeItem = document.createElement('div');
        employeeItem.className = 'employee-item';
        employeeItem.innerHTML = `
            <div class="employee-info">
                <div class="employee-name">${employee.name}</div>
                <div class="employee-email">${employee.email}</div>
            </div>
            <div class="employee-actions">
                <button class="delete-btn" onclick="confirmDeleteEmployee(${employee.id}, '${employee.name.replace(/'/g, "\\'")}')">
                    Удалить
                </button>
            </div>
        `;
        employeesList.appendChild(employeeItem);
    });
}

// Подтверждение удаления сотрудника
function confirmDeleteEmployee(employeeId, employeeName) {
    const overlay = document.createElement('div');
    overlay.className = 'confirm-overlay';
    
    const dialog = document.createElement('div');
    dialog.className = 'confirm-dialog';
    dialog.innerHTML = `
        <h4>Подтверждение удаления</h4>
        <p>Вы уверены, что хотите удалить сотрудника <strong>${employeeName}</strong> из компании?</p>
        <div class="confirm-buttons">
            <button class="confirm-btn confirm-no" onclick="closeConfirmDialog()">Отмена</button>
            <button class="confirm-btn confirm-yes" onclick="deleteEmployee(${employeeId})">Удалить</button>
        </div>
    `;
    
    document.body.appendChild(overlay);
    document.body.appendChild(dialog);
}

// Закрытие диалога подтверждения
function closeConfirmDialog() {
    const overlay = document.querySelector('.confirm-overlay');
    const dialog = document.querySelector('.confirm-dialog');
    
    if (overlay) overlay.remove();
    if (dialog) dialog.remove();
}

// Удаление сотрудника
async function deleteEmployee(employeeId) {
    try {
        const response = await fetch(`/api/company/employees/${employeeId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        const data = await response.json();

        if (response.ok) {
            showMessage(data.message, 'success');
            closeConfirmDialog();
            // Перезагружаем данные компании
            loadCompanyInfo();
        } else {
            showMessage(data.error || 'Ошибка удаления сотрудника', 'error');
            closeConfirmDialog();
        }
    } catch (error) {
        showMessage('Ошибка сети', 'error');
        closeConfirmDialog();
    }
}

// Загрузка информации о компании
async function loadCompanyInfo() {
    try {
        const response = await fetch('/api/company/info', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            const companyData = await response.json();
            displayCompanyInfo(companyData);
        }
    } catch (error) {
        console.error('Ошибка загрузки информации о компании:', error);
    }
}

// Получение текстового представления роли
function getRoleText(role) {
    const roles = {
        'user': 'Пользователь',
        'manager': 'Руководитель',
        'executer': 'Исполнитель'
    };
    return roles[role] || role;
}

// Обработка ошибок авторизации
function handleAuthError(response) {
    if (response.status === 401) {
        localStorage.removeItem('authToken');
        window.location.href = '/';
    } else {
        showMessage('Ошибка загрузки профиля', 'error');
    }
}

// Показать сообщение
function showMessage(message, type) {
    const messageElement = document.getElementById('profileMessage');
    messageElement.textContent = message;
    messageElement.className = `message ${type}`;
    messageElement.classList.remove('hidden');
    
    setTimeout(() => {
        messageElement.classList.add('hidden');
    }, 5000);
}

// Выход из системы
async function logout() {
    try {
        const response = await fetch('/api/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            localStorage.removeItem('authToken');
            window.location.href = '/';
        } else {
            showMessage('Ошибка выхода', 'error');
        }
    } catch (error) {
        showMessage('Ошибка сети', 'error');
    }
}

// Создание компании
document.addEventListener('DOMContentLoaded', function() {
    const createCompanyForm = document.getElementById('createCompanyForm');
    if (createCompanyForm) {
        createCompanyForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const companyName = document.getElementById('companyName').value;
            
            try {
                const response = await fetch('/api/company/create', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ name: companyName })
                });

                const data = await response.json();

                if (response.ok) {
                    showMessage('Компания успешно создана!', 'success');
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    showMessage(data.error || 'Ошибка создания компании', 'error');
                }
            } catch (error) {
                showMessage('Ошибка сети', 'error');
            }
        });
    }
});

// Генерация новой ссылки приглашения
async function generateNewInvite() {
    try {
        const response = await fetch('/api/company/generate-invite', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById('inviteLink').textContent = `${window.location.origin}/company/invite/${data.invite_link.split('/').pop()}`;
            showMessage('Новая ссылка сгенерирована', 'success');
        } else {
            showMessage(data.error || 'Ошибка генерации ссылки', 'error');
        }
    } catch (error) {
        showMessage('Ошибка сети', 'error');
    }
}

// Копирование ссылки приглашения
function copyInviteLink() {
    const link = document.getElementById('inviteLink').textContent;
    navigator.clipboard.writeText(link).then(() => {
        showMessage('Ссылка скопирована в буфер обмена', 'success');
    }).catch(() => {
        showMessage('Не удалось скопировать ссылку', 'error');
    });
}

// Загрузка профиля при загрузке страницы
document.addEventListener('DOMContentLoaded', loadProfile);