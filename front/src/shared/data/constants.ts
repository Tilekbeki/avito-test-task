import type { Category } from '../types/ad.types';

export const categoryOptions = [
  { value: 'electronics', label: 'Электроника' },
  { value: 'auto', label: 'Авто' },
  { value: 'real_estate', label: 'Недвижимость' },
];

export const paramLabels: Record<string, string> = {
  brand: 'Бренд',
  model: 'Модель',
  yearOfManufacture: 'Год выпуска',
  transmission: 'Коробка передач',
  mileage: 'Пробег',
  enginePower: 'Мощность двигателя (л.с.)',
  type: 'Тип',
  condition: 'Состояние',
  color: 'Цвет',
  address: 'Адрес',
  area: 'Площадь (м²)',
  floor: 'Этаж',
};

export const defaultParams = {
  electronics: { type: 'phone', brand: '', model: '', condition: '', color: '' },
  auto: {
    brand: '',
    model: '',
    yearOfManufacture: '',
    transmission: '',
    mileage: '',
    enginePower: '',
  },
  real_estate: { type: 'flat', address: '', area: '', floor: '' },
};

export const requiredFieldsByCategory: Record<Category, string[]> = {
  electronics: ['title', 'price', 'type'],
  auto: ['title', 'price'],
  real_estate: ['title', 'price', 'type'],
};

export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  message?: string;
  custom?: (value: any) => boolean;
}

export const validationRules: Record<Category, Record<string, ValidationRule>> = {
  electronics: {
    brand: {
      maxLength: 50,
      message: 'Бренд не должен превышать 50 символов',
    },
    model: {
      maxLength: 50,
      message: 'Модель не должна превышать 50 символов',
    },
    color: {
      maxLength: 30,
      message: 'Цвет не должен превышать 30 символов',
    },
  },
  auto: {
    brand: {
      minLength: 2,
      maxLength: 50,
      message: 'Бренд должен быть от 2 до 50 символов',
    },
    model: {
      minLength: 1,
      maxLength: 50,
      message: 'Модель должна быть от 1 до 50 символов',
    },
    yearOfManufacture: {
      min: 1900,
      max: new Date().getFullYear(),
      message: `Год выпуска должен быть от 1900 до ${new Date().getFullYear()}`,
    },
    mileage: {
      min: 0,
      max: 1000000,
      message: 'Пробег должен быть от 0 до 1 000 000 км',
    },
    enginePower: {
      min: 1,
      max: 2000,
      message: 'Мощность двигателя должна быть от 1 до 2000 л.с.',
    },
  },
  real_estate: {
    address: {
      minLength: 5,
      maxLength: 200,
      message: 'Адрес должен быть от 5 до 200 символов',
    },
    area: {
      min: 1,
      max: 10000,
      message: 'Площадь должна быть от 1 до 10 000 м²',
    },
    floor: {
      min: 1,
      max: 200,
      message: 'Этаж должен быть от 1 до 200',
    },
  },
};

export const getTypeOptions = (category: Category) => {
  if (category === 'electronics') {
    return [
      { value: 'phone', label: 'Телефон' },
      { value: 'laptop', label: 'Ноутбук' },
      { value: 'misc', label: 'Другое' },
    ];
  }
  if (category === 'real_estate') {
    return [
      { value: 'flat', label: 'Квартира' },
      { value: 'house', label: 'Дом' },
      { value: 'room', label: 'Комната' },
    ];
  }
  return [];
};