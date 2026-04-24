/**
 * Países soportados para precios de envío (ISO + nombre en español).
 * 'ALL' = aplica a todos los países (fallback global del producto).
 *
 * La lista refleja los mismos países que aparecen en el selector de
 * envío del checkout (v1/js/cart-modal.js → AMERICAS_COUNTRIES_ES).
 */
export const SHIPPING_COUNTRIES = [
    { value: 'ALL', label: 'Todos los países' },
    { value: 'AG', label: 'Antigua y Barbuda' },
    { value: 'AR', label: 'Argentina' },
    { value: 'BS', label: 'Bahamas' },
    { value: 'BB', label: 'Barbados' },
    { value: 'BZ', label: 'Belice' },
    { value: 'BO', label: 'Bolivia' },
    { value: 'BR', label: 'Brasil' },
    { value: 'CA', label: 'Canadá' },
    { value: 'CL', label: 'Chile' },
    { value: 'CO', label: 'Colombia' },
    { value: 'CR', label: 'Costa Rica' },
    { value: 'CU', label: 'Cuba' },
    { value: 'DM', label: 'Dominica' },
    { value: 'EC', label: 'Ecuador' },
    { value: 'SV', label: 'El Salvador' },
    { value: 'US', label: 'Estados Unidos' },
    { value: 'GD', label: 'Granada' },
    { value: 'GT', label: 'Guatemala' },
    { value: 'GY', label: 'Guyana' },
    { value: 'GF', label: 'Guyana Francesa' },
    { value: 'HT', label: 'Haití' },
    { value: 'HN', label: 'Honduras' },
    { value: 'JM', label: 'Jamaica' },
    { value: 'MX', label: 'México' },
    { value: 'NI', label: 'Nicaragua' },
    { value: 'PA', label: 'Panamá' },
    { value: 'PY', label: 'Paraguay' },
    { value: 'PE', label: 'Perú' },
    { value: 'PR', label: 'Puerto Rico' },
    { value: 'DO', label: 'República Dominicana' },
    { value: 'KN', label: 'San Cristóbal y Nieves' },
    { value: 'VC', label: 'San Vicente y las Granadinas' },
    { value: 'LC', label: 'Santa Lucía' },
    { value: 'SR', label: 'Surinam' },
    { value: 'TT', label: 'Trinidad y Tobago' },
    { value: 'UY', label: 'Uruguay' },
    { value: 'VE', label: 'Venezuela' },
];

export const getCountryLabel = (code) => {
    if (!code) return '';
    const found = SHIPPING_COUNTRIES.find((c) => c.value === code);
    return found ? found.label : code;
};
