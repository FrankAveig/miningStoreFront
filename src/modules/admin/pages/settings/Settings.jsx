import { useState, useEffect } from 'react';
import { getSettings, toggleSetting } from '@/modules/admin/services/settings.service';
import { useToast } from '@/context/ToastContext';
import { Switch } from '@/components/ui/switch/Switch';
import styles from './settings.module.scss';

export const Settings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
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
      
      // Actualizar el estado local optimísticamente
      setSettings(prev => ({
        ...prev,
        status: prev.status === 'active' ? 'inactive' : 'active'
      }));
      
      showToast('Configuración actualizada', 'success', '¡Éxito!');
      
      // Recargar para confirmar
      await loadSettings();
    } catch (error) {
      showToast(error.response?.data?.message || 'Error al actualizar', 'error', 'Error');
      // Recargar en caso de error para restaurar el estado correcto
      await loadSettings();
    } finally {
      setToggling(false);
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
          <div className={styles.settingItem}>
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
          </div>

          {/* Aquí se pueden agregar más configuraciones en el futuro */}
        </div>
      </div>
    </div>
  );
};

