import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { createPortal } from "react-dom";
import styles from "./modal.module.scss";

/** Hook simple para controlar apertura/cierre del modal */
export function useModal(initialOpen = false) {
  const [open, setOpen] = useState(initialOpen);
  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);
  return { open, openModal, closeModal, setOpen };
}

/** Utilidad: lista de elementos focuseables */
const FOCUSABLE =
  'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])';

/** Modal base */
export function Modal({
  open,
  onClose,
  children,
  closeOnOverlay = true,
  initialFocusRef = null,
  ariaTitleId,
  ariaDescriptionId,
}) {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);

  // Bloquea el scroll del body cuando está abierto
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Cierra con Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Focus inicial + "focus trap"
  useEffect(() => {
    if (!open) return;

    const container = contentRef.current;
    if (!container) return;

    const focusables = Array.from(container.querySelectorAll(FOCUSABLE));
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    // Enfocar
    if (initialFocusRef?.current) {
      initialFocusRef.current.focus();
    } else {
      first?.focus();
    }

    const onKeyDown = (e) => {
      if (e.key !== "Tab" || focusables.length === 0) return;

      // Ciclar tab
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };

    container.addEventListener("keydown", onKeyDown);
    return () => container.removeEventListener("keydown", onKeyDown);
  }, [open, initialFocusRef]);

  // Cerrar haciendo click en el overlay
  const handleOverlayClick = (e) => {
    if (!closeOnOverlay) return;
    if (e.target === overlayRef.current) onClose?.();
  };

  if (!open) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className={styles.overlay}
      onMouseDown={handleOverlayClick}
    >
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaTitleId}
        aria-describedby={ariaDescriptionId}
        className={styles.modal}
        onMouseDown={(e) => {
          // Evita cerrar si haces mousedown dentro y luego sueltas fuera
          e.stopPropagation();
        }}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

/** Subcomponentes de layout para composición */
Modal.Header = function ModalHeader({ children, onClose }) {
  return (
    <div className={styles.header}>
      <div className={styles.headerContent}>{children}</div>
      {onClose && (
        <button
          type="button"
          className={styles.iconButton}
          aria-label="Cerrar"
          onClick={onClose}
        >
          ×
        </button>
      )}
    </div>
  );
};

Modal.Title = function ModalTitle({ children, id }) {
  return (
    <h2 id={id} className={styles.title}>
      {children}
    </h2>
  );
};

Modal.Description = function ModalDescription({ children, id }) {
  return (
    <p id={id} className={styles.description}>
      {children}
    </p>
  );
};

Modal.Body = function ModalBody({ children }) {
  return <div className={styles.body}>{children}</div>;
};

Modal.Footer = function ModalFooter({ children }) {
  return <div className={styles.footer}>{children}</div>;
};

/** Modal de confirmación rápido (opcional) */
export function ConfirmationModal({
  open,
  onCancel,
  onConfirm,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  title = "Confirmación",
  description = "¿Deseas continuar?",
}) {
  const titleId = useMemo(
    () => `modal-title-${Math.random().toString(36).slice(2)}`,
    []
  );
  const descId = useMemo(
    () => `modal-desc-${Math.random().toString(36).slice(2)}`,
    []
  );

  return (
    <Modal
      open={open}
      onClose={onCancel}
      ariaTitleId={titleId}
      ariaDescriptionId={descId}
    >
      <Modal.Header onClose={onCancel}>
        <Modal.Title id={titleId}>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Modal.Description id={descId}>{description}</Modal.Description>
      </Modal.Body>

      <Modal.Footer>
        <button type="button" className={styles.btn} onClick={onCancel}>
          {cancelText}
        </button>
        <button
          type="button"
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={onConfirm}
        >
          {confirmText}
        </button>
      </Modal.Footer>
    </Modal>
  );
}

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  children: PropTypes.node,
  closeOnOverlay: PropTypes.bool,
  initialFocusRef: PropTypes.shape({ current: PropTypes.any }),
  ariaTitleId: PropTypes.string,
  ariaDescriptionId: PropTypes.string,
};

Modal.Header.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func,
};

Modal.Title.propTypes = {
  children: PropTypes.node,
  id: PropTypes.string,
};

Modal.Description.propTypes = {
  children: PropTypes.node,
  id: PropTypes.string,
};

Modal.Body.propTypes = {
  children: PropTypes.node,
};

Modal.Footer.propTypes = {
  children: PropTypes.node,
};

ConfirmationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
};
