import api from "@/services/interceptors/axiosConfig";

export const getServices = async (page, limit, term = '') => {
    const response = await api.get(`/api/v1/services?page=${page}&limit=${limit}&term=${term}&status=all`);
    return response;
}

export const getService = async (id) => {
    const response = await api.get(`/api/v1/services/${id}`);
    return response;
}

function appendServiceFields(formData, data) {
    formData.append('name', data.name ?? '');
    formData.append('description', data.description ?? '');
    formData.append('status', data.status ?? 'active');
    if (data.card_theme) formData.append('card_theme', data.card_theme);
    if (data.link_url != null) formData.append('link_url', data.link_url);
    if (data.sort_order != null) formData.append('sort_order', String(data.sort_order));
    if (data.image) formData.append('image', data.image);
    if (Array.isArray(data.features)) {
        formData.append('features', JSON.stringify(data.features));
    }
}

export const createService = async (data) => {
    const formData = new FormData();
    appendServiceFields(formData, data);
    const response = await api.post('/api/v1/services', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response;
}

export const updateService = async (id, data) => {
    const formData = new FormData();
    appendServiceFields(formData, data);
    const response = await api.put(`/api/v1/services/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response;
}

export const toggleServiceStatus = async (id) => {
    const response = await api.delete(`/api/v1/services/${id}`);
    return response;
}

// Endpoints individuales para features (uso opcional desde otras pantallas)
export const getServiceFeatures = async (serviceId) => {
    const response = await api.get(`/api/v1/services/${serviceId}/features`);
    return response;
}

export const createServiceFeature = async (serviceId, data) => {
    const response = await api.post(`/api/v1/services/${serviceId}/features`, data);
    return response;
}

export const updateServiceFeature = async (serviceId, featureId, data) => {
    const response = await api.put(`/api/v1/services/${serviceId}/features/${featureId}`, data);
    return response;
}

export const deleteServiceFeature = async (serviceId, featureId) => {
    const response = await api.delete(`/api/v1/services/${serviceId}/features/${featureId}`);
    return response;
}
