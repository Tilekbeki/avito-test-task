import type { Category } from '../../shared/types/ad.types';

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
  enginePower: 'Мощность двигателя',
  type: 'Тип',
  condition: 'Состояние',
  color: 'Цвет',
  address: 'Адрес',
  area: 'Площадь',
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
