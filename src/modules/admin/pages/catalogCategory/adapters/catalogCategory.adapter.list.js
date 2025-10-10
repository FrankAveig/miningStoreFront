export const catalogCategoryAdapterList = (data) => {
    return data.data?.data?.map((category) => ({
        id: category.id,
        name: category.name,
        description: category.description,
        status: category.status === 'active' ? 'Activo' : 'Inactivo',
        is_active: category.status === 'active'
    }))
}

