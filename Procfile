
RUN pip install -r requirements.txt
release: python3 manage.py makemigrations --no-input && python manage.py migrate --no-input
web: gunicorn catsite.wsgi --log-file -
