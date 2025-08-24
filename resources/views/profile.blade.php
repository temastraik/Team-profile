<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Профиль пользователя</title>
    <link rel="stylesheet" href="{{ asset('css/profile.css') }}">
</head>
<body>
    <div class="container">
        <div class="form-container">
            <h2>Профиль пользователя</h2>
            
            <div id="profileMessage" class="message hidden"></div>
            
            <div id="loading" class="loading">
                Загрузка профиля...
            </div>
            
            <div id="userProfile" class="hidden">
                <div class="profile-info">
                    <h3>Информация о пользователе</h3>
                    <p><strong>ID:</strong> <span id="userId"></span></p>
                    <p><strong>Имя:</strong> <span id="userName"></span></p>
                    <p><strong>Email:</strong> <span id="userEmail"></span></p>
                    <p><strong>Роль:</strong> <span id="userRole"></span></p>
                    <p><strong>Дата регистрации:</strong> <span id="userCreatedAt"></span></p>
                </div>
                
                <div id="companyInfo" class="company-info hidden">
                    <h3>Информация о компании</h3>
                    <p><strong>Название компании:</strong> <span id="companyNameValue"></span></p>
                    <p><strong>Руководитель:</strong> <span id="companyManager"></span></p>
                    <p><strong>Количество сотрудников:</strong> <span id="companyEmployeesCount"></span></p>
                    
                    <div id="managerSection" class="hidden">
                        <h4>Управление компанией</h4>
                        
                        <div class="invite-section">
                            <h4>Пригласить сотрудника</h4>
                            <div class="invite-link" id="inviteLink"></div>
                            <button class="copy-btn" onclick="copyInviteLink()">Копировать ссылку</button>
                            <button class="copy-btn" onclick="generateNewInvite()">Сгенерировать новую ссылку</button>
                        </div>
                        
                        <div class="employees-section">
                            <h4>Сотрудники компании</h4>
                            <div id="employeesList" class="employees-list"></div>
                        </div>
                    </div>
                </div>
                
                <div id="createCompanySection" class="hidden">
                    <h3>Создать компанию</h3>
                    <form id="createCompanyForm">
                        <div class="form-group">
                            <label for="companyName">Название компании:</label>
                            <input type="text" id="companyName" name="name" required>
                        </div>
                        <button type="submit" class="btn btn-primary">Создать компанию</button>
                    </form>
                </div>
                
                <button onclick="logout()" class="btn btn-danger" id="logoutButton" class="hidden">Выйти</button>
            </div>
        </div>
    </div>

    <script src="{{ asset('js/profile.js') }}"></script>
</body>
</html>