# K9 GSD Kennel

A full-stack website and management system for a German Shepherd (GSD) kennel. Visitors can browse available puppies, meet the breeding dogs, view a photo/video gallery, and send booking enquiries. The kennel owner manages everything from a secure admin panel.

**Live site: [k9-gsd.vercel.app](https://k9-gsd.vercel.app)**


| Home | Dashboard |
| :---: | :---: |
| ![Home](docs/GSD_home.png) | ![Dash](docs/dash.png) |

| About | Puppies |
| :---: | :---: |
| ![About](docs/about.png) | ![Puppies](docs/puppies.png) |


## Features

**Public website**

- Home, About, Our Dogs, Puppies, Gallery and Contact pages
- Puppy listings with status (Available / Reserved / Sold), photos, price (INR), parentage and personality notes
- Breeding dog profiles (studs and dams) with pedigree, health clearances and achievements
- Gallery with categories, supporting images and videos
- Puppy booking / enquiry form with gender preference

**Admin panel**

- JWT-based login and password change
- Dashboard with summary statistics
- Create, edit and delete dogs, puppies and gallery items, including multi-image upload and bulk gallery upload
- Booking manager: view enquiries, update status, add private notes
- Email notifications to the admin (and confirmation to the customer) when a booking is submitted

## Tech Stack

| Layer             | Technology                                                                |
| ----------------- | ------------------------------------------------------------------------- |
| Frontend          | React 19, Vite, React Router, Axios, Framer Motion, Lucide icons          |
| Backend           | Flask 3, Flask-SQLAlchemy, Flask-JWT-Extended, Flask-CORS, bcrypt         |
| Database          | PostgreSQL                                                                |
| Images            | Cloudinary in production, local `backend/uploads/` in development         |
| Email             | Brevo HTTPS API in production, SMTP (Flask-Mailman) in development        |
| Production server | Gunicorn                                                                  |


## Prerequisites (local development)

- Python 3.10+
- Node.js 20+
- PostgreSQL 14+

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Ranbeer84/K9_GSD.git
cd K9_GSD
```

### 2. Create the database

```sql
CREATE USER kennel_admin WITH PASSWORD 'choose-a-password';
CREATE DATABASE k9_gsd_kennel OWNER kennel_admin;
```

The backend uses `DATABASE_URL` if it is set. Otherwise it builds the connection from `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT` and `DB_NAME`.

### 3. Configure the backend

Create `backend/.env` (never commit this file):

```env
# Database: either DATABASE_URL ...
# DATABASE_URL=postgresql://kennel_admin:your-password@localhost:5432/k9_gsd_kennel
# ... or the separate pieces
DB_USER=kennel_admin
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=k9_gsd_kennel

# Security
SECRET_KEY=change-this-to-a-long-random-string
JWT_SECRET_KEY=change-this-to-another-long-random-string

# Admin account (created on first start)
ADMIN_PASSWORD=choose-a-strong-password
ADMIN_EMAIL=you@example.com

# CORS
CORS_ORIGINS=http://localhost:5173

# Email, local development only (SMTP)
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

Generate secrets with:

```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

### 4. Run the backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

On first start the app creates all tables, the upload folders and the admin account. The API runs at `http://localhost:5002`. Health check: `http://localhost:5002/api/health`.

### 5. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Create `frontend/.env` if it doesn't exist:

```env
VITE_API_URL=http://localhost:5002/api
VITE_FILE_URL=http://localhost:5002
```

Open `http://localhost:5173`.

### 6. Log in to the admin panel

Go to `http://localhost:5173/login` and sign in with username `admin` (or the `ADMIN_EMAIL` address) and the `ADMIN_PASSWORD` from your `.env`.

> If `ADMIN_PASSWORD` is not set, the app falls back to an insecure default and logs a warning. Always set it.

## License

All rights reserved. Contact the project owner for usage permissions.