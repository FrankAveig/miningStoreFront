export const serviceAdapterList = (data) => {
    return data.data?.data?.map((service) => ({
        id: service.id,
        name: service.name,
        description: service.description,
        image_url: service.image_url,
        status: service.status === 'active' ? 'Activo' : 'Inactivo',
        is_active: service.status === 'active'
    }))
}

