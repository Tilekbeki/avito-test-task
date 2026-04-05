# Используем Node.js 20
FROM node:20-alpine

# Рабочая директория
WORKDIR /app

# Копируем package.json
COPY front/package.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код
COPY front/ ./

# Порт, на котором работает Vite
EXPOSE 3000

# Команда запуска
CMD ["npm", "run", "dev", "--host"]
