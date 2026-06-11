import { formatApiDateTime } from '@/utils/dateFormat';
import styles from '../orderDetail.module.scss';

const formatJson = (value) => {
    if (value == null) return '—';
    if (typeof value === 'string') return value;
    try {
        return JSON.stringify(value, null, 2);
    } catch {
        return String(value);
    }
};

const formatEventDate = (d) => formatApiDateTime(d);

const DebugField = ({ label, value }) => {
    if (value == null || value === '') return null;
    return (
        <div className={styles.debugField}>
            <span className={styles.debugFieldLabel}>{label}</span>
            <code className={styles.debugFieldValue}>{String(value)}</code>
        </div>
    );
};

export const PaymentDebugPanel = ({ order }) => {
    const hasIdentifiers =
        order.payment_token ||
        order.buy_order ||
        order.authorization_code ||
        order.payment_type_code ||
        order.mp_preference_id ||
        order.mp_payment_id ||
        order.checkout_token;

    const hasRaw = order.payment_raw_response != null;
    const hasEvents = order.payment_events?.length > 0;
    const hasContent = hasIdentifiers || hasRaw || hasEvents;

    return (
        <details className={styles.paymentDebug}>
            <summary className={styles.paymentDebugSummary}>
                Datos técnicos del pago
                {hasEvents && (
                    <span className={styles.paymentDebugBadge}>
                        {order.payment_events.length} evento{order.payment_events.length !== 1 ? 's' : ''}
                    </span>
                )}
            </summary>

            <div className={styles.paymentDebugBody}>
                {!hasContent && (
                    <p className={styles.paymentDebugEmpty}>
                        Sin datos de pago registrados para este pedido.
                    </p>
                )}

                {hasIdentifiers && (
                    <section className={styles.paymentDebugSection}>
                        <h4 className={styles.paymentDebugSectionTitle}>Identificadores</h4>
                        <DebugField label="Proveedor" value={order.payment_provider} />
                        <DebugField label="Estado pago" value={order.payment_status} />
                        <DebugField label="Token Webpay (token_ws)" value={order.payment_token} />
                        <DebugField label="Buy order" value={order.buy_order} />
                        <DebugField label="Código autorización" value={order.authorization_code} />
                        <DebugField label="Tipo de pago" value={order.payment_type_code} />
                        <DebugField label="Preference ID (MP)" value={order.mp_preference_id} />
                        <DebugField label="Payment ID (MP)" value={order.mp_payment_id} />
                        <DebugField label="Checkout token" value={order.checkout_token} />
                    </section>
                )}

                {hasRaw && (
                    <section className={styles.paymentDebugSection}>
                        <h4 className={styles.paymentDebugSectionTitle}>
                            Respuesta de la plataforma
                        </h4>
                        <pre className={styles.paymentDebugPre}>
                            {formatJson(order.payment_raw_response)}
                        </pre>
                    </section>
                )}

                {hasEvents && (
                    <section className={styles.paymentDebugSection}>
                        <h4 className={styles.paymentDebugSectionTitle}>
                            Historial de eventos
                        </h4>
                        <ul className={styles.paymentDebugEventList}>
                            {order.payment_events.map((ev) => (
                                <li key={ev.id ?? `${ev.event_type}-${ev.created_at}`}>
                                    <details className={styles.paymentDebugEvent}>
                                        <summary className={styles.paymentDebugEventSummary}>
                                            <span className={styles.paymentDebugEventMeta}>
                                                {formatEventDate(ev.created_at)}
                                            </span>
                                            <span className={styles.paymentDebugEventType}>
                                                {ev.event_type}
                                            </span>
                                            <span className={styles.paymentDebugEventProvider}>
                                                {ev.provider}
                                            </span>
                                        </summary>
                                        {ev.payload != null && (
                                            <pre className={styles.paymentDebugPre}>
                                                {formatJson(ev.payload)}
                                            </pre>
                                        )}
                                    </details>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>
        </details>
    );
};
