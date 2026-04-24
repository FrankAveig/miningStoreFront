import api from "@/services/interceptors/axiosConfig";

export const getShippingPrices = async (page, limit) => {
    const response = await api.get(`/api/v1/shipping-prices?page=${page}&limit=${limit}`);
    return response;
}

export const getShippingPrice = async (id) => {
    const response = await api.get(`/api/v1/shipping-prices/${id}`);
    return response;
}

export const createShippingPrice = async (data) => {
    const response = await api.post('/api/v1/shipping-prices', data);
    return response;
}

export const updateShippingPrice = async (id, data) => {
    const response = await api.put(`/api/v1/shipping-prices/${id}`, data);
    return response;
}

// DELETE por defecto = toggle status (active <-> inactive).
export const toggleShippingPriceStatus = async (id) => {
    const response = await api.delete(`/api/v1/shipping-prices/${id}`);
    return response;
}

// DELETE con ?hard=1 = soft-delete real (deleted_at). Quita la fila de la lista.
export const deleteShippingPrice = async (id) => {
    const response = await api.delete(`/api/v1/shipping-prices/${id}?hard=1`);
    return response;
}

// Trae los precios de envio asociados a un producto del catalogo.
export const getShippingPricesByCatalog = async (catalogId) => {
    const response = await api.get(`/api/v1/catalog/${catalogId}/shipping-prices`);
    return response;
}
