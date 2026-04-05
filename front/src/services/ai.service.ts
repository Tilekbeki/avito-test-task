import axios from 'axios';
import { config } from '../shared/config';

export interface AiPriceResponse {
  suggestions: string[];
  title: string;
}

export const aiService = {
  async getMarketPrice(title: string, params: Record<string, any>): Promise<AiPriceResponse> {
   
    const paramsText = Object.entries(params)
      .filter(([_, value]) => value)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
    
    const prompt = `Ты эксперт по оценке товаров на Avito. Определи рыночную цену для:
Товар: ${title}
Характеристики: ${paramsText}

Дай ответ в строго указанном формате:

Средняя цена на ${title} (с основными характеристиками в скобках):
[мин] – [макс] ₽ — отличное состояние.
От [цена] ₽ — идеал, [причина].
[мин] – [макс] ₽ — срочно или с дефектами.

Пример ответа для MacBook Pro 16" M1 Pro:
Средняя цена на MacBook Pro 16" M1 Pro (16/512GB):
115 000 – 135 000 ₽ — отличное состояние.
От 140 000 ₽ — идеал, малый износ АКБ.
90 000 – 110 000 ₽ — срочно или с дефектами.

Дай ТОЛЬКО эти три строки, без лишнего текста и пояснений.`;
    
    try {
      const res = await axios.post(`${config.ollamaUrl}/api/generate`, {
        model: config.aiModel,
        prompt,
        stream: false,
        max_tokens: 200,
        temperature: 0.5,
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      const responseText = res.data.response?.trim() || '';
      const lines = responseText.split('\n').filter(Boolean);
      
      const titleLine = lines[0] || `Средняя цена на ${title}:`;
      const suggestions = lines.slice(1) || [];
      
      return {
        title: titleLine,
        suggestions: suggestions,
      };
    } catch (error) {
      console.error('Ollama API error:', error);
      throw error;
    }
  },

  async generateDescription(title: string, params: Record<string, any>, currentDescription?: string): Promise<string> {
    const paramsText = Object.entries(params)
      .filter(([_, value]) => value)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');

    const prompt = currentDescription 
      ? `Улучши описание: "${currentDescription}" для ${title} (${paramsText}). Напиши кратко, по-русски, продающе, как в примере:
Продаю свой MacBook Pro 16" (2021) на чипе M1 Pro. Состояние отличное, работал бережно. Мощности хватает на всё: от сложного монтажа до кода, при этом ноутбук почти не греется.

Только описание, без лишнего текста.`
      
      : `Напиши описание для ${title} (${paramsText}). Кратко, по-русски, продающе. Пример:
"Продаю свой MacBook Pro 16" (2021) на чипе M1 Pro. Состояние отличное, работал бережно. Мощности хватает на всё.

Только описание.`;

    try {
      const res = await axios.post(`${config.ollamaUrl}/api/generate`, {
        model: config.aiModel,
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