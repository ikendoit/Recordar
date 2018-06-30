from node:10

# ADD FILE TO /recordar
VOLUME /recordar
WORKDIR /recordar

# prep dependency
RUN npm install
RUN npm install -g nodemon
EXPOSE 8089 

ENTRYPOINT npm start

