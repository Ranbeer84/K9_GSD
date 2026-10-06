# K9 GSD Kennel

A full-stack website and management system for a German Shepherd (GSD) kennel. Visitors can browse available puppies, meet the breeding dogs, view a photo/video gallery, and send booking enquiries. The kennel owner manages everything from a secure admin panel.

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

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, React Router, Axios, Framer Motion, Lucide icons |
| Backend | Flask 3, Flask-SQLAlchemy, Flask-JWT-Extended, Flask-CORS, Flask-Mailman |
| Database | PostgreSQL |
| Images | Pillow, files stored in `backend/uploads/` |
| Production server | Gunicorn |


## Prerequisites

- Python 3.10+
- Node.js 20+
- PostgreSQL 14+

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd K9-GSD-Kennel
```

### 2. Create the database

```sql
CREATE USER kennel_admin WITH PASSWORD 'kennel123';
CREATE DATABASE k9_gsd_kennel OWNER kennel_admin;
```

> The backend builds its connection string from the `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT` and `DB_NAME` variables (defaults: `kennel_admin` / `kennel123` / `localhost` / `5432` / `k9_gsd_kennel`). To use different values, set them in `backend/.env`.

### 3. Configure the backend

Create `backend/.env`:

```env
# Database (optional, shown with defaults)
DB_USER=kennel_admin
DB_PASSWORD=kennel123
DB_HOST=localhost
DB_PORT=5432
DB_NAME=k9_gsd_kennel

# Security
JWT_SECRET_KEY=change-this-to-a-long-random-string

# CORS
CORS_ORIGINS=http://localhost:5173

# Email notifications (optional)
ADMIN_EMAIL=you@example.com
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

### 4. Run the backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

On first start the app creates all tables, the upload folders and a default admin account. The API runs at `http://localhost:5002`. Health check: `http://localhost:5002/api/health`.

### 5. Run the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Create `frontend/.env` if it doesn't exist:

```env
VITE_API_URL=http://localhost:5002/api
```

Open `http://localhost:5173`.

### 6. Log in to the admin panel

Go to `http://localhost:5173/login`.

| Username | Password |
|---|---|
| `admin` | `admin123` |

**Change this password immediately after first login** (`POST /api/auth/change-password`).

## Pages

| Route | Description |
|---|---|
| `/` | Home |
| `/puppies` | Puppy listings |
| `/our-dogs` | Breeding dogs |
| `/about` | About the kennel |
| `/gallery` | Photo and video gallery |
| `/contact` | Booking / contact form |
| `/login` | Admin login |
| `/admin/dashboard` | Admin dashboard |
| `/admin/puppies` | Manage puppies |
| `/admin/dogs` | Manage dogs |
| `/admin/gallery` | Manage gallery |
| `/admin/bookings` | Manage bookings |


## Data Model

- **Admin**: username, email, password hash, active flag
- **Dog**: name, gender, role (Stud / Dam / Both), date of birth, registration number, pedigree, health clearances, achievements, images
- **Puppy**: name, gender, date of birth, colour, weight, microchip number, sire and dam (linked to Dog), price (INR), status, description, personality, health notes, images, featured flag
- **Gallery**: title, description, media type (Image / Video), file path, category, display order
- **Booking**: customer name, email, phone, optional puppy, gender preference, message, status (New, Contacted, In Progress, ...), admin notes

See `docs/er-diagram.md` and `docs/schema.sql` for the full schema.

## Utility Scripts

Run these from `backend/` with the virtual environment active.

| Script | Purpose |
|---|---|
| `init_db.py` | **Destructive.** Drops the whole `public` schema, recreates all tables and resets the admin account. Only use for a clean reset. |
| `check_database.py` | Prints database contents and structure for debugging |
| `diagnose_gallery.py` | Diagnoses gallery and upload issues |

## Building for Production

```bash
# Frontend
cd frontend
npm run build          # outputs to frontend/dist

# Backend
cd backend
gunicorn -w 4 -b 0.0.0.0:5002 "app:create_app()"
```

Before deploying:
- Set a strong, unique `JWT_SECRET_KEY` and database password
- Change the default admin password
- Restrict CORS in `backend/app.py` (currently allows all origins)
- Set `VITE_API_URL` to your production API URL before building the frontend
- Serve `backend/uploads/` and the built frontend through a reverse proxy such as Nginx
- Never commit `.env` files

## Troubleshooting

| Problem | Fix |
|---|---|
| `password authentication failed` or `database does not exist` | Check the `DB_*` values in `backend/.env` match the database you created |
| Frontend can't reach the API | Confirm the backend is running on port 5002 and `VITE_API_URL` is correct, then restart `npm run dev` |
| Images not showing | Make sure the backend is running (it serves `/uploads`) and the files exist in `backend/uploads/` |
| Booking emails not sent | Set `MAIL_USERNAME` and `MAIL_PASSWORD` (use an app password for Gmail). Test with `POST /api/bookings/admin/test-email` |

## License

All rights reserved. Contact the project owner for usage permissions.