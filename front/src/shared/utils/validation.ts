import type { ItemUpdateIn } from '../types/ad.types';

export const validateAd = (data: ItemUpdateIn) => {
  if (!data.title) throw new Error('Название обязательно');
  if (!data.price) throw new Error('Цена обязательна');
};