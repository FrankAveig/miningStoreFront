import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PaginatedTable } from '@/components/data-display/paginatedTable/PaginatedTable';
import {
    getHeroSlides,
    toggleHeroSlideStatus,
    deleteHeroSlidePermanent,
    reorderHeroSlides,
} from '@/modules/admin/services/heroSlides.service';
import { heroSlidesTableColumns } from './constants/heroSlideConstants';
import { heroSlideAdapterList } from './adapters/heroSlide.adapter.list';
import { MdModeEdit, MdDelete, MdArrowUpward, MdArrowDownward } from 'react-icons/md';
import { Switch } from '@/components/ui/switch/Switch';
import { usePaginatedFetch } from '@/hooks/usePaginatedFetch';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/button/Button';
import { ConfirmationModal } from '@/components/data-display/confirmationModal/ConfirmationModal';
import styles from './heroSlides.module.scss';

export const HeroSlides = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [busy, setBusy] = React.useState(false);
    const [modal, setModal] = React.useState({ open: false, mode: null, slide: null });

    const {
        data,
        pagination,
        loading,
        fetchPage,
        setLimit,
        forceRefetch,
    } = usePaginatedFetch(
        async (page, limit) => {
            const response = await getHeroSlides(page, limit);
            return {
                data: heroSlideAdapterList(response),
                pagination: response.data?.pagination,
            };
        },
        {}
    );

    const persistOrder = async (orderedRows) => {
        const order = orderedRows.map((row, index) => ({ id: row.id, sort_order: index }));
        setBusy(true);
        try {
            await reorderHeroSlides(order);
            forceRefetch();
        } catch (error) {
            showToast(error.response?.data?.message || 'No se pudo guardar el orden', 'error', 'Error');
        } finally {
            setBusy(false);
        }
    };

    const moveSlide = (slide, dir) => {
        if (busy || !Array.isArray(data)) return;
        const index = data.findIndex((s) => s.id === slide.id);
        const target = index + dir;
        if (index < 0 || target < 0 || target >= data.length) return;
        const next = [...data];
        [next[index], next[target]] = [next[target], next[index]];
        persistOrder(next);
    };

    const openToggle = (slide) => setModal({ open: true, mode: 'toggle', slide });
    const openDelete = (slide) => setModal({ open: true, mode: 'delete', slide });
    const closeModal = () => setModal({ open: false, mode: null, slide: null });

    const confirmModal = async () => {
        const { mode, slide } = modal;
        if (!slide) return;
        setBusy(true);
        try {
            if (mode === 'delete') {
                await deleteHeroSlidePermanent(slide.id);
                showToast('Slide eliminado exitosamente.', 'success', '¡Éxito!');
            } else {
                await toggleHeroSlideStatus(slide.id);
                showToast(
                    `Slide ${slide.status === 'Activo' ? 'desactivado' : 'activado'} exitosamente.`,
                    'success',
                    '¡Éxito!'
                );
            }
            forceRefetch();
        } catch (error) {
            showToast(error.response?.data?.message || 'Ocurrió un error', 'error', 'Error');
        } finally {
            setBusy(false);
            closeModal();
        }
    };

    const isFirst = (slide) => Array.isArray(data) && data.findIndex((s) => s.id === slide.id) === 0;
    const isLast = (slide) => Array.isArray(data) && data.findIndex((s) => s.id === slide.id) === data.length - 1;

    const actions = [
        {
            render: (item) => (
                <div className={styles.orderButtons}>
                    <button
                        type="button"
                        className={styles.iconBtn}
                        onClick={() => moveSlide(item, -1)}
                        disabled={busy || isFirst(item)}
                        aria-label="Subir"
                        title="Subir"
                    >
                        <MdArrowUpward />
                    </button>
                    <button
                        type="button"
                        className={styles.iconBtn}
                        onClick={() => moveSlide(item, 1)}
                        disabled={busy || isLast(item)}
                        aria-label="Bajar"
                        title="Bajar"
                    >
                        <MdArrowDownward />
                    </button>
                </div>
            ),
        },
        {
            render: (item) => (
                <Switch
                    isChecked={item.is_active}
                    onChange={() => openToggle(item)}
                    disabled={busy}
                    size="medium"
                    color={item.is_active ? 'success' : 'error'}
                />
            ),
        },
        {
            render: (item) =>
                item.is_code ? (
                    <span className={styles.lockedHint} title="Los slides de código no se editan">—</span>
                ) : (
                    <button
                        type="button"
                        className={styles.iconBtn}
                        onClick={() => navigate(`/admin/banners-hero/${item.id}`)}
                        aria-label="Editar"
                        title="Editar"
                    >
                        <MdModeEdit />
                    </button>
                ),
        },
        {
            render: (item) =>
                item.is_code ? null : (
                    <button
                        type="button"
                        className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                        onClick={() => openDelete(item)}
                        disabled={busy}
                        aria-label="Eliminar"
                        title="Eliminar"
                    >
                        <MdDelete />
                    </button>
                ),
        },
    ];

    return (
        <div>
            <h2>Banners del Hero</h2>
            <p className={styles.helpText}>
                Los slides de código (Colaboración y Pool LTC+DOGE) solo se pueden activar/desactivar y reordenar.
                Puedes agregar, editar, eliminar y reordenar slides de imagen.
            </p>
            <div className="wrapperTableIndex">
                <div className={styles.filterBarContainer}>
                    <Button variant="primary" size="md" onClick={() => navigate('/admin/nuevo-banner-hero')}>
                        Nuevo slide de imagen
                    </Button>
                </div>
                <PaginatedTable
                    dataToPresent={data}
                    columns={heroSlidesTableColumns}
                    pagination={pagination}
                    onPageChange={fetchPage}
                    onLimitChange={setLimit}
                    actions={actions}
                    loading={loading}
                />
            </div>
            <ConfirmationModal
                isOpen={modal.open}
                onClose={closeModal}
                onConfirm={confirmModal}
                title={modal.mode === 'delete' ? 'Eliminar slide' : 'Confirmar cambio de estado'}
                message={
                    modal.mode === 'delete'
                        ? `¿Seguro que deseas eliminar permanentemente el slide "${modal.slide?.title}"? Esta acción no se puede deshacer.`
                        : `¿Estás seguro de que deseas ${modal.slide?.status === 'Activo' ? 'desactivar' : 'activar'} este slide?`
                }
                confirmText={modal.mode === 'delete' ? 'Eliminar' : modal.slide?.status === 'Activo' ? 'Desactivar' : 'Activar'}
                cancelText="Cancelar"
                type={modal.mode === 'delete' ? 'danger' : 'warning'}
                loading={busy}
            />
        </div>
    );
};
