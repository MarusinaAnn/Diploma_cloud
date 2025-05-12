# ☁️ My Cloud — Облачное хранилище / Cloud Storage

> Дипломный проект по профессии **«Fullstack-разработчик на Python»**  
> Приложение позволяет пользователям загружать, скачивать, переименовывать, удалять файлы и управлять ими через удобный интерфейс.  
> Включает интерфейс администратора с управлением пользователями и статистикой.

---

### 🌐 Развёрнутое приложение

👉 [http://194.67.84.156/](http://194.67.84.156/)

---

## 🇷🇺 Описание

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

# Настройте .env


python manage.py migrate
# суперюзер создаётся автоматически через миграцию (admin / admin12345)
python manage.py runserver
```

`.env`:

```env
SECRET_KEY=ваш_секрет
DEBUG=True
DB_NAME=mycloud
DB_USER=myuser
DB_PASSWORD=mypassword
DB_HOST=localhost
DB_PORT=5432
ALLOWED_HOSTS=localhost,127.0.0.1,194.67.84.156
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
REACT_APP_BACKEND_URL=http://194.67.84.156
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
- [x] README на русском языке

---

## 🧪 Валидация

- Логин: латиница, от 4 до 20 символов, первый символ — буква  
- Email: формат email  
- Пароль: не менее 6 символов, включая заглавную букву, цифру и спецсимвол

---

## 🔐 Доступы администратора

```
Логин: admin
Пароль: admin12345
```

---

## 📝 Лицензия

MIT — свободное использование и адаптация.
