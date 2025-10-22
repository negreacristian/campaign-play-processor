# use official Node.js image
FROM node:18

# set working directory inside the container
WORKDIR /app

# copy package.json and package-lock.json 
COPY package*.json ./

# copy the rest of the application files
COPY . .

# install project dependencies
RUN npm install

# expose the port the app runs on
EXPOSE 5173

# start the application
CMD ["npm", "run", "start"]
