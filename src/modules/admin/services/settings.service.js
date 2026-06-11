import api from "@/services/interceptors/axiosConfig";

export const getSettings = async () => {
    const response = await api.get('/api/v1/settings');
    return response;
}

export const toggleSetting = async (id) => {
    const response = await api.delete(`/api/v1/settings/${id}`);
    return response;
}

export const updateSettings = async (id, data) => {
    const response = await api.put(`/api/v1/settings/${id}`, data);
    return response;
}

