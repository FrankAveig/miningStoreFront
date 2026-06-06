export const orderTableColumns = [
    { key: "id", label: "#" },
    { key: "customer", label: "Cliente" },
    { key: "email", label: "Email" },
    { key: "total_items", label: "Items" },
    { key: "payment_status", label: "Pago" },
    { key: "status", label: "Estado" },
    { key: "created_at", label: "Fecha" },
];

export const PAYMENT_STATUS_FILTER_OPTIONS = [
    { value: '', label: 'Todos los pagos' },
    { value: 'pending_payment', label: 'Pago pendiente' },
    { value: 'paid', label: 'Pagado' },
    { value: 'failed', label: 'Fallido' },
    { value: 'refunded', label: 'Reembolsado' },
    { value: 'cancelled', label: 'Cancelado' },
];
