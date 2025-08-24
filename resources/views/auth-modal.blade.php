<link rel="stylesheet" href="{{ asset('css/auth-modal.css') }}">

<div class="form-container">
    <!-- Форма регистрации -->
    <div id="registerForm" class="hidden">
        <h2>Регистрация</h2>
        <div id="registerMessage" class="message hidden"></div>
        
        <form id="registerFormElement">
            <div class="form-group">
                <label for="regName">Имя:</label>
                <input type="text" id="regName" name="name" required>
            </div>
            <div class="form-group">
                <label for="regEmail">Email:</label>
                <input type="email" id="regEmail" name="email" required>
            </div>
            <div class="form-group">
                <label for="regPassword">Пароль:</label>
                <input type="password" id="regPassword" name="password" required minlength="6">
            </div>
            <div class="form-group">
                <label for="regPasswordConfirmation">Подтверждение пароля:</label>
                <input type="password" id="regPasswordConfirmation" name="password_confirmation" required minlength="6">
            </div>
            <button type="submit">Зарегистрироваться</button>
        </form>
        
        <div class="switch-form">
            Уже есть аккаунт? <a onclick="showRegister()">Войти</a>
        </div>
    </div>

    <!-- Форма входа -->
    <div id="loginForm">
        <h2>Вход</h2>
        <div id="loginMessage" class="message hidden"></div>
        
        <form id="loginFormElement">
            <div class="form-group">
                <label for="loginEmail">Email:</label>
                <input type="email" id="loginEmail" name="email" required>
            </div>
            <div class="form-group">
                <label for="loginPassword">Пароль:</label>
                <input type="password" id="loginPassword" name="password" required>
            </div>
            <button type="submit">Войти</button>
        </form>
        
        <div class="switch-form">
            Нет аккаунта? <a onclick="showRegister()">Зарегистрироваться</a>
        </div>
    </div>

    <!-- Индикатор загрузки -->
    <div id="loading" class="loading hidden">
        Загрузка...
    </div>
</div>

<script src="{{ asset('js/auth-modal.js') }}"></script>