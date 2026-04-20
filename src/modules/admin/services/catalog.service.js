import api from "@/services/interceptors/axiosConfig";

export const getCatalogItems = async (page, limit, term = '', categoryId = '', algorithm = '') => {
    const response = await api.get(`/api/v1/catalog?page=${page}&limit=${limit}&term=${term}&categoryId=${categoryId}&algorithm=${algorithm}`);
    return response;
}

export const getCatalogItem = async (id) => {
    const response = await api.get(`/api/v1/catalog/${id}`);
    return response;
}

export const createCatalogItem = async (data) => {
    const formData = new FormData();
    
    // Campos básicos
    formData.append('name', data.name);
    formData.append('hashrate', data.hashrate);
    formData.append('hashrate_unit', data.hashrate_unit);
    formData.append('algorithm', data.algorithm);
    formData.append('power_consumption_w', data.power_consumption_w);
    formData.append('price_usd', data.price_usd);
    formData.append('price_clp', data.price_clp);
    formData.append('manufacturer', data.manufacturer);
    formData.append('model', data.model);
    formData.append('hosting_available', data.hosting_available ? 1 : 0);
    formData.append('category_id', data.category_id);
    formData.append('connection', data.connection);
    formData.append('dimensions_mm', data.dimensions_mm);
    formData.append('weight_kg', data.weight_kg);
    formData.append('noise_db', data.noise_db);
    formData.append('input_voltage_v', data.input_voltage_v);
    formData.append('operating_temperature_c', data.operating_temperature_c);
    formData.append('status', data.status);
    
    // Imágenes (hasta 4)
    if (data.images && data.images.length > 0) {
        data.images.forEach((image) => {
            if (image) {
                formData.append('images', image);
            }
        });
    }
    
    const response = await api.post('/api/v1/catalog', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response;
}

export const updateCatalogItem = async (id, data) => {
    const formData = new FormData();
    
    // Campos básicos
    formData.append('name', data.name);
    formData.append('hashrate', data.hashrate);
    formData.append('hashrate_unit', data.hashrate_unit);
    formData.append('algorithm', data.algorithm);
    formData.append('power_consumption_w', data.power_consumption_w);
    formData.append('price_usd', data.price_usd);
    formData.append('price_clp', data.price_clp);
    formData.append('manufacturer', data.manufacturer);
    formData.append('model', data.model);
    formData.append('hosting_available', data.hosting_available ? 1 : 0);
    formData.append('category_id', data.category_id);
    formData.append('connection', data.connection);
    formData.append('dimensions_mm', data.dimensions_mm);
    formData.append('weight_kg', data.weight_kg);
    formData.append('noise_db', data.noise_db);
    formData.append('input_voltage_v', data.input_voltage_v);
    formData.append('operating_temperature_c', data.operating_temperature_c);
    formData.append('status', data.status);
    
    // Imágenes (solo las nuevas)
    if (data.images && data.images.length > 0) {
        data.images.forEach((image) => {
            if (image) {
                formData.append('images', image);
            }
        });
    }
    
    const response = await api.put(`/api/v1/catalog/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response;
}

export const toggleCatalogItemStatus = async (id) => {
    const response = await api.delete(`/api/v1/catalog/${id}`);
    return response;
}

// Cryptocurrencies relacionadas
export const getCatalogCryptocurrencies = async (catalogId) => {
    const response = await api.get(`/api/v1/catalog/${catalogId}/cryptocurrencies`);
    return response;
}

export const addCryptocurrencyToCatalog = async (catalogId, cryptocurrencyId) => {
    const response = await api.post(`/api/v1/catalog/${catalogId}/cryptocurrencies`, {
        cryptocurrency_id: cryptocurrencyId
    });
    return response;
}

export const removeCryptocurrencyFromCatalog = async (catalogId, cryptocurrencyId) => {
    const response = await api.delete(`/api/v1/catalog/${catalogId}/cryptocurrencies/${cryptocurrencyId}`);
    return response;
}

