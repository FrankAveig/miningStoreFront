export const catalogCategoryAdapterGet = (data) => {
  const category = data?.data?.data;
  return {
    id: category.id,
    name: category.name,
    description: category.description,
    status: category.status
  };
};

