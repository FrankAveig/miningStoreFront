const STATUS_MAP = {
    pending:   'Pendiente',
    contacted: 'Contactado',
    confirmed: 'Confirmado',
    shipped:   'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
};

export const orderAdapterGet = (data) => {
    const o = data?.data?.data;
    if (!o) return null;

    return {
        id: o.id,
        first_name: o.first_name,
        last_name: o.last_name,
        rut: o.rut,
        email: o.email,
        phone_code: o.phone_code,
        phone: o.phone,
        country: o.country,
        city: o.city,
        address: o.address,
        building: o.building,
        notes: o.notes,
        status: o.status,
        status_label: STATUS_MAP[o.status] || o.status,
        admin_notes: o.admin_notes,
        total_items: o.total_items,
        created_at: o.created_at,
        updated_at: o.updated_at,
        items: (o.items || []).map(item => ({
            id: item.id,
            catalog_id: item.catalog_id,
            product_name: item.product_name,
            quantity: item.quantity,
            price_usd: parseFloat(item.price_usd || 0),
            hashrate: item.hashrate,
            hashrate_unit: item.hashrate_unit,
            image_url: item.image_url,
        })),
    };
};
