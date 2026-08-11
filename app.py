import os
import sys

# Ensure backend directory is in sys.path
backend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend'))
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

from backend.app import app, application, handler, db, init_db

if __name__ == '__main__':
    app.run(debug=True, port=5000)
