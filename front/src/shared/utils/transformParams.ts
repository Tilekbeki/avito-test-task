export const transformParams = (formData) => {
  const params = { ...formData.params };

  if (formData.category === 'auto') {
    params.yearOfManufacture = Number(params.yearOfManufacture);
  }

  return params;
};