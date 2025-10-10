import api from "@/services/interceptors/axiosConfig";

export const getUsers = async (page, limit) => {
    const response = await api.get(`/api/v1/users?page=${page}&limit=${limit}`);
    return response;
}

export const getUser = async (id) => {
    const response = await api.get(`/api/v1/users/${id}`);
    return response;
}

export const createUser = async (data) => {
    const response = await api.post('/api/v1/users', data);
    return response;
}

export const updateUser = async (id, data) => {
    const response = await api.put(`/api/v1/users/${id}`, data);
    return response;
}

export const toggleUserStatus = async (id) => {
    const response = await api.delete(`/api/v1/users/${id}`);
    return response;
}