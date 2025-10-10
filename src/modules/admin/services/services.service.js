import api from "@/services/interceptors/axiosConfig";

export const getServices = async (page, limit, term = '') => {
    const response = await api.get(`/api/v1/services?page=${page}&limit=${limit}&term=${term}`);
    return response;
}

export const getService = async (id) => {
    const response = await api.get(`/api/v1/services/${id}`);
    return response;
}

export const createService = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('status', data.status);
    if (data.image) {
        formData.append('image', data.image);
    }
    
    const response = await api.post('/api/v1/services', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response;
}

export const updateService = async (id, data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('status', data.status);
    if (data.image) {
        formData.append('image', data.image);
    }
    
    const response = await api.put(`/api/v1/services/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response;
}

export const toggleServiceStatus = async (id) => {
    const response = await api.delete(`/api/v1/services/${id}`);
    return response;
}

