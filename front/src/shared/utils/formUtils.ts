// pages/ads/utils/formUtils.ts
import type { ItemUpdateIn, Category } from '../../shared/types/ad.types';
import { requiredFieldsByCategory } from '../../pages/AdEditPage/constants';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateAdForm = (formData: ItemUpdateIn): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!formData.title?.trim()) {
    errors.title = 'Название обязательно для заполнения';
  }

  if (!formData.price || formData.price <= 0) {
    errors.price = 'Цена должна быть больше 0';
  }

  const requiredFields = requiredFieldsByCategory[formData.category];
  if (requiredFields.includes('type') && !formData.params?.type) {
    errors.type = 'Тип обязателен для заполнения';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};

export const transformParamsForSubmit = (category: Category, params: any) => {
  const transformed = { ...params };

  if (category === 'auto') {
    if (transformed.yearOfManufacture) {
      transformed.yearOfManufacture = Number(transformed.yearOfManufacture);
    }
    if (transformed.mileage) {
      transformed.mileage = Number(transformed.mileage);
    }
    if (transformed.enginePower) {
      transformed.enginePower = Number(transformed.enginePower);
    }
  }

  if (category === 'real_estate') {
    if (transformed.area) {
      transformed.area = Number(transformed.area);
    }
    if (transformed.floor) {
      transformed.floor = Number(transformed.floor);
    }
  }

  return transformed;
};