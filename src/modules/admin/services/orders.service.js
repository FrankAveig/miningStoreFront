import api from "@/services/interceptors/axiosConfig";

export const getOrders = async (page = 1, limit = 20, term = '', status = '') => {
    const params = new URLSearchParams({
        page,
        limit,
        ...(term && { term }),
        ...(status && { status })
    });
    const response = await api.get(`/api/v1/orders?${params}`);
    return response;
}

export const getOrder = async (id) => {
    const response = await api.get(`/api/v1/orders/${id}`);
    return response;
}

export const updateOrder = async (id, data) => {
    const response = await api.put(`/api/v1/orders/${id}`, data);
    return response;
}

export const deleteOrder = async (id) => {
    const response = await api.delete(`/api/v1/orders/${id}`);
    return response;
}
