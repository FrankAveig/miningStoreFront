export const catalogAdapterGet = (data) => {
  const item = data?.data?.data;
  return {
    id: item.id,
    category_id: item.category_id,
    name: item.name,
    hashrate: item.hashrate,
    hashrate_unit: item.hashrate_unit,
    price_usd: item.price_usd,
    price_clp: item.price_clp,
    algorithm: item.algorithm,
    hosting_available: item.hosting_available === 1,
    power_consumption_w: item.power_consumption_w,
    manufacturer: item.manufacturer,
    model: item.model,
    connection: item.connection,
    dimensions_mm: item.dimensions_mm,
    weight_kg: item.weight_kg,
    noise_db: item.noise_db,
    input_voltage_v: item.input_voltage_v,
    operating_temperature_c: item.operating_temperature_c,
    main_image_url: item.main_image_url,
    image_2_url: item.image_2_url,
    image_3_url: item.image_3_url,
    image_4_url: item.image_4_url,
    status: item.status,
    cryptocurrencies: item.cryptocurrencies || []
  };
};

