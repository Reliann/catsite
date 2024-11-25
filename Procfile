release: pip install -r requirements.txt && python3 manage.py makemigrations --no-input && python3 manage.py migrate --no-input
web: gunicorn catsite.wsgi --log-file -
