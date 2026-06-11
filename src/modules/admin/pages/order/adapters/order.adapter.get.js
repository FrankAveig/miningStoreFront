const STATUS_MAP = {
    pending:   'Pendiente',
    contacted: 'Contactado',
    confirmed: 'Confirmado',
    shipped:   'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
};

const PAYMENT_STATUS_MAP = {
    pending_payment: 'Pago pendiente',
    paid:            'Pagado',
    failed:          'Pago fallido',
    refunded:        'Reembolsado',
    cancelled:       'Pago cancelado',
};

const PAYMENT_PROVIDER_MAP = {
    webpay:      'Webpay',
    mercadopago: 'Mercado Pago',
    manual:      'Manual / WhatsApp',
};

const parseJsonField = (value) => {
    if (value == null || value === '') return null;
    if (typeof value === 'object') return value;
    try {
        return JSON.parse(value);
    } catch {
        return value;
    }
};

export const orderAdapterGet = (data) => {
    const o = data?.data?.data;
    if (!o) return null;

    const currency = (o.currency || 'USD').toUpperCase() === 'CLP' ? 'CLP' : 'USD';

    return {
        id: o.id,
        first_name: o.first_name,
        last_name: o.last_name,
        rut: o.rut,
        email: o.email,
        phone_code: o.phone_code,
        phone: o.phone,
        country: o.country,
        region: o.region || null,
        city: o.city,
        address: o.address,
        comuna: o.comuna || null,
        building: o.building,
        notes: o.notes,
        billing_business_name: o.billing_business_name || null,
        billing_rut: o.billing_rut || null,
        billing_business_activity: o.billing_business_activity || null,
        billing_address: o.billing_address || null,
        billing_comuna: o.billing_comuna || null,
        billing_city: o.billing_city || null,
        billing_phone: o.billing_phone || null,
        billing_email: o.billing_email || null,
        status: o.status,
        status_label: STATUS_MAP[o.status] || o.status,
        admin_notes: o.admin_notes,
        total_items: o.total_items,
        currency,
        payment_provider: o.payment_provider || null,
        payment_provider_label: PAYMENT_PROVIDER_MAP[o.payment_provider] || o.payment_provider || '—',
        payment_status: o.payment_status || null,
        payment_status_label: PAYMENT_STATUS_MAP[o.payment_status] || o.payment_status || '—',
        subtotal_amount: o.subtotal_amount != null ? parseFloat(o.subtotal_amount) : null,
        shipping_amount: o.shipping_amount != null ? parseFloat(o.shipping_amount) : null,
        total_amount: o.total_amount != null ? parseFloat(o.total_amount) : null,
        authorization_code: o.authorization_code || null,
        payment_token: o.payment_token || null,
        payment_type_code: o.payment_type_code || null,
        mp_preference_id: o.mp_preference_id || null,
        mp_payment_id: o.mp_payment_id || null,
        buy_order: o.buy_order || null,
        checkout_token: o.checkout_token || null,
        payment_raw_response: parseJsonField(o.payment_raw_response),
        payment_events: (o.payment_events || []).map((ev) => ({
            id: ev.id,
            event_type: ev.event_type,
            provider: ev.provider,
            payload: parseJsonField(ev.payload),
            created_at: ev.created_at,
        })),
        paid_at: o.paid_at || null,
        created_at: o.created_at,
        updated_at: o.updated_at,
        items: (o.items || []).map(item => {
            const priceUsd = parseFloat(item.price_usd || 0);
            const priceClp = item.price_clp != null && item.price_clp !== ''
                ? parseFloat(item.price_clp)
                : null;
            return {
                id: item.id,
                catalog_id: item.catalog_id,
                product_name: item.product_name,
                quantity: item.quantity,
                price_usd: priceUsd,
                price_clp: priceClp,
                hashrate: item.hashrate,
                hashrate_unit: item.hashrate_unit,
                image_url: item.image_url,
            };
        }),
    };
};
