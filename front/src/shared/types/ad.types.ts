// shared/types/ad.types.ts
export type Category = 'auto' | 'real_estate' | 'electronics';

export interface Ad {
  id: string;
  category: Category;
  title: string;
  price: number;
  description?: string;
  needsRevision: boolean;
}

// Авто
export type AutoItemParams = {
  brand?: string;
  model?: string;
  yearOfManufacture?: number;
  transmission?: 'automatic' | 'manual';
  mileage?: number;
  enginePower?: number;
};

// Электроника
export type ElectronicsItemParams = {
  type?: 'phone' | 'laptop' | 'misc';
  brand?: string;
  model?: string;
  condition?: 'new' | 'used';
  color?: string;
};

// Недвижимость
export type RealEstateItemParams = {
  type?: 'flat' | 'house' | 'room';
  address?: string;
  area?: number;
  floor?: number;
};

export type ItemParams = AutoItemParams | ElectronicsItemParams | RealEstateItemParams;

export interface Item {
  id: string;
  category: Category;
  title: string;
  description?: string;
  price: number;
  createdAt?: string;
  updatedAt?: string;
  params: ItemParams;
}

export type ItemWithRevision = Item & {
  needsRevision: boolean;
};

export interface GetAdsParams {
  q?: string;
  limit?: number;
  skip?: number;
  needsRevision?: boolean;
  categories?: Category[];
  sortColumn?: 'title' | 'createdAt';
  sortDirection?: 'asc' | 'desc';
}

export interface GetAdsResponse {
  items: Ad[];
  total: number;
}

// 🆕 Конфигурации для UI (теперь на основе типов)
export const PARAM_LABELS: Record<string, string> = {
  brand: 'Бренд',
  model: 'Модель',
  yearOfManufacture: 'Год выпуска',
  transmission: 'Коробка передач',
  mileage: 'Пробег (км)',
  enginePower: 'Мощность двигателя (л.с.)',
  type: 'Тип',
  condition: 'Состояние',
  color: 'Цвет',
  address: 'Адрес',
  area: 'Площадь (м²)',
  floor: 'Этаж',
};

export const ADDITIONAL_LABELS: Record<string, Record<string, string>> = {
  transmission: {
    automatic: 'Автоматическая',
    manual: 'Механическая',
  },
  condition: {
    new: 'Новый',
    used: 'Б/У',
  },
  type: {
    phone: 'Телефон',
    laptop: 'Ноутбук',
    misc: 'Другое',
    flat: 'Квартира',
    house: 'Дом',
    room: 'Комната',
  },
};

// 🆕 Поля для каждой категории (на основе типов)
export const FIELDS_BY_CATEGORY: Record<Category, (keyof ItemParams)[]> = {
  auto: ['brand', 'model', 'yearOfManufacture', 'transmission', 'mileage', 'enginePower'],
  electronics: ['type', 'brand', 'model', 'condition', 'color'],
  real_estate: ['type', 'address', 'area', 'floor'],
};

// 🆕 Вспомогательные функции
export const formatValue = (key: string, value: any): string => {
  if (value === undefined || value === '') return '';
  if (ADDITIONAL_LABELS[key]?.[value]) {
    return ADDITIONAL_LABELS[key][value];
  }
  return String(value);
};

export const getMissingFields = (ad: ItemWithRevision): string[] => {
  const fields = FIELDS_BY_CATEGORY[ad.category] || [];
  
  const missing = fields
    .filter((field) => {
      const value = ad.params?.[field as keyof ItemParams];
      return value === undefined || value === '' || value === null;
    })
    .map((field) => PARAM_LABELS[field as string] || String(field));

  if (!ad.description?.trim()) {
    missing.push('Описание');
  }

  return missing;
};

export const needsAttention = (ad: ItemWithRevision): boolean => {
  return ad.needsRevision || getMissingFields(ad).length > 0;
};