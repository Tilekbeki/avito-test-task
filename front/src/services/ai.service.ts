// services/ai.service.ts
import axios from 'axios';

export interface AiPriceResponse {
  suggestions: string[];
  title: string;
}

export const aiService = {
  async getMarketPrice(title: string, params: Record<string, any>): Promise<AiPriceResponse> {
    const prompt = `Цена на ${title} (${JSON.stringify(params)}):
[мин] – [макс] ₽ — отличное.
От [цена] ₽ — идеал.
[мин] – [макс] ₽ — дефекты.
Только цифры.`;
    
    try {
      const res = await axios.post('http://localhost:11434/api/generate', {
        model: 'llama3',
        prompt,
        stream: false,
        max_tokens: 150,
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      const lines = res.data.response?.split('\n').filter(Boolean) || [];
      return {
        title: lines[0] || 'Рыночная цена',
        suggestions: lines.slice(1) || [],
      };
    } catch (error) {
      console.error('Ollama API error:', error);
      throw error;
    }
  },

  async generateDescription(title: string, params: Record<string, any>, currentDescription?: string): Promise<string> {
    // Формируем понятный список характеристик
    const paramsText = Object.entries(params)
      .filter(([_, value]) => value)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');

    const prompt = currentDescription 
      ? `Улучши описание: "${currentDescription}" для ${title} (${paramsText}). Напиши кратко, по-русски, продающе, как в примере:
Продаю свой MacBook Pro 16" (2021) на чипе M1 Pro. Состояние отличное, работал бережно. Мощности хватает на всё: от сложного монтажа до кода, при этом ноутбук почти не греется."

Только описание, без лишнего текста.`
      
      : `Напиши описание для ${title} (${paramsText}). Кратко, по-русски, продающе. Пример:
"Продаю свой MacBook Pro 16" (2021) на чипе M1 Pro. Состояние отличное, работал бережно. Мощности хватает на всё.

Только описание.`;

    try {
      const res = await axios.post('http://localhost:11434/api/generate', {
        model: 'llama3',
        prompt,
        stream: false,
        max_tokens: 200,
        temperature: 0.7,
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      return res.data.response.trim();
    } catch (error) {
      console.error('Ollama API error:', error);
      throw error;
    }
  },
};