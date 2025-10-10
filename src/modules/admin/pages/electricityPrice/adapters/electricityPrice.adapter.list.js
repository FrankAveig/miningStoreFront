export const electricityPriceAdapterList = (data) => {
    return data.data?.data?.map((price) => ({
        id: price.id,
        price_kwh_usd: `$${Number(price.price_kwh_usd).toFixed(4)}`,
        valid_from: new Date(price.valid_from).toLocaleDateString('es-ES'),
        valid_to: price.valid_to ? new Date(price.valid_to).toLocaleDateString('es-ES') : 'Indefinido',
        status: price.status === 'active' ? 'Activo' : 'Inactivo',
        is_active: price.status === 'active'
    }))
}

