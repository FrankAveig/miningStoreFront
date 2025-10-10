export const serviceAdapterGet = (data) => {
  const service = data?.data?.data;
  return {
    id: service.id,
    name: service.name,
    description: service.description,
    image_url: service.image_url,
    status: service.status
  };
};

