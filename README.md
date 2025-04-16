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
python -m venv venv
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

### Минимальная инструкция

1. Установить `nginx`, `postgresql`, `python3`, `pip`, `venv`, `nodejs`, `npm`
2. Развернуть фронтенд (`npm run build`) и бэкенд (`migrate`, `createsuperuser`, `collectstatic` если нужно)
3. Настроить nginx — пример конфига лежит в `/etc/nginx/sites-available/mycloud`:

```nginx
server {
    listen 80;
    server_name 194.67.84.156;

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

### Настройка systemd-сервиса для Gunicorn

```bash
sudo nano /etc/systemd/system/mycloud.service
```

```ini
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
sudo systemctl status mycloud
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

## 🇬🇧 English Version

### ☁️ My Cloud — Cloud Storage Web App

Final diploma project for the **"Fullstack Python Developer"** program.  
Allows users to upload, download, rename, delete and share files through a simple cloud interface.

---

### 🚀 Features

👤 For users:
- Registration with validation
- Login / Logout
- Upload files with comment
- Rename, delete, download
- Public link (accessible without login)

🛠 For admins:
- User list and deletion
- Promote/demote admin role
- View files of any user
- Per-user and global file stats

---

### 🧱 Tech stack

**Backend**:
- Python 3.10+
- Django
- Django REST Framework
- PostgreSQL
- Token auth + local file storage

**Frontend**:
- React 18
- TypeScript
- React Router
- Axios
- React Toastify

---

### 📦 Local Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Frontend:

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

### ✅ Done

- [x] Full REST API with token auth
- [x] Admin panel with file/user control
- [x] Public file sharing
- [x] Deployment on VPS (no Docker)
- [x] Superuser created via migration (admin / admin12345)

---

### 📄 License

MIT — free to use and adapt.
