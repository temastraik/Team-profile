team-profile - система с минимальным управлением командой.

Требования (технологии): PHP 8.4, Composer, Laravel 12, MySQL (или другая СУБД)

Чтобы запустить этот проект локально, выполните следующие шаги:

1.  **Клонируйте репозиторий:**
    ```bash
    git clone https://github.com/temastraik/team-profile
    cd team-profile
    ```

2.  **Установите зависимости PHP:**
    ```bash
    composer install
    composer require laravel/sanctum
    ```

3.  **Настройте environment-файл:**

    Скопируйте файл `.env.example` в `.env` и настройте базовые параметры Laravel.
    
    *Настройте Базу данных по вашим параметрам*
    
    <img width="172" height="116" alt="image" src="https://github.com/user-attachments/assets/a7f2a96d-fabc-438c-a2b0-2736b2179f30" />

5.  **Запустите необходимые команды:**
    ```bash
    php artisan migrate
    php artisan key:generate
    ```

Функционал:

- Регистрация, аутентификация и авторизация пользователей по REST API с токеном Bearer;

<img width="398" height="553" alt="image" src="https://github.com/user-attachments/assets/0f7482c5-5ec3-46cc-8a15-b336cb852e23" />

- Создание команды, приглашение в нее участников по защищенной ссылке, удаление участников;

<img width="806" height="1089" alt="image" src="https://github.com/user-attachments/assets/b4d6ad90-6d1f-413c-bde6-6eea41691de0" />
