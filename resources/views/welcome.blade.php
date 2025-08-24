<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Главная страница</title>
    @if(isset($inviteToken))
        <meta name="invite-token" content="{{ $inviteToken }}">
    @endif
    <link rel="stylesheet" href="{{ asset('css/welcome.css') }}">
</head>
<body>
    @if(session('success'))
        <div class="flash-message flash-success">
            {{ session('success') }}
        </div>
    @endif
    
    @if(session('error'))
        <div class="flash-message flash-error">
            {{ session('error') }}
        </div>
    @endif
    
    @if(session('info'))
        <div class="flash-message flash-info">
            {{ session('info') }}
        </div>
    @endif

    <div class="welcome-container">
        <h1 class="welcome-title">Добро пожаловать!</h1>
        <p class="welcome-text">Для продолжения работы необходимо авторизоваться</p>
        <button class="auth-button" onclick="openAuthModal()">Войти / Зарегистрироваться</button>
    </div>

    <!-- Модальное окно авторизации -->
    <div id="authModal" class="modal">
        <div class="modal-content">
            <span class="close-modal" onclick="closeAuthModal()">&times;</span>
            <div id="authModalContent"></div>
        </div>
    </div>

    <script src="{{ asset('js/welcome.js') }}"></script>
</body>
</html>