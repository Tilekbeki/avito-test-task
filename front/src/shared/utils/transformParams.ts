import type { ItemUpdateIn } from '../types/ad.types';

export const transformParams = (formData: ItemUpdateIn) => {
  const params = { ...formData.params } as any;

  if (formData.category === 'auto') {
    params.yearOfManufacture = Number(params.yearOfManufacture);
  }

  return params;
};