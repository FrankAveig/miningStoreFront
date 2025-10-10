import { useEffect, useState } from 'react';
import { InputField } from '@/components/form/inputField/InputField';
import { FileDropzone } from '@/components/data-display/fileDropZone/FileDropzone';
import { Button } from '@/components/ui/button/Button';
import styles from './profile.module.scss';
import { useToast } from '@/context/ToastContext';
import { getCompanyMe, updateCompanyMe, updateCompanyLogo } from '@/modules/admin/services/company.service';

export const Profile = () => {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [savingLogo, setSavingLogo] = useState(false);
    const [logoFile, setLogoFile] = useState(null);
    const [form, setForm] = useState({
        name: '',
        slogan: '',
        domain: '',
        // billing fields
        billing_business_name: '',
        billing_ruc: '',
        billing_address: '',
        billing_phone: '',
        billing_email: ''
    });
    const [errors, setErrors] = useState({});
    const [company, setCompany] = useState(null);
    const [logoVersion, setLogoVersion] = useState(0);

    useEffect(() => {
        (async () => {
            try {
                const meRes = await getCompanyMe();
                const c = meRes?.data?.data || null;
                setCompany(c);
                setForm({
                    name: c?.name || '',
                    slogan: c?.slogan || '',
                    domain: c?.domain || '',
                    billing_business_name: c?.billing?.business_name || '',
                    billing_ruc: c?.billing?.ruc || '',
                    billing_address: c?.billing?.address || '',
                    billing_phone: c?.billing?.phone || '',
                    billing_email: c?.billing?.email || ''
                });
            } catch {
                showToast('No se pudo cargar el perfil', 'error', 'Error');
            }
        })();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const v = {};
        if (!form.name.trim()) v.name = 'El nombre es requerido';
        // billing validations (opcionales: si backend los requiere, marcarlos)
        if (!form.billing_business_name?.trim()) v.billing_business_name = 'La razón social es requerida';
        if (!form.billing_ruc?.trim()) v.billing_ruc = 'El RUC es requerido';
        if (!form.billing_address?.trim()) v.billing_address = 'La dirección es requerida';
        if (!form.billing_phone?.trim()) v.billing_phone = 'El teléfono es requerido';
        if (!form.billing_email?.trim()) v.billing_email = 'El correo de facturación es requerido';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.billing_email)) v.billing_email = 'El correo de facturación no es válido';
        return v;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const v = validate();
        if (Object.keys(v).length) { setErrors(v); return; }
        setLoading(true);
        try {
            await updateCompanyMe({
                name: form.name.trim(),
                slogan: form.slogan || '',
                domain: form.domain || '',
                billing: {
                    business_name: form.billing_business_name || '',
                    ruc: form.billing_ruc || '',
                    address: form.billing_address || '',
                    phone: form.billing_phone || '',
                    email: form.billing_email || ''
                }
            });
            // Refrescar empresa
            try {
                const me = await getCompanyMe();
                const nextCompany = me?.data?.data || null;
                setCompany(nextCompany);
                setLogoVersion(prev => prev + 1);
            } catch (e) {
                void e;
            }
            showToast('Perfil actualizado correctamente', 'success', '¡Éxito!');
        } catch (e) {
            showToast(e?.response?.data?.message || 'No se pudo actualizar', 'error', 'Error');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveLogo = async () => {
        if (!logoFile) {
            showToast('Seleccione un logo', 'warning', 'Aviso');
            return;
        }
        setSavingLogo(true);
        try {
            const res = await updateCompanyLogo(logoFile);
            const updatedLogoUrl = res?.data?.data?.company_logo || res?.data?.data?.logo || null;

            // Actualización optimista inmediata
            if (updatedLogoUrl) {
                const optimisticCompany = { ...(company || {}), company_logo: updatedLogoUrl };
                setCompany(optimisticCompany);
                setLogoVersion(prev => prev + 1);
            }

            // Refrescar empresa (incluye nueva URL de logo)
            try {
                const me = await getCompanyMe();
                const nextCompany = me?.data?.data || null;
                setCompany(nextCompany);
                setLogoVersion(prev => prev + 1);
            } catch (e) {
                void e;
            }
            showToast('Logo actualizado', 'success', '¡Éxito!');
            setLogoFile(null);
        } catch (e) {
            showToast(e?.response?.data?.message || 'No se pudo actualizar el logo', 'error', 'Error');
        } finally {
            setSavingLogo(false);
        }
    };

    return (
        <div>
         
            <h2>Perfil de empresa</h2>
            <div className="wrapperTableIndex">
                <form onSubmit={handleSubmit} noValidate className={styles.profileForm}>
                    {/* Encabezado con logo actual y carga/recorte */}
                    <div className={styles.headerRow}>
                        <div className={styles.currentLogo}>
                            <div className={styles.sectionTitle}>Logo actual</div>
                            {company?.company_logo ? (
                                <img src={`${company.company_logo}?v=${logoVersion}`} alt="Logo" className={styles.logoImage} />
                            ) : (
                                <span className={styles.logoPlaceholder}>Sin logo</span>
                            )}
                        </div>
                        <div className={styles.logoUpdate}>
                            <div className={styles.sectionTitle} style={{ marginBottom: 8 }}>Actualizar logo</div>
                            <FileDropzone
                                label={company?.company_logo ? 'Cambiar logo (PNG, JPG)' : 'Sube o arrastra el logo'}
                                accept={'.png,.jpg,.jpeg'}
                                value={logoFile}
                                onChange={setLogoFile}
                                enableCropper
                            />
                            <div className={styles.logoActions}>
                                <Button type="button" variant="secondary" size="sm" onClick={() => setLogoFile(null)} disabled={!logoFile}>Limpiar</Button>
                                <Button type="button" variant="primary" size="sm" onClick={handleSaveLogo} isLoading={savingLogo} disabled={!logoFile}>Guardar logo</Button>
                            </div>
                        </div>
                    </div>

                    {/* Formulario de datos generales */}
                    <div className={styles.fieldsGrid}>
                    <div className={styles.formGroup}>

                        <InputField
                            label="Nombre"
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            isRequired
                            error={errors.name}
                            placeholder="Nombre de la empresa"
                            size="md"
                        />
                        <InputField
                            label="Slogan"
                            id="slogan"
                            name="slogan"
                            value={form.slogan}
                            onChange={handleChange}
                            placeholder="Slogan"
                            size="md"
                        />
                        </div>
                        <div className={styles.formGroup}>
                        <InputField
                            label="Dominio"
                            id="domain"
                            name="domain"
                            value={form.domain}
                            onChange={handleChange}
                            placeholder="midominio.com"
                            size="md"
                        />
                        </div>
                    </div>

                    {/* Datos de facturación */}
                    <div className={styles.fieldsGrid}>
                        <div className={styles.sectionTitle}>Datos de facturación</div>
                        <div className={styles.formGroup}>
                        <InputField
                            label="Razón social"
                            id="billing_business_name"
                            name="billing_business_name"
                            value={form.billing_business_name}
                            onChange={handleChange}
                            isRequired
                            error={errors.billing_business_name}
                            placeholder="Ej: T&G Consultora S.A."
                            size="md"
                        />
                        <InputField
                            label="RUC"
                            id="billing_ruc"
                            name="billing_ruc"
                            value={form.billing_ruc}
                            onChange={handleChange}
                            isRequired
                            error={errors.billing_ruc}
                            placeholder="Ej: 1790012345001"
                            size="md"
                        />
                        </div>
                        <div className={styles.formGroup}>
                        <InputField
                            label="Dirección de facturación"
                            id="billing_address"
                            name="billing_address"
                            value={form.billing_address}
                            onChange={handleChange}
                            isRequired
                            error={errors.billing_address}
                            placeholder="Ej: Av. Amazonas N34-111 y Colón, Quito"
                            size="md"
                        />
                        <InputField
                            label="Teléfono de facturación"
                            id="billing_phone"
                            name="billing_phone"
                            value={form.billing_phone}
                            onChange={handleChange}
                            isRequired
                            error={errors.billing_phone}
                            placeholder="Ej: +593 2 600 0000"
                            size="md"
                        />
                        </div>
                        <div className={styles.formGroup}>
                        <InputField
                            label="Correo de facturación"
                            id="billing_email"
                            name="billing_email"
                            type="email"
                            value={form.billing_email}
                            onChange={handleChange}
                            isRequired
                            error={errors.billing_email}
                            placeholder="Ej: facturacion@tgconsultora.com"
                            size="md"
                        />
                        </div>
                    </div>

                    <div className={styles.submitRow}>
                        <Button type="submit" variant="primary" size="md" isLoading={loading}>Guardar cambios</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};


