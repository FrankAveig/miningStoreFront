const TYPE_LABELS = {
    collab: 'Colaboración (código)',
    ms_pool: 'Pool LTC+DOGE (código)',
    image: 'Imagen',
};

export const heroSlideAdapterList = (data) => {
    return data.data?.data?.map((slide) => ({
        id: slide.id,
        type: slide.type,
        type_label: TYPE_LABELS[slide.type] || slide.type,
        is_code: slide.type === 'collab' || slide.type === 'ms_pool',
        title: slide.title || '—',
        image_url: slide.image_url || null,
        sort_order: Number(slide.sort_order || 0),
        status: slide.status === 'active' ? 'Activo' : 'Inactivo',
        is_active: slide.status === 'active',
    }));
};
