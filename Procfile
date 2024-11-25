release: pip install -r requirements.txt && python manage.py makemigrations --no-input && python manage.py migrate --no-input
web: gunicorn catsite.wsgi --log-file -
