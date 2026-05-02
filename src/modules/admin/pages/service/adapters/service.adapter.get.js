export const serviceAdapterGet = (data) => {
  const service = data?.data?.data;
  if (!service) return null;
  return {
    id: service.id,
    name: service.name,
    description: service.description,
    image_url: service.image_url,
    status: service.status,
    card_theme: service.card_theme || 'purple',
    link_url: service.link_url || '',
    sort_order: Number(service.sort_order || 0),
    features: Array.isArray(service.features)
      ? service.features.map((f, i) => ({
          id: f.id,
          type: f.type,
          label: f.label || '',
          value: f.value || '',
          color: f.color || '',
          sort_order: Number(f.sort_order ?? i),
        }))
      : [],
  };
};
