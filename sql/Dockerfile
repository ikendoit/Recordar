from postgres:10-alpine

COPY ./recordar.sql /docker-entrypoint-initdb.d

#RUN psql postgres -c "drop database recordar"
#CMD psql recordar -U kien -h localhost -f /docker-entrypoint-initdb.d/recordar.sql

#CMD "hello world"
ENTRYPOINT echo "checking entrypoint"

EXPOSE 5432
