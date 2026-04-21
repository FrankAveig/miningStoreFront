export const catalogCategoryAdapterList = (data) => {
    return data.data?.data?.map((category) => {
        const raw = category.show_prices;
        const showPrices =
            raw === undefined || raw === null
                ? true
                : raw === 1 || raw === true || raw === '1';
        return {
            id: category.id,
            name: category.name,
            description: category.description,
            precios_tienda: showPrices ? 'Sí' : 'No',
            status: category.status === 'active' ? 'Activo' : 'Inactivo',
            is_active: category.status === 'active',
        };
    });
};

