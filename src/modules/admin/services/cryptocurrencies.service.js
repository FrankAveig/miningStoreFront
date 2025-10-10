import api from "@/services/interceptors/axiosConfig";

export const getCryptocurrencies = async (page, limit, term = '') => {
    const response = await api.get(`/api/v1/cryptocurrencies?page=${page}&limit=${limit}&term=${term}`);
    return response;
}

export const getCryptocurrency = async (id) => {
    const response = await api.get(`/api/v1/cryptocurrencies/${id}`);
    return response;
}

export const createCryptocurrency = async (data) => {
    const response = await api.post('/api/v1/cryptocurrencies', data);
    return response;
}

export const updateCryptocurrency = async (id, data) => {
    const response = await api.put(`/api/v1/cryptocurrencies/${id}`, data);
    return response;
}

export const toggleCryptocurrencyStatus = async (id) => {
    const response = await api.delete(`/api/v1/cryptocurrencies/${id}`);
    return response;
}

