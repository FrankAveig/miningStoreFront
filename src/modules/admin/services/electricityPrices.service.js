import api from "@/services/interceptors/axiosConfig";

export const getElectricityPrices = async (page, limit) => {
    const response = await api.get(`/api/v1/electricity-prices?page=${page}&limit=${limit}`);
    return response;
}

export const getElectricityPrice = async (id) => {
    const response = await api.get(`/api/v1/electricity-prices/${id}`);
    return response;
}

export const createElectricityPrice = async (data) => {
    const response = await api.post('/api/v1/electricity-prices', data);
    return response;
}

export const updateElectricityPrice = async (id, data) => {
    const response = await api.put(`/api/v1/electricity-prices/${id}`, data);
    return response;
}

export const toggleElectricityPriceStatus = async (id) => {
    const response = await api.delete(`/api/v1/electricity-prices/${id}`);
    return response;
}

