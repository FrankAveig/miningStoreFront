/**
 * Validaciones para números de teléfono
 */

/**
 * Valida que el input solo contenga números y el signo más
 * @param {string} value - El valor a validar
 * @returns {boolean} - true si es válido, false si no
 */
export const isValidPhoneFormat = (value) => {
  if (!value) return true; // Campo vacío es válido (opcional)
  
  // Solo permite números, espacios, guiones y el signo más al inicio
  const phoneRegex = /^\+?[\d\s-]*$/;
  return phoneRegex.test(value);
};

/**
 * Formatea el input removiendo caracteres no válidos
 * @param {string} value - El valor a formatear
 * @returns {string} - El valor formateado
 */
export const formatPhoneInput = (value) => {
  if (!value) return '';
  
  // Remover todos los caracteres que no sean números, espacios, guiones o el signo más
  let formatted = value.replace(/[^\d\s+-]/g, '');
  
  // Si hay más de un signo más, mantener solo el primero
  const plusCount = (formatted.match(/\+/g) || []).length;
  if (plusCount > 1) {
    const firstPlusIndex = formatted.indexOf('+');
    formatted = '+' + formatted.replace(/\+/g, '').substring(firstPlusIndex);
  }
  
  // El signo más solo puede estar al inicio
  if (formatted.includes('+') && !formatted.startsWith('+')) {
    formatted = formatted.replace(/\+/g, '');
  }
  
  return formatted;
};

/**
 * Valida la longitud mínima y máxima del número de teléfono
 * @param {string} value - El valor a validar
 * @param {number} minLength - Longitud mínima (por defecto 7)
 * @param {number} maxLength - Longitud máxima (por defecto 15)
 * @returns {boolean} - true si la longitud es válida
 */
export const isValidPhoneLength = (value, minLength = 7, maxLength = 15) => {
  if (!value) return true; // Campo vacío es válido
  
  // Contar solo los dígitos (sin espacios, guiones o signo más)
  const digitsOnly = value.replace(/[^\d]/g, '');
  return digitsOnly.length >= minLength && digitsOnly.length <= maxLength;
};

/**
 * Valida completamente un número de teléfono
 * @param {string} value - El valor a validar
 * @returns {object} - {isValid: boolean, error: string}
 */
export const validatePhone = (value) => {
  if (!value || value.trim() === '') {
    return { isValid: true, error: '' };
  }
  
  if (!isValidPhoneFormat(value)) {
    return { 
      isValid: false, 
      error: 'Solo se permiten números, espacios, guiones y el signo + al inicio' 
    };
  }
  
  if (!isValidPhoneLength(value)) {
    return { 
      isValid: false, 
      error: 'El número debe tener entre 7 y 15 dígitos' 
    };
  }
  
  return { isValid: true, error: '' };
};