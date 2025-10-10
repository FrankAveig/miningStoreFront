export const electricityPriceAdapterGet = (data) => {
  const price = data?.data?.data;
  return {
    id: price.id,
    price_kwh_usd: price.price_kwh_usd,
    valid_from: price.valid_from ? price.valid_from.split('T')[0] : '',
    valid_to: price.valid_to ? price.valid_to.split('T')[0] : '',
    status: price.status
  };
};

