// Конфигурация URL для различных сервисов
// Используем переменные окружения с значениями по умолчанию для разработки

export const config = {
  // API сервер (бэкенд)
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  
  // Ollama AI сервис
  ollamaUrl: import.meta.env.VITE_OLLAMA_URL || 'http://localhost:11434',
  
  // Модель для AI
  aiModel: import.meta.env.VITE_AI_MODEL || 'llama3',
};
