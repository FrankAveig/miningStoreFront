export const catalogCategoryAdapterGet = (data) => {
  const category = data?.data?.data;
  const raw = category?.show_prices;
  const showPrices =
    raw === undefined || raw === null
      ? true
      : raw === 1 || raw === true || raw === '1';
  return {
    id: category.id,
    name: category.name,
    description: category.description,
    status: category.status,
    show_prices: showPrices,
  };
};

