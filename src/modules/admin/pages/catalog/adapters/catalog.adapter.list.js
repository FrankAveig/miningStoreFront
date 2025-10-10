export const catalogAdapterList = (data) => {
    return data.data?.data?.map((item) => ({
        id: item.id,
        name: item.name,
        category_name: item.category_name,
        algorithm: item.algorithm,
        price_usd: `$${Number(item.price_usd).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        hashrate: `${item.hashrate} ${item.hashrate_unit}`,
        main_image_url: item.main_image_url,
        status: item.status === 'active' ? 'Activo' : 'Inactivo',
        is_active: item.status === 'active'
    }))
}

