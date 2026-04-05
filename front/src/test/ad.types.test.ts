import { describe, it, expect } from 'vitest';
import { 
  formatValue, 
  getMissingFields, 
  needsAttention,
  PARAM_LABELS,
  ADDITIONAL_LABELS,
  FIELDS_BY_CATEGORY
} from '../shared/types/ad.types';
import type { ItemWithRevision, Category } from '../shared/types/ad.types';

describe('ad.types', () => {
  describe('formatValue', () => {
    it('должен возвращать пустую строку для undefined', () => {
      expect(formatValue('brand', undefined)).toBe('');
    });

    it('должен возвращать пустую строку для пустой строки', () => {
      expect(formatValue('brand', '')).toBe('');
    });

    it('должен возвращать переведенное значение для transmission', () => {
      expect(formatValue('transmission', 'automatic')).toBe('Автоматическая');
      expect(formatValue('transmission', 'manual')).toBe('Механическая');
    });

    it('должен возвращать переведенное значение для condition', () => {
      expect(formatValue('condition', 'new')).toBe('Новый');
      expect(formatValue('condition', 'used')).toBe('Б/У');
    });

    it('должен возвращать переведенное значение для type (electronics)', () => {
      expect(formatValue('type', 'phone')).toBe('Телефон');
      expect(formatValue('type', 'laptop')).toBe('Ноутбук');
      expect(formatValue('type', 'misc')).toBe('Другое');
    });

    it('должен возвращать переведенное значение для type (real_estate)', () => {
      expect(formatValue('type', 'flat')).toBe('Квартира');
      expect(formatValue('type', 'house')).toBe('Дом');
      expect(formatValue('type', 'room')).toBe('Комната');
    });

    it('должен возвращать строку для непереведенных значений', () => {
      expect(formatValue('brand', 'Toyota')).toBe('Toyota');
    });
  });

  describe('getMissingFields', () => {
    const createMockAd = (overrides: Partial<ItemWithRevision> = {}): ItemWithRevision => ({
      id: '1',
      category: 'auto' as Category,
      title: 'Test Car',
      price: 100000,
      params: {},
      needsRevision: false,
      ...overrides,
    });

    it('должен возвращать все поля для пустых параметров', () => {
      const ad = createMockAd({ category: 'auto', params: {} });
      const missing = getMissingFields(ad);
      
      expect(missing).toContain('Бренд');
      expect(missing).toContain('Модель');
    });

    it('должен возвращать description как отсутствующее если его нет', () => {
      const ad = createMockAd({ description: undefined });
      const missing = getMissingFields(ad);
      
      expect(missing).toContain('Описание');
    });

    it('не должен возвращать description если оно есть', () => {
      const ad = createMockAd({ description: 'Some description' });
      const missing = getMissingFields(ad);
      
      expect(missing).not.toContain('Описание');
    });

    it('должен возвращать правильные поля для electronics', () => {
      const ad = createMockAd({ category: 'electronics', params: {} });
      const missing = getMissingFields(ad);
      
      expect(missing).toContain('Тип');
      expect(missing).toContain('Бренд');
    });

    it('должен возвращать правильные поля для real_estate', () => {
      const ad = createMockAd({ category: 'real_estate', params: {} });
      const missing = getMissingFields(ad);
      
      expect(missing).toContain('Тип');
      expect(missing).toContain('Адрес');
    });

    it('должен не возвращать заполненные поля', () => {
      const ad = createMockAd({
        category: 'auto',
        params: {
          brand: 'Toyota',
          model: 'Camry',
          yearOfManufacture: 2020,
        },
        description: 'Test description',
      });
      const missing = getMissingFields(ad);
      
      expect(missing).not.toContain('Бренд');
      expect(missing).not.toContain('Модель');
      expect(missing).not.toContain('Описание');
    });
  });

  describe('needsAttention', () => {
    const createMockAd = (overrides: Partial<ItemWithRevision> = {}): ItemWithRevision => ({
      id: '1',
      category: 'auto' as Category,
      title: 'Test Car',
      price: 100000,
      params: {},
      needsRevision: false,
      ...overrides,
    });

    it('должен возвращать true если needsRevision true', () => {
      const ad = createMockAd({ needsRevision: true });
      expect(needsAttention(ad)).toBe(true);
    });

    it('должен возвращать true если есть missing fields', () => {
      const ad = createMockAd({ params: {} });
      expect(needsAttention(ad)).toBe(true);
    });

    it('должен возвращать false если все заполнено и needsRevision false', () => {
      const ad = createMockAd({
        params: {
          brand: 'Toyota',
          model: 'Camry',
          yearOfManufacture: 2020,
          transmission: 'automatic' as const,
          mileage: 50000,
          enginePower: 200,
        },
        description: 'Description',
        needsRevision: false,
      });
      expect(needsAttention(ad)).toBe(false);
    });
  });

  describe('PARAM_LABELS', () => {
    it('должен содержать все метки для auto', () => {
      const autoFields = FIELDS_BY_CATEGORY.auto;
      autoFields.forEach(field => {
        expect(PARAM_LABELS[field as string]).toBeDefined();
      });
    });

    it('должен содержать все метки для electronics', () => {
      const electronicsFields = FIELDS_BY_CATEGORY.electronics;
      electronicsFields.forEach(field => {
        expect(PARAM_LABELS[field as string]).toBeDefined();
      });
    });

    it('должен содержать все метки для real_estate', () => {
      const realEstateFields = FIELDS_BY_CATEGORY.real_estate;
      realEstateFields.forEach(field => {
        expect(PARAM_LABELS[field as string]).toBeDefined();
      });
    });
  });

  describe('ADDITIONAL_LABELS', () => {
    it('должен иметь правильные значения для transmission', () => {
      expect(ADDITIONAL_LABELS.transmission.automatic).toBe('Автоматическая');
      expect(ADDITIONAL_LABELS.transmission.manual).toBe('Механическая');
    });

    it('должен иметь правильные значения для condition', () => {
      expect(ADDITIONAL_LABELS.condition.new).toBe('Новый');
      expect(ADDITIONAL_LABELS.condition.used).toBe('Б/У');
    });
  });
});
