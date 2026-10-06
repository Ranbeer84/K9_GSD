"""
Generate a production .env with strong random secrets.

Usage (run on your own machine or on the server, from backend/):
    python3 generate_env.py https://yourdomain.com

Writes backend/.env.production (permissions 600) and never prints the secrets.
Open the file to see the values, copy it to the server as backend/.env,
then delete your local copy.

Passwords use token_urlsafe, so they only contain letters, digits, '-' and '_'.
That matters: config.py builds the database URL as a plain string, so a
password containing characters like @ : / # would break the connection.
"""
import os
import secrets
import sys

OUT = ".env.production"

if os.path.exists(OUT):
    sys.exit(f"{OUT} already exists. Delete or rename it first (not overwriting).")

origin = sys.argv[1] if len(sys.argv) > 1 else "https://yourdomain.com"

content = f"""# Production environment - NEVER commit this file
DEBUG=False

# Security
JWT_SECRET_KEY={secrets.token_urlsafe(48)}
SECRET_KEY={secrets.token_urlsafe(48)}

# First admin account (only used when the admin is first created)
ADMIN_PASSWORD={secrets.token_urlsafe(18)}
ADMIN_EMAIL=you@example.com

# Database
DB_USER=kennel_admin
DB_PASSWORD={secrets.token_urlsafe(24)}
DB_HOST=localhost
DB_PORT=5432
DB_NAME=k9_gsd_kennel

# CORS
CORS_ORIGINS={origin}

# Email (optional)
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=
MAIL_PASSWORD=
"""

fd = os.open(OUT, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
with os.fdopen(fd, "w") as f:
    f.write(content)

print(f"Created {OUT} with fresh secrets (permissions 600).")
print("Next: open it, set ADMIN_EMAIL / MAIL_*, then apply the DB password in Postgres.")