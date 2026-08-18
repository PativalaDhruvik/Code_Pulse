import os
import sys
import shutil
from pathlib import Path

# Locate root directory and Django backend directory
ROOT_DIR = Path(__file__).resolve().parent.parent
BACKEND_DIR = ROOT_DIR / "backend"

# Insert backend path to sys.path so Django modules are discoverable
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

# Ensure SQLite database is present in writable /tmp directory on Vercel
if os.environ.get("VERCEL"):
    tmp_db = Path("/tmp/db.sqlite3")
    src_db = BACKEND_DIR / "db.sqlite3"
    if not tmp_db.exists() and src_db.exists():
        try:
            shutil.copy2(src_db, tmp_db)
        except Exception as e:
            print(f"Note: Could not copy SQLite database to /tmp: {e}")

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "codepulse_backend.settings")

import django
django.setup()

from django.core.management import call_command
try:
    call_command("migrate", interactive=False)
except Exception as e:
    print(f"Startup migration warning: {e}")

from django.core.wsgi import get_wsgi_application

app = application = get_wsgi_application()
