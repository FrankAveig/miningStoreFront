import { ShippingPriceForm } from '@/modules/admin/pages/shippingPrice/components/ShippingPriceForm';
import { useToast } from '@/context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { BreadCrumb } from '@/components/data-display/breadCrumb/BreadCrumb';
import { FaRegListAlt } from 'react-icons/fa';

export const NewShippingPrice = () => {
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleSuccess = () => {
        showToast('Precio de envío creado exitosamente.', 'success', '¡Éxito!');
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
                    { label: 'Nuevo precio de envío' },
                ]}
            />
            <h2>Nuevo precio de envío</h2>
            <ShippingPriceForm onSuccess={handleSuccess} />
        </div>
    );
};
