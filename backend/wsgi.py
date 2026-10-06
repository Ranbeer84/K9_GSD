"""
WSGI entry point for production (Gunicorn).

Creates the Flask app, then makes sure the database tables and the
default admin account exist. init_db() is safe to re-run: it only
creates what is missing.

Run from the backend/ folder:
    gunicorn --preload -w 3 -b 127.0.0.1:5002 wsgi:app

--preload makes Gunicorn import this file once in the master process
(before forking workers), so init_db() runs once instead of once per
worker, which avoids workers racing to create the admin account.
"""
from app import create_app
from database import init_db

app = create_app()
init_db(app)