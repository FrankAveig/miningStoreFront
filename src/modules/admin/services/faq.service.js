import api from "@/services/interceptors/axiosConfig";

export const getFaqs = async (page = 1, limit = 20, term = '', status = '') => {
    const params = new URLSearchParams({
        page,
        limit,
        ...(term && { term }),
        ...(status && { status })
    });
    const response = await api.get(`/api/v1/faq?${params}`);
    return response;
}

export const getFaq = async (id) => {
    const response = await api.get(`/api/v1/faq/${id}`);
    return response;
}

export const createFaq = async (data) => {
    const response = await api.post('/api/v1/faq', data);
    return response;
}

export const updateFaq = async (id, data) => {
    const response = await api.put(`/api/v1/faq/${id}`, data);
    return response;
}

export const toggleFaqStatus = async (id) => {
    const response = await api.delete(`/api/v1/faq/${id}`);
    return response;
}

