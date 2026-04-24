export const shippingPricesTableColumns = [
    { key: "catalog_name", label: "Producto" },
    { key: "country_label", label: "País" },
    { key: "price_usd", label: "Precio USD" },
    { key: "status", label: "Estado" },
];

/**
 * Países soportados (ISO + nombre en español).
 * 'ALL' = aplica a todos los países (fallback global).
 */
export const SHIPPING_COUNTRIES = [
    { value: 'ALL', label: 'Todos los países' },
    { value: 'CL', label: 'Chile' },
    { value: 'AR', label: 'Argentina' },
    { value: 'PE', label: 'Perú' },
    { value: 'MX', label: 'México' },
    { value: 'VE', label: 'Venezuela' },
    { value: 'CO', label: 'Colombia' },
    { value: 'PY', label: 'Paraguay' },
    { value: 'UY', label: 'Uruguay' },
    { value: 'EC', label: 'Ecuador' },
    { value: 'BR', label: 'Brasil' },
    { value: 'BO', label: 'Bolivia' },
    { value: 'SV', label: 'El Salvador' },
];

export const getCountryLabel = (code) => {
    if (!code) return '';
    const found = SHIPPING_COUNTRIES.find((c) => c.value === code);
    return found ? found.label : code;
};
