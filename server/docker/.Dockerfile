FROM python:3.10-slim-buster

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .

WORKDIR /
EXPOSE 8000
CMD ["sh", "-c", "alembic upgrade head ; /cd pkg; python3 pkg/entrypoint.py"]
