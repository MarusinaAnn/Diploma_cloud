# ☁️ My Cloud — Облачное хранилище / Cloud Storage

> Дипломный проект по профессии **«Fullstack-разработчик на Python»**  
> Приложение позволяет пользователям загружать, скачивать, переименовывать, удалять файлы и управлять ими через удобный интерфейс.  
> Включает интерфейс администратора с управлением пользователями и статистикой.

---

### 🌐 Развёрнутое приложение

👉 [http://194.67.84.156/](http://194.67.84.156/)

---

## 🇷🇺 Описание (Russian)

### 🚀 Возможности

👤 Для пользователя:
- Регистрация с валидацией
- Вход / выход
- Загрузка файлов с комментарием
- Скачивание, удаление, переименование
- Публичная ссылка на файл (без авторизации)

🛠 Для администратора:
- Просмотр и удаление пользователей
- Назначение/снятие прав администратора
- Просмотр всех файлов любого пользователя
- Статистика: количество и объём файлов

---

## 🧱 Стек технологий

**Бэкенд**:
- Python 3.10+
- Django 4+
- Django REST Framework
- PostgreSQL
- Token-based authentication
- Локальное файловое хранилище

**Фронтенд**:
- React 18
- TypeScript
- React Router 6
- Axios
- React Toastify (уведомления)

---

## 📦 Установка и запуск

### Backend

```bash
git clone https://github.com/MarusinaAnn/Diploma-cloud.git 
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Настрой .env
cp .env.example .env

python manage.py migrate
# суперюзер создаётся автоматически через миграцию (admin / admin12345)
python manage.py runserver
```

`.env.example`:

```env
SECRET_KEY=ваш_секрет
DEBUG=False
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=пароль
DB_HOST=localhost
DB_PORT=5432
```

---

### Frontend

```bash
cd frontend
npm install
npm run build
```

`.env`:

```env
REACT_APP_BACKEND_URL=http://194.67.84.156/api
```

---

## 🌍 Продакшн-деплой на VPS (Reg.ru)

### Установка окружения на сервере

```bash
sudo apt update && sudo apt install python3 python3-pip python3-venv postgresql nginx nodejs npm -y
```

### Развёртывание проекта

```bash
git clone https://github.com/MarusinaAnn/Diploma-cloud.git /opt/mycloud
cd /opt/mycloud/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
```

### Настройка Nginx

```nginx
server {
    listen 80;
    server_name 194.67.84.156;

    client_max_body_size 300M;

    root /opt/mycloud/frontend/build;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location /static/ {
        alias /opt/mycloud/frontend/build/static/;
    }

    location /media/ {
        alias /opt/mycloud/backend/media/;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/mycloud /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Настройка Gunicorn через systemd

```ini
# /etc/systemd/system/mycloud.service

[Unit]
Description=MyCloud Django App with Gunicorn
After=network.target

[Service]
User=root
Group=www-data
WorkingDirectory=/opt/mycloud/backend
ExecStart=/opt/mycloud/backend/venv/bin/gunicorn wsgi:application --bind 127.0.0.1:8000
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reexec
sudo systemctl daemon-reload
sudo systemctl start mycloud
sudo systemctl enable mycloud
```

---

## ✅ Реализовано по ТЗ

- [x] SPA на React
- [x] Авторизация/регистрация
- [x] API с правами доступа
- [x] Публичные ссылки для скачивания
- [x] Развёртывание на сервере (без Docker)
- [x] Суперпользователь в миграции
- [x] README на русском и английском

---

## 🧪 Валидация

- Логин: латиница, от 4 до 20 символов, первый символ — буква  
- Email: формат email  
- Пароль: не менее 6 символов, включая заглавную букву, цифру и спецсимвол

---
---

## ❓ Подробные ответы на вопросы и замечания от 17.04.2025

### 1. Как устанавливались зависимости?

Окружение ставилось вручную через `apt`, как указано в инструкции выше:

```bash
sudo apt update && sudo apt install python3 python3-pip python3-venv postgresql nginx nodejs npm -y
```

Это базовые инструменты для развёртывания приложения:
- `python3`, `pip`, `venv` — для Python-бэкенда
- `postgresql` — база данных
- `nginx` — веб-сервер
- `nodejs`, `npm` — для сборки фронтенда

### 2. Почему фронтенд и бэкенд оказались на сервере?

После подключения к VPS:
- проект был клонирован из репозитория `git clone ... /opt/mycloud`
- внутри директории `/opt/mycloud` находятся `backend` и `frontend`
- развертывание происходило вручную по шагам (см. выше)

### 3. Создание суперюзера

Суперпользователь создаётся автоматически при запуске миграций:  
в `accounts/migrations/0002_create_admin.py` добавлен код для создания пользователя `admin / admin12345`.

```python
def create_superuser(apps, schema_editor):
    User = apps.get_model('accounts', 'CustomUser')
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='admin12345',
            is_admin=True,
        )
```

### 4. Конфигурация nginx

Файл размещён в `/etc/nginx/sites-available/mycloud`, активирован через `sites-enabled`.

Дефолтный конфиг `nginx.conf` не используется. Все настройки прописаны в отдельном виртуальном хосте, как положено в продакшне.

```bash
sudo ln -s /etc/nginx/sites-available/mycloud /etc/nginx/sites-enabled/
```

### 5. Проксирование gunicorn

Gunicorn запущен с привязкой по `host:port`:

```
ExecStart=/opt/mycloud/backend/venv/bin/gunicorn wsgi:application --bind 127.0.0.1:8000
```

Проверка успешности проксирования выполнена:

```bash
curl -I http://127.0.0.1:8000
```

Ответ: `HTTP/1.1 200 OK`  
Nginx корректно проксирует трафик по адресу `/api/` к Gunicorn.

### 6. Почему client_max_body_size?

Добавлена строка:

```nginx
client_max_body_size 300M;
```

Она позволяет загружать крупные файлы. Без неё nginx возвращал ошибку `413 Request Entity Too Large`.

### 7. Статика

```nginx
location /media/ {
    alias /opt/mycloud/backend/media/;
}
```

Здесь отдаются пользовательские файлы (загруженные через API).

А `location /static/` используется только для фронта, и указывает на `/frontend/build/static/`. Это не имеет отношения к Django `STATIC_ROOT`, который в продакшене не используется, так как всё — SPA.

---

## 👤 Данные суперпользователя

- **Логин:** `admin`
- **Пароль:** `admin12345`
- Пользователь создаётся через миграции (вручную не добавляется)

---
