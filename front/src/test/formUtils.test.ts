import { describe, it, expect } from 'vitest';
import { validateField, validateAdForm, transformParamsForSubmit } from '../shared/utils/formUtils';
import type { Category, ItemUpdateIn } from '../shared/types/ad.types';

describe('formUtils', () => {
  describe('validateField', () => {
    it('должен возвращать ошибку для обязательного пустого поля', () => {
      const result = validateField('auto', 'brand', '', true);
      expect(result).toBe('Это поле обязательно для заполнения');
    });

    it('должен возвращать null для необязательного пустого поля', () => {
      const result = validateField('auto', 'brand', '', false);
      expect(result).toBeNull();
    });

    it('должен возвращать null для валидного значения', () => {
      const result = validateField('auto', 'brand', 'Toyota', false);
      expect(result).toBeNull();
    });

    it('должен возвращать ошибку для слишком короткой строки', () => {
      // brand minLength = 2, поэтому 'a' (1 символ) должен вызвать ошибку
      const result = validateField('auto', 'brand', 'a', false);
      expect(result).toBe('Бренд должен быть от 2 до 50 символов');
    });
  });

  describe('validateAdForm', () => {
    const createValidFormData = (): ItemUpdateIn => ({
      category: 'auto' as Category,
      title: 'Toyota Camry',
      price: 1500000,
      description: 'Отличный автомобиль',
      params: {
        brand: 'Toyota',
        model: 'Camry',
        yearOfManufacture: 2022,
        transmission: 'automatic',
        mileage: 30000,
        enginePower: 200,
      },
    });

    it('должен возвращать isValid=true для валидной формы', () => {
      const formData = createValidFormData();
      const result = validateAdForm(formData);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors).length).toBe(0);
    });

    it('должен возвращать ошибку для пустого названия', () => {
      const formData = createValidFormData();
      formData.title = '';
      const result = validateAdForm(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBeDefined();
    });

    it('должен возвращать ошибку для названия короче 3 символов', () => {
      const formData = createValidFormData();
      formData.title = 'ab';
      const result = validateAdForm(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBe('Название должно содержать минимум 3 символа');
    });

    it('должен возвращать ошибку для названия длиннее 100 символов', () => {
      const formData = createValidFormData();
      formData.title = 'a'.repeat(101);
      const result = validateAdForm(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBe('Название не должно превышать 100 символов');
    });

    it('должен возвращать ошибку для нулевой цены', () => {
      const formData = createValidFormData();
      formData.price = 0;
      const result = validateAdForm(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors.price).toBe('Цена должна быть больше 0');
    });

    it('должен возвращать ошибку для отрицательной цены', () => {
      const formData = createValidFormData();
      formData.price = -100;
      const result = validateAdForm(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors.price).toBe('Цена должна быть больше 0');
    });

    it('должен возвращать ошибку для слишком большой цены', () => {
      const formData = createValidFormData();
      formData.price = 100000001;
      const result = validateAdForm(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors.price).toBe('Цена не должна превышать 100 000 000');
    });

    it('должен возвращать ошибку для слишком длинного описания', () => {
      const formData = createValidFormData();
      formData.description = 'a'.repeat(1001);
      const result = validateAdForm(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors.description).toBe('Описание не должно превышать 1000 символов');
    });
  });

  describe('transformParamsForSubmit', () => {
    it('должен удалять пустые значения', () => {
      const params = {
        brand: 'Toyota',
        model: '',
        yearOfManufacture: undefined,
      };
      const result = transformParamsForSubmit('auto', params);
      expect(result.brand).toBe('Toyota');
      expect(result.model).toBeUndefined();
      expect(result.yearOfManufacture).toBeUndefined();
    });

    it('должен преобразовывать числовые поля для auto', () => {
      const params = {
        brand: 'Toyota',
        yearOfManufacture: '2022',
        mileage: '50000',
        enginePower: '200',
      };
      const result = transformParamsForSubmit('auto', params);
      expect(result.yearOfManufacture).toBe(2022);
      expect(result.mileage).toBe(50000);
      expect(result.enginePower).toBe(200);
    });

    it('должен преобразовывать числовые поля для real_estate', () => {
      const params = {
        type: 'flat',
        area: '50',
        floor: '5',
      };
      const result = transformParamsForSubmit('real_estate', params);
      expect(result.area).toBe(50);
      expect(result.floor).toBe(5);
    });

    it('должен удалять нечисловые значения для числовых полей', () => {
      const params = {
        yearOfManufacture: 'abc',
      };
      const result = transformParamsForSubmit('auto', params);
      expect(result.yearOfManufacture).toBeUndefined();
    });
  });
});
