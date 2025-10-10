export const cryptocurrencyAdapterList = (data) => {
    return data.data?.data?.map((crypto) => ({
        id: crypto.id,
        name: crypto.name,
        symbol: crypto.symbol.toUpperCase(),
        algorithm: crypto.algorithm,
        market_cap_usd: crypto.market_cap_usd,
        status: crypto.status === 'active' ? 'Activo' : 'Inactivo',
        is_active: crypto.status === 'active'
    }))
}

