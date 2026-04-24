import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './shippingPriceForm.module.scss';
import { InputField } from '@/components/form/inputField/InputField';
import { SelectField } from '@/components/form/selectField/SelectField';
import { Button } from '@/components/ui/button/Button';
import {
    createShippingPrice,
    updateShippingPrice,
} from '@/modules/admin/services/shippingPrices.service';
import { getCatalogItems } from '@/modules/admin/services/catalog.service';
import { useToast } from '@/context/ToastContext';
import { SHIPPING_COUNTRIES } from '../constants/shippingPriceConstants';

const STATUS_OPTIONS = [
    { value: 'active', label: 'Activo' },
    { value: 'inactive', label: 'Inactivo' },
];

export const ShippingPriceForm = ({ onSuccess, initialData }) => {
    const [form, setForm] = useState({
        catalog_id: '',
        country_code: 'ALL',
        price_usd: '',
        status: 'active',
    });
    const [catalogOptions, setCatalogOptions] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingCatalog, setLoadingCatalog] = useState(true);
    const { showToast } = useToast();

    // Cargar catálogo de productos para el select
    useEffect(() => {
        let mounted = true;
        const loadCatalog = async () => {
            try {
                const response = await getCatalogItems(1, 200);
                const items = response?.data?.data || [];
                if (!mounted) return;
                setCatalogOptions(
                    items.map((it) => ({
                        value: String(it.id),
                        label: `${it.id} · ${it.name}`,
                    }))
                );
            } catch (e) {
                if (mounted) showToast('No se pudo cargar el catálogo de productos', 'error', 'Error');
            } finally {
                if (mounted) setLoadingCatalog(false);
            }
        };
        loadCatalog();
        return () => {
            mounted = false;
        };
    }, [showToast]);

    useEffect(() => {
        if (initialData) {
            setForm({
                id: initialData.id || undefined,
                catalog_id: initialData.catalog_id ? String(initialData.catalog_id) : '',
                country_code: initialData.country_code || 'ALL',
                price_usd: initialData.price_usd != null ? String(initialData.price_usd) : '',
                status: initialData.status || 'active',
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const newErrors = {};
        if (!form.catalog_id) newErrors.catalog_id = 'Selecciona un producto';
        if (!form.country_code) newErrors.country_code = 'Selecciona un país';
        if (form.price_usd === '' || form.price_usd === null) {
            newErrors.price_usd = 'El precio es requerido';
        } else if (isNaN(form.price_usd) || Number(form.price_usd) < 0) {
            newErrors.price_usd = 'Debe ser un número mayor o igual a 0';
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setLoading(true);
        try {
            const submitData = {
                catalog_id: Number(form.catalog_id),
                country_code: form.country_code,
                price_usd: Number(form.price_usd),
                status: form.status,
            };

            if (form.id) {
                await updateShippingPrice(form.id, submitData);
            } else {
                await createShippingPrice(submitData);
                setForm({ catalog_id: '', country_code: 'ALL', price_usd: '', status: 'active' });
            }
            setErrors({});
            if (onSuccess) onSuccess();
        } catch (error) {
            let message = 'Error al guardar el precio de envío';
            const fieldErrors = {};
            if (error?.response?.data) {
                const data = error.response.data;
                if (data.message) message = data.message;
                if (data.errors) {
                    Object.entries(data.errors).forEach(([field, msgs]) => {
                        fieldErrors[field] = Array.isArray(msgs) ? msgs[0] : msgs;
                    });
                }
            }
            setErrors(fieldErrors);
            showToast(message, 'error', 'Error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate className={styles.formContainer}>
            <div className={styles.formGroup}>
                <SelectField
                    label="Producto"
                    id="catalog_id"
                    name="catalog_id"
                    value={form.catalog_id}
                    onChange={handleChange}
                    isRequired
                    error={errors.catalog_id}
                    placeholder={loadingCatalog ? 'Cargando productos...' : 'Selecciona un producto'}
                    options={catalogOptions}
                    disabled={loadingCatalog}
                    size="md"
                />
                <SelectField
                    label="País"
                    id="country_code"
                    name="country_code"
                    value={form.country_code}
                    onChange={handleChange}
                    isRequired
                    error={errors.country_code}
                    options={SHIPPING_COUNTRIES}
                    size="md"
                />
            </div>
            <div className={styles.formGroup}>
                <InputField
                    label="Precio de envío (USD)"
                    id="price_usd"
                    name="price_usd"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price_usd}
                    onChange={handleChange}
                    isRequired
                    error={errors.price_usd}
                    placeholder="Ej: 89.00"
                    size="md"
                />
                <SelectField
                    label="Estado"
                    id="status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    options={STATUS_OPTIONS}
                    size="md"
                />
            </div>
            <div className={styles.infoBox}>
                <p>
                    ℹ️ Si seleccionas <strong>Todos los países</strong>, este precio aplicará como
                    fallback cuando no exista una regla específica para el país del cliente.
                </p>
            </div>
            <div className={styles.buttonContainer}>
                <Button type="submit" variant="primary" size="md" isLoading={loading} fullWidth>
                    {form.id ? 'Guardar cambios' : 'Crear precio de envío'}
                </Button>
            </div>
        </form>
    );
};

ShippingPriceForm.propTypes = {
    onSuccess: PropTypes.func,
    initialData: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        catalog_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        country_code: PropTypes.string,
        price_usd: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        status: PropTypes.string,
    }),
};
