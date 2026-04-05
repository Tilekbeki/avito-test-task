# Используем Node.js 20
FROM node:20-alpine

# Устанавливаем pnpm для управления зависимостями
RUN npm install -g pnpm

# Рабочая директория
WORKDIR /app

# Копируем package.json и pnpm-lock.yaml
COPY front/package.json front/pnpm-lock.yaml* ./

# Устанавливаем зависимости
RUN pnpm install --frozen-lockfile

# Копируем исходный код
COPY front/ ./

# Порт, на котором работает Vite
EXPOSE 3000

# Команда запуска
CMD ["pnpm", "run", "dev", "--host"]
