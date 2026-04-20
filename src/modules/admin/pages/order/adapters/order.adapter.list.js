const STATUS_MAP = {
    pending:   'Pendiente',
    contacted: 'Contactado',
    confirmed: 'Confirmado',
    shipped:   'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
};

/** Dígitos para wa.me (código país + número, sin +) */
function digitsForWhatsApp(phoneCode, phone) {
    const code = String(phoneCode || '').replace(/\D/g, '');
    const local = String(phone || '').replace(/\D/g, '');
    if (!local) return '';
    if (code && local.startsWith(code)) return local;
    return code ? code + local : local;
}

export const orderAdapterList = (data) => {
    return data.data?.data?.map((order) => ({
        id: order.id,
        customer: `${order.first_name} ${order.last_name}`,
        email: order.email,
        phone: `${order.phone_code || ''} ${order.phone}`,
        whatsapp_phone: digitsForWhatsApp(order.phone_code, order.phone),
        country: order.country,
        city: order.city,
        total_items: order.total_items,
        status: STATUS_MAP[order.status] || order.status,
        raw_status: order.status,
        created_at: new Date(order.created_at).toLocaleDateString('es-CL', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit',
        }),
    }));
};
