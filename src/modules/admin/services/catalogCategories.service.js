import api from "@/services/interceptors/axiosConfig";

export const getCatalogCategories = async (page, limit, term = '') => {
    const response = await api.get(`/api/v1/catalog-categories?page=${page}&limit=${limit}&term=${term}`);
    return response;
}

export const getCatalogCategory = async (id) => {
    const response = await api.get(`/api/v1/catalog-categories/${id}`);
    return response;
}

export const createCatalogCategory = async (data) => {
    const response = await api.post('/api/v1/catalog-categories', data);
    return response;
}

export const updateCatalogCategory = async (id, data) => {
    const response = await api.put(`/api/v1/catalog-categories/${id}`, data);
    return response;
}

export const toggleCatalogCategoryStatus = async (id) => {
    const response = await api.delete(`/api/v1/catalog-categories/${id}`);
    return response;
}

