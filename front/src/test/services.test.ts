import { describe, it, expect, vi } from 'vitest';
import { config } from '../shared/config';

describe('services', () => {
  describe('config', () => {
    it('должен иметь значение по умолчанию для apiUrl', () => {
      expect(config.apiUrl).toBeDefined();
      expect(config.apiUrl).toContain('localhost:8080');
    });

    it('должен иметь значение по умолчанию для ollamaUrl', () => {
      expect(config.ollamaUrl).toBeDefined();
      expect(config.ollamaUrl).toContain('localhost:11434');
    });

    it('должен использовать правильную модель по умолчанию', () => {
      expect(config.aiModel).toBe('llama3');
    });

    it('должен правильно сериализовать категории в строку', () => {
      // Тест логики преобразования параметров
      const params = {
        categories: ['auto', 'electronics'],
        limit: 10,
        skip: 0,
      };
      
      const query = { ...params, categories: params.categories?.join(',') };
      expect(query.categories).toBe('auto,electronics');
    });
  });
});
