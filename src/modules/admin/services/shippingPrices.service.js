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

export const toggleShippingPriceStatus = async (id) => {
    const response = await api.delete(`/api/v1/shipping-prices/${id}`);
    return response;
}
