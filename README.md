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
git clone https://github.com/MarusinaAnn/Diploma/backend.git
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Настрой .env
cp .env.example .env

python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Пример `.env`:

```env
SECRET_KEY=your_secret_key
DEBUG=True
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=yourpassword
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

`.env` в `frontend/`:

```env
REACT_APP_BACKEND_URL=http://localhost:8000
```

---

## 🌍 Продакшн-деплой (например, на Reg.ru)

1. Установите Docker + Docker Compose  
2. Настройте `docker-compose.yml` и `nginx.conf`  
3. Запуск:

```bash
docker-compose up --build -d
```

---

## 🧪 Валидация (на фронте)

- Логин: латиница, от 4 до 20 символов, первый символ — буква  
- Email: формат email  
- Пароль: не менее 6 символов, включая заглавную букву, цифру и спецсимвол

---

## ✅ Реализовано по ТЗ

- [x] SPA на React
- [x] Авторизация/регистрация
- [x] API с правами доступа
- [x] Публичные ссылки для скачивания
- [x] Развёрнутое приложение (Docker, nginx)
- [x] README на русском и английском

---

## 📄 Лицензия

MIT — свободное использование и доработка.

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

#### Backend

```bash
git clone https://github.com/MarusinaAnn/Diploma.git
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Configure .env
cp .env.example .env

python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

#### Frontend

```bash
cd frontend
npm install
npm run build
```

`.env`:

```env
REACT_APP_BACKEND_URL=http://localhost:8000
```

---

### 🌍 Production Deployment (e.g., reg.ru)

```bash
docker-compose up --build -d
```

- Includes services for backend, frontend, DB, nginx  
- Static files served via nginx  

---

### 🧪 Validation Rules

- Username: 4–20 latin characters, starts with a letter  
- Email: valid email format  
- Password: min 6 chars, 1 uppercase, 1 number, 1 special character  

---

### ✅ Ready

- [x] Fully meets the project spec  
- [x] Admin interface  
- [x] Single Page App  
- [x] Public download links  
- [x] Deployment-ready with Docker  

---

### 📄 License

MIT — free to use and adapt.
