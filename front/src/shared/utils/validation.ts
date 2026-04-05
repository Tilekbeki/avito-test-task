export const validateAd = (data) => {
  if (!data.title) throw new Error('Название обязательно');
  if (!data.price) throw new Error('Цена обязательна');
};