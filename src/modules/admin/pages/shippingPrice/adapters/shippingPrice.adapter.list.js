import { getCountryLabel } from '../constants/shippingPriceConstants';

export const shippingPriceAdapterList = (data) => {
    return data.data?.data?.map((row) => ({
        id: row.id,
        catalog_id: row.catalog_id,
        catalog_name: row.catalog_name || `#${row.catalog_id}`,
        country_code: row.country_code,
        country_label: getCountryLabel(row.country_code),
        price_usd: `$${Number(row.price_usd).toFixed(2)}`,
        status: row.status === 'active' ? 'Activo' : 'Inactivo',
        is_active: row.status === 'active',
    }));
};
