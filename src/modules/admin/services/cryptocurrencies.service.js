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
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('symbol', data.symbol);
    formData.append('algorithm', data.algorithm);
    formData.append('market_cap_usd', data.market_cap_usd);
    formData.append('status', data.status);
    if (data.image) {
        formData.append('image', data.image);
    }
    
    const response = await api.post('/api/v1/cryptocurrencies', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response;
}

export const updateCryptocurrency = async (id, data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('symbol', data.symbol);
    formData.append('algorithm', data.algorithm);
    formData.append('market_cap_usd', data.market_cap_usd);
    formData.append('status', data.status);
    if (data.image) {
        formData.append('image', data.image);
    }
    
    const response = await api.put(`/api/v1/cryptocurrencies/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response;
}

export const toggleCryptocurrencyStatus = async (id) => {
    const response = await api.delete(`/api/v1/cryptocurrencies/${id}`);
    return response;
}

