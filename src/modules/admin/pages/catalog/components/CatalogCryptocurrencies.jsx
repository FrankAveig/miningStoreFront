import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getCatalogCryptocurrencies, addCryptocurrencyToCatalog, removeCryptocurrencyFromCatalog } from '@/modules/admin/services/catalog.service';
import { getCryptocurrencies } from '@/modules/admin/services/cryptocurrencies.service';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/button/Button';
import { Modal, useModal } from '@/components/ui/modal/Modal';
import { ConfirmationModal } from '@/components/data-display/confirmationModal/ConfirmationModal';
import styles from './catalogCryptocurrencies.module.scss';
import { FaTrash, FaPlus } from 'react-icons/fa';

export const CatalogCryptocurrencies = ({ catalogId }) => {
  const [cryptos, setCryptos] = useState([]);
  const [availableCryptos, setAvailableCryptos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [cryptoToRemove, setCryptoToRemove] = useState(null);
  const addModal = useModal(false);
  const { showToast } = useToast();

  useEffect(() => {
    loadCryptocurrencies();
  }, [catalogId]);

  const loadCryptocurrencies = async () => {
    setLoading(true);
    try {
      const [catalogCryptos, allCryptos] = await Promise.all([
        getCatalogCryptocurrencies(catalogId),
        getCryptocurrencies(1, 100)
      ]);
      
      const assigned = catalogCryptos.data?.data || [];
      const all = allCryptos.data?.data || [];
      
      setCryptos(assigned);
      
      // Filtrar las que ya están asignadas
      const assignedIds = assigned.map(c => c.id);
      const available = all.filter(c => !assignedIds.includes(c.id) && c.status === 'active');
      setAvailableCryptos(available);
    } catch (error) {
      showToast('Error al cargar criptomonedas', 'error', 'Error');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!selectedCrypto) {
      showToast('Selecciona una criptomoneda', 'warning', 'Aviso');
      return;
    }
    
    setLoading(true);
    try {
      await addCryptocurrencyToCatalog(catalogId, selectedCrypto);
      showToast('Criptomoneda agregada exitosamente', 'success', '¡Éxito!');
      setSelectedCrypto('');
      addModal.closeModal();
      await loadCryptocurrencies();
    } catch (error) {
      showToast(error.response?.data?.message || 'Error al agregar', 'error', 'Error');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveClick = (crypto) => {
    setCryptoToRemove(crypto);
    setShowConfirmModal(true);
  };

  const handleRemoveConfirm = async () => {
    if (!cryptoToRemove) return;
    
    setLoading(true);
    try {
      await removeCryptocurrencyFromCatalog(catalogId, cryptoToRemove.id);
      showToast('Criptomoneda removida exitosamente', 'success', '¡Éxito!');
      setShowConfirmModal(false);
      setCryptoToRemove(null);
      await loadCryptocurrencies();
    } catch (error) {
      showToast(error.response?.data?.message || 'Error al remover', 'error', 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Criptomonedas Compatible</h3>
        <Button 
          variant="primary" 
          size="sm" 
          onClick={addModal.openModal}
          disabled={availableCryptos.length === 0}
        >
          <FaPlus /> Agregar
        </Button>
      </div>

      {loading && <p>Cargando...</p>}
      
      {!loading && cryptos.length === 0 && (
        <p className={styles.empty}>No hay criptomonedas asignadas</p>
      )}

      {!loading && cryptos.length > 0 && (
        <div className={styles.list}>
          {cryptos.map((crypto) => (
            <div key={crypto.id} className={styles.item}>
              <div className={styles.info}>
                <span className={styles.symbol}>{crypto.symbol}</span>
                <span className={styles.name}>{crypto.name}</span>
                <span className={styles.algorithm}>{crypto.algorithm}</span>
              </div>
              <button
                className={styles.removeBtn}
                onClick={() => handleRemoveClick(crypto)}
                disabled={loading}
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal para agregar */}
      <Modal open={addModal.open} onClose={addModal.closeModal}>
        <Modal.Header onClose={addModal.closeModal}>
          <Modal.Title>Agregar Criptomoneda</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={styles.modalContent}>
            <label className={styles.label}>Selecciona una criptomoneda:</label>
            <select 
              className={styles.select}
              value={selectedCrypto}
              onChange={(e) => setSelectedCrypto(e.target.value)}
            >
              <option value="">-- Seleccionar --</option>
              {availableCryptos.map((crypto) => (
                <option key={crypto.id} value={crypto.id}>
                  {crypto.symbol} - {crypto.name} ({crypto.algorithm})
                </option>
              ))}
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={addModal.closeModal}>
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={handleAdd}
            isLoading={loading}
          >
            Agregar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de confirmación para remover */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setCryptoToRemove(null);
        }}
        onConfirm={handleRemoveConfirm}
        title="Confirmar eliminación"
        message={`¿Estás seguro de que deseas remover "${cryptoToRemove?.name}" de este producto?`}
        confirmText="Remover"
        cancelText="Cancelar"
        type="warning"
        loading={loading}
      />
    </div>
  );
};

CatalogCryptocurrencies.propTypes = {
  catalogId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};

