# Используем Node.js 20
FROM node:20-alpine

# Рабочая директория
WORKDIR /app

# Копируем package.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код
COPY . .

# Порт, на котором работает сервер
EXPOSE 8080

# Команда запуска (используем ts-node или node, в зависимости от настройки)
CMD ["npm", "run", "start"]