
# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install -r requirements.txt

# Install additional dependencies
RUN apt-get update && apt-get install -y python3 python3-pip

release: python3 manage.py makemigrations --no-input && python manage.py migrate --no-input
web: gunicorn catsite.wsgi --log-file -
