// pages/ads/utils/formUtils.ts
import type { ItemUpdateIn, Category } from '../../shared/types/ad.types';
import { requiredFieldsByCategory, validationRules } from '../data/constants';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Валидация конкретного поля
export const validateField = (
  category: Category,
  fieldName: string,
  value: any,
  isRequired?: boolean
): string | null => {
  // Проверка на обязательность
  if (isRequired && (!value || (typeof value === 'string' && !value.trim()))) {
    return 'Это поле обязательно для заполнения';
  }

  // Если поле пустое и необязательное - пропускаем
  if (!value || (typeof value === 'string' && !value.trim())) {
    return null;
  }

  const rules = validationRules[category]?.[fieldName];
  if (!rules) return null;

  // Валидация строк
  if (typeof value === 'string') {
    if (rules.minLength && value.trim().length < rules.minLength) {
      return rules.message || `Минимум ${rules.minLength} символов`;
    }
    if (rules.maxLength && value.trim().length > rules.maxLength) {
      return rules.message || `Максимум ${rules.maxLength} символов`;
    }
    if (rules.pattern && !rules.pattern.test(value)) {
      return rules.message || 'Некорректный формат';
    }
  }

  // Валидация чисел
  if (typeof value === 'number' || !isNaN(Number(value))) {
    const numValue = typeof value === 'number' ? value : Number(value);
    if (rules.min !== undefined && numValue < rules.min) {
      return rules.message || `Минимальное значение: ${rules.min}`;
    }
    if (rules.max !== undefined && numValue > rules.max) {
      return rules.message || `Максимальное значение: ${rules.max}`;
    }
  }

  // Кастомная валидация
  if (rules.custom && !rules.custom(value)) {
    return rules.message || 'Некорректное значение';
  }

  return null;
};

// Полная валидация формы
export const validateAdForm = (formData: ItemUpdateIn): ValidationResult => {
  const errors: Record<string, string> = {};

  // Валидация названия
  if (!formData.title?.trim()) {
    errors.title = 'Название обязательно для заполнения';
  } else if (formData.title.trim().length < 3) {
    errors.title = 'Название должно содержать минимум 3 символа';
  } else if (formData.title.trim().length > 100) {
    errors.title = 'Название не должно превышать 100 символов';
  }

  // Валидация цены
  if (formData.price === undefined || formData.price === null) {
    errors.price = 'Цена обязательна для заполнения';
  } else if (formData.price <= 0) {
    errors.price = 'Цена должна быть больше 0';
  } else if (formData.price > 100000000) {
    errors.price = 'Цена не должна превышать 100 000 000';
  }

  // Валидация описания (опционально)
  if (formData.description && formData.description.length > 1000) {
    errors.description = 'Описание не должно превышать 1000 символов';
  }

  // Валидация обязательных полей из requiredFieldsByCategory
  const requiredFields = requiredFieldsByCategory[formData.category];
  requiredFields.forEach(field => {
    if (field === 'title' || field === 'price') return; // уже проверили
    
    if (field === 'type') {
      if (!formData.params?.type) {
        errors.type = 'Тип обязателен для заполнения';
      }
    }
  });

  // Валидация всех параметров в зависимости от категории
  if (formData.params) {
    Object.keys(formData.params).forEach(key => {
      const value = formData.params[key];
      const isRequired = requiredFields.includes(key);
      const error = validateField(formData.category, key, value, isRequired);
      if (error) {
        errors[key] = error;
      }
    });
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};

export const transformParamsForSubmit = (category: Category, params: any) => {
  const transformed = { ...params };
  
  // Удаляем все пустые строки, null и undefined
  Object.keys(transformed).forEach(key => {
    const value = transformed[key];
    if (value === '' || value === null || value === undefined) {
      delete transformed[key];
    }
  });

  // Преобразование числовых полей
  if (category === 'auto') {
    const numericFields = ['yearOfManufacture', 'mileage', 'enginePower'];
    numericFields.forEach(field => {
      if (transformed[field] !== undefined && transformed[field] !== '') {
        const num = Number(transformed[field]);
        if (!isNaN(num)) {
          transformed[field] = num;
        } else {
          delete transformed[field];
        }
      }
    });
  }

  if (category === 'real_estate') {
    const numericFields = ['area', 'floor'];
    numericFields.forEach(field => {
      if (transformed[field] !== undefined && transformed[field] !== '') {
        const num = Number(transformed[field]);
        if (!isNaN(num)) {
          transformed[field] = num;
        } else {
          delete transformed[field];
        }
      }
    });
  }

  return transformed;
};