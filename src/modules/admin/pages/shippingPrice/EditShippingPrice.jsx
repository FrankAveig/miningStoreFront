import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getShippingPrice } from '@/modules/admin/services/shippingPrices.service';
import { shippingPriceAdapterGet } from '@/modules/admin/pages/shippingPrice/adapters/shippingPrice.adapter.get';
import { ShippingPriceForm } from '@/modules/admin/pages/shippingPrice/components/ShippingPriceForm';
import { BreadCrumb } from '@/components/data-display/breadCrumb/BreadCrumb';
import { FaRegListAlt } from 'react-icons/fa';
import { useToast } from '@/context/ToastContext';
import { FormSkeleton } from '../../../../components/form/FormSkeleton';

export const EditShippingPrice = () => {
    const { id } = useParams();
    const [price, setPrice] = useState(null);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPrice = async () => {
            setLoading(true);
            try {
                const response = await getShippingPrice(id);
                setPrice(shippingPriceAdapterGet(response));
            } catch (error) {
                showToast(
                    error.response?.data?.message || 'Error al cargar el precio de envío',
                    'error',
                    'Error'
                );
                navigate('/admin/precios-envio');
            } finally {
                setLoading(false);
            }
        };
        fetchPrice();
    }, [id, showToast, navigate]);

    const handleSuccess = () => {
        showToast('Precio de envío editado exitosamente.', 'success', '¡Éxito!');
        setTimeout(() => {
            navigate('/admin/precios-envio');
        }, 200);
    };

    return (
        <div>
            <BreadCrumb
                items={[
                    {
                        label: 'Precios de Envío',
                        to: '/admin/precios-envio',
                        icon: <FaRegListAlt />,
                    },
                    { label: 'Editar precio de envío' },
                ]}
            />
            <h2>Editar precio de envío</h2>
            {loading ? (
                <FormSkeleton />
            ) : price ? (
                <ShippingPriceForm initialData={price} onSuccess={handleSuccess} />
            ) : null}
        </div>
    );
};
