export const shippingPriceAdapterGet = (data) => {
    const row = data?.data?.data;
    return {
        id: row.id,
        catalog_id: row.catalog_id,
        catalog_name: row.catalog_name || '',
        country_code: row.country_code,
        price_usd: row.price_usd,
        status: row.status,
    };
};
