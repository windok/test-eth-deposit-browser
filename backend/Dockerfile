# Image
FROM node:14.16.1-alpine3.11

# Set up app directory
ARG WORK_DIR
WORKDIR $WORK_DIR

# copy package files
COPY package*.json ./

# install modules
RUN npm install

# run application
EXPOSE 3000

CMD ["npm", "run", "start:dev"]
