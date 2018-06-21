from postgres:10-alpine

COPY ./recordar.sql /docker-entrypoint-initdb.d

CMD psql recordar -U kien -h localhost -f /docker-entrypoint-initdb.d/recordar.sql

EXPOSE 5432
