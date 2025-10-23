# use official Node.js image
FROM node:18

# set working directory inside the container
WORKDIR /app

# copy package.json and package-lock.json 
COPY package*.json ./


# install project dependencies
RUN npm install

# copy the rest of the application files
COPY . .


# build
RUN npm run build

# expose the port the app runs on
EXPOSE 3000

# start the application
CMD ["npm", "run", "dev"]
