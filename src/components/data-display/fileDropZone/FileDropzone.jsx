import { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactCropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import styles from './FileDropzone.module.scss';
import { FaFilePdf, FaFileWord, FaFileAlt, FaTimes, FaImage } from 'react-icons/fa';

const getFileIcon = (file) => {
  if (!file) return <FaFileAlt />;
  const type = file.type;
  if (type.includes('pdf')) return <FaFilePdf className={styles.iconPdf} />;
  if (type.includes('word') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) return <FaFileWord className={styles.iconWord} />;
  if (type.includes('image')) return <FaImage className={styles.iconImage} />;
  return <FaFileAlt />;
};

export const FileDropzone = ({
  label = 'Sube o arrastra un archivo',
  accept = '.pdf,.doc,.docx',
  value,
  onChange,
  error,
  disabled = false,
  enableCropper = false,
  aspectRatio = 16 / 9,
  ...rest
}) => {
  const inputRef = useRef();
  const [showCropper, setShowCropper] = useState(false);
  const [originalFile, setOriginalFile] = useState(null);
  const [cropper, setCropper] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    // Limpiar la URL previa cuando cambia el archivo o se desmonta
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    if (value && value.type && value.type.includes('image')) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [value]);

  const handleDrop = (e) => {
    e.preventDefault();
    if (disabled) return;
    const file = e.dataTransfer.files[0];
    if (file) {
      if (enableCropper && file.type.includes('image')) {
        setOriginalFile(file);
        setShowCropper(true);
      } else {
        onChange(file);
      }
    }
  };

  const handleClick = () => {
    if (!disabled) inputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (enableCropper && file.type.includes('image')) {
        setOriginalFile(file);
        setShowCropper(true);
      } else {
        onChange(file);
      }
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    if (onChange) onChange(null);
    setPreviewUrl(null);
  };

  const handleCrop = () => {
    if (cropper) {
      cropper.getCroppedCanvas().toBlob((blob) => {
        const croppedFile = new File([blob], originalFile.name, {
          type: originalFile.type,
          lastModified: Date.now(),
        });
        onChange(croppedFile);
        setShowCropper(false);
        setOriginalFile(null);
        // Actualizar la vista previa
        setPreviewUrl(URL.createObjectURL(croppedFile));
      });
    }
  };

  const handleCancelCrop = () => {
    setShowCropper(false);
    setOriginalFile(null);
  };

  if (showCropper && originalFile) {
    return (
      <div className={styles.cropperContainer}>
        <div className={styles.cropperHeader}>
          <h4>Recortar imagen</h4>
          <div className={styles.cropperActions}>
            <button
              type="button"
              className={styles.cropperButton}
              onClick={handleCrop}
            >
              Aplicar
            </button>
            <button
              type="button"
              className={`${styles.cropperButton} ${styles.cropperButtonCancel}`}
              onClick={handleCancelCrop}
            >
              Cancelar
            </button>
          </div>
        </div>
        <ReactCropper
          src={URL.createObjectURL(originalFile)}
          style={{ height: 400, width: '100%' }}
          initialAspectRatio={aspectRatio}
          aspectRatio={aspectRatio}
          guides={true}
          viewMode={1}
          onInitialized={(instance) => setCropper(instance)}
        />
      </div>
    );
  }

  return (
    <div
      className={[
        styles.dropzone,
        error ? styles['dropzone--error'] : '',
        disabled ? styles['dropzone--disabled'] : ''
      ].filter(Boolean).join(' ')}
      tabIndex={0}
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={e => e.preventDefault()}
      aria-disabled={disabled}
      {...rest}
    >
      <input
        ref={inputRef}
        type="file"
        style={{ display: 'none' }}
        accept={accept}
        onChange={handleFileChange}
        disabled={disabled}
      />
      {!value ? (
        <div className={styles.dropzone__placeholder}>
          {label}
        </div>
      ) : (
        <div className={styles.dropzone__file}>
          {getFileIcon(value)}
         {/*  <span className={styles.dropzone__filename}>{value.name}</span> */}
          <button
            type="button"
            className={styles.dropzone__remove}
            onClick={handleRemove}
            aria-label="Eliminar archivo"
            tabIndex={disabled ? -1 : 0}
            disabled={disabled}
          >
            <FaTimes />
          </button>
          {/* Vista previa de imagen */}
          {previewUrl && value.type && value.type.includes('image') && (
            <img
              src={previewUrl}
              alt="Vista previa"
              style={{ maxHeight: 80, maxWidth: 120, marginLeft: 12, borderRadius: 8, border: '1px solid #eee' }}
            />
          )}
        </div>
      )}
    </div>
  );
};

FileDropzone.propTypes = {
  label: PropTypes.string,
  accept: PropTypes.string,
  value: PropTypes.object,
  onChange: PropTypes.func,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  enableCropper: PropTypes.bool,
  aspectRatio: PropTypes.number
};
