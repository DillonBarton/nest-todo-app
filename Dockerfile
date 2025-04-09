FROM node:20.16.0-alpine

WORKDIR /app
COPY package*.json .
RUN addgroup todo-app && adduser -S -G todo-app todo-app
RUN npm install
COPY . .
RUN chown -R todo-app:todo-app /app
USER todo-app
EXPOSE 8080

CMD ["npm", "run", "start"]