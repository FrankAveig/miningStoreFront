export const heroSlideAdapterGet = (data) => {
    const slide = data?.data?.data;
    if (!slide) return null;
    return {
        id: slide.id,
        type: slide.type,
        title: slide.title || '',
        image_url: slide.image_url || null,
        image_mobile_url: slide.image_mobile_url || null,
        link_url: slide.link_url || '',
        sort_order: Number(slide.sort_order || 0),
        status: slide.status || 'active',
    };
};
