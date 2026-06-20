import api from "@/services/interceptors/axiosConfig";

export const getHeroSlides = async (page, limit) => {
    const response = await api.get(`/api/v1/hero-slides?page=${page}&limit=${limit}&status=all&orderBy=sort_order&orderDir=ASC`);
    return response;
}

export const getHeroSlide = async (id) => {
    const response = await api.get(`/api/v1/hero-slides/${id}`);
    return response;
}

function appendHeroSlideFields(formData, data) {
    if (data.title != null) formData.append('title', data.title);
    formData.append('status', data.status ?? 'active');
    if (data.link_url != null) formData.append('link_url', data.link_url);
    if (data.sort_order != null) formData.append('sort_order', String(data.sort_order));
    if (data.image) formData.append('image', data.image);
    if (data.image_mobile) formData.append('image_mobile', data.image_mobile);
    if (data.remove_image_mobile) formData.append('remove_image_mobile', '1');
}

export const createHeroSlide = async (data) => {
    const formData = new FormData();
    appendHeroSlideFields(formData, data);
    const response = await api.post('/api/v1/hero-slides', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response;
}

export const updateHeroSlide = async (id, data) => {
    const formData = new FormData();
    appendHeroSlideFields(formData, data);
    const response = await api.put(`/api/v1/hero-slides/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response;
}

export const toggleHeroSlideStatus = async (id) => {
    const response = await api.delete(`/api/v1/hero-slides/${id}`);
    return response;
}

export const deleteHeroSlidePermanent = async (id) => {
    const response = await api.delete(`/api/v1/hero-slides/${id}/permanent`);
    return response;
}

export const reorderHeroSlides = async (order) => {
    const response = await api.post('/api/v1/hero-slides/reorder', { order });
    return response;
}
