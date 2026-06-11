import { useState, useEffect } from 'react';
import { getSettings, toggleSetting, updateSettings } from '@/modules/admin/services/settings.service';
import { useToast } from '@/context/ToastContext';
import { Switch } from '@/components/ui/switch/Switch';
import { InputField } from '@/components/form/inputField/InputField';
import { Button } from '@/components/ui/button/Button';
import styles from './settings.module.scss';

export const Settings = () => {
  const [settings, setSettings] = useState(null);
  const [usdToClpRate, setUsdToClpRate] = useState('');
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [savingRate, setSavingRate] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const response = await getSettings();
      const data = response.data?.data || [];
      if (data.length > 0) {
        setSettings(data[0]);
        setUsdToClpRate(String(data[0].usd_to_clp_rate ?? 950));
      }
    } catch (error) {
      showToast('Error al cargar configuraciones', 'error', 'Error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async () => {
    if (!settings || toggling) return;

    setToggling(true);
    try {
      await toggleSetting(settings.id);

      setSettings(prev => ({
        ...prev,
        status: prev.status === 'active' ? 'inactive' : 'active'
      }));

      showToast('Configuración actualizada', 'success', '¡Éxito!');
      await loadSettings();
    } catch (error) {
      showToast(error.response?.data?.message || 'Error al actualizar', 'error', 'Error');
      await loadSettings();
    } finally {
      setToggling(false);
    }
  };

  const handleSaveRate = async () => {
    if (!settings || savingRate) return;

    const rate = parseFloat(String(usdToClpRate).replace(',', '.'));
    if (!Number.isFinite(rate) || rate <= 0) {
      showToast('Ingresa un tipo de cambio válido mayor a 0', 'error', 'Error');
      return;
    }

    setSavingRate(true);
    try {
      const response = await updateSettings(settings.id, { usd_to_clp_rate: rate });
      const updated = response.data?.data;
      if (updated) {
        setSettings(updated);
        setUsdToClpRate(String(updated.usd_to_clp_rate ?? rate));
      }
      showToast('Tipo de cambio actualizado', 'success', '¡Éxito!');
    } catch (error) {
      showToast(error.response?.data?.message || 'Error al guardar el tipo de cambio', 'error', 'Error');
      await loadSettings();
    } finally {
      setSavingRate(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h2>Configuraciones de la Página</h2>
        <div className="wrapperTableIndex">
          <p>Cargando configuraciones...</p>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div>
        <h2>Configuraciones de la Página</h2>
        <div className="wrapperTableIndex">
          <p>No se encontraron configuraciones</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2>Configuraciones de la Página</h2>
      <div className="wrapperTableIndex">
        <div className={styles.settingsContainer}>
         {/*  <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <h3 className={styles.settingTitle}>Mostrar precios en el catálogo</h3>
              <p className={styles.settingDescription}>
                Cuando está activo, los precios de los productos serán visibles en el catálogo público.
                {settings.show_catalog_prices === 1 && ' (Configurado para mostrar)'}
                {settings.show_catalog_prices === 0 && ' (Configurado para ocultar)'}
              </p>
            </div>
            <div className={styles.settingControl}>
              <Switch
                isChecked={settings.status === 'active'}
                onChange={() => handleToggle()}
                disabled={toggling}
                size="large"
                color={settings.status === 'active' ? 'success' : 'error'}
              />
              <span className={styles.settingStatus}>
                {settings.status === 'active' ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          </div> */}

          <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <h3 className={styles.settingTitle}>Tipo de cambio USD → CLP</h3>
              <p className={styles.settingDescription}>
                Se usa para convertir pedidos internacionales a pesos chilenos en Webpay,
                correos de confirmación y pantalla de resultado de pago.
              </p>
            </div>
            <div className={styles.settingRateControl}>
              <InputField
                label="1 USD equivale a (CLP)"
                id="usdToClpRate"
                name="usd_to_clp_rate"
                type="number"
                min="1"
                step="1"
                value={usdToClpRate}
                onChange={(e) => setUsdToClpRate(e.target.value)}
                disabled={savingRate}
                size="md"
                className={styles.rateInput}
              />
              <Button
                type="button"
                variant="primary"
                onClick={handleSaveRate}
                isLoading={savingRate}
                disabled={savingRate}
              >
                Guardar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
