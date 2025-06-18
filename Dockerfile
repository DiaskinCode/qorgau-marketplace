FROM python:3.10

WORKDIR /backend
COPY req.txt ./
RUN pip install -r req.txt
COPY . .
RUN python manage.py makemigrations

CMD python manage.py runserver 0.0.0.0:8000


