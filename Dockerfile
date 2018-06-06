from node:10

# ADD FILE TO /recordar
RUN mkdir /recordar 
ADD . /recordar 
WORKDIR /recordar 

# prep dependency
RUN apt-get update
RUN apt-get -y upgrade
RUN npm install 
RUN npm install -g nodemon babel-cli
EXPOSE 8089 

CMD ["npm","start"]
