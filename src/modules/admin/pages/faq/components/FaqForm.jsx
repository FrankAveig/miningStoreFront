import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import styles from './faqForm.module.scss';
import { InputField } from '@/components/form/inputField/InputField';
import { Button } from '@/components/ui/button/Button';
import { createFaq, updateFaq } from '@/modules/admin/services/faq.service';
import { useToast } from '@/context/ToastContext';

export const FaqForm = ({ onSuccess, initialData }) => {
  const [form, setForm] = useState({ 
    question: '', 
    answer: '',
    status: 'active'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  // Configuración de módulos de ReactQuill
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link'],
      ['clean']
    ]
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'color', 'background',
    'link'
  ];

  useEffect(() => {
    if (initialData) {
      setForm({
        question: initialData.question || '',
        answer: initialData.answer || '',
        status: initialData.status || 'active',
        id: initialData.id || undefined
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleAnswerChange = (value) => {
    setForm((prev) => ({ ...prev, answer: value }));
    setErrors((prev) => ({ ...prev, answer: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.question.trim()) newErrors.question = 'La pregunta es requerida';
    
    // Validar que la respuesta no esté vacía (ReactQuill puede devolver '<p><br></p>' para vacío)
    const answerText = form.answer.replace(/<[^>]*>/g, '').trim();
    if (!answerText) newErrors.answer = 'La respuesta es requerida';
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      const submitData = {
        question: form.question.trim(),
        answer: form.answer.trim(),
        status: form.status
      };

      if (form.id) {
        await updateFaq(form.id, submitData);
      } else {
        await createFaq(submitData);
        setForm({ question: '', answer: '', status: 'active' });
      }
      setErrors({});
      if (onSuccess) onSuccess();
    } catch (error) {
      let message = 'Error al guardar la pregunta frecuente';
      let fieldErrors = {};
      if (error?.response?.data) {
        const data = error.response.data;
        if (data.message) message = data.message;
        if (data.errors) {
          Object.entries(data.errors).forEach(([field, msgs]) => {
            fieldErrors[field] = Array.isArray(msgs) ? msgs[0] : msgs;
          });
        }
      }
      setErrors(fieldErrors);
      showToast(message, 'error', 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className={styles.formContainer}>
      <div className={styles.formGroup}>
        <InputField
          label="Pregunta"
          id="question"
          name="question"
          value={form.question}
          onChange={handleChange}
          isRequired
          error={errors.question}
          placeholder="Ej: ¿Qué es Bitcoin?"
          size="md"
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.editorLabel}>
          Respuesta <span className={styles.required}>*</span>
        </label>
        <div className={styles.editorWrapper}>
          <ReactQuill 
            theme="snow"
            value={form.answer}
            onChange={handleAnswerChange}
            modules={modules}
            formats={formats}
            placeholder="Escribe la respuesta a la pregunta..."
            className={errors.answer ? styles.editorError : ''}
          />
        </div>
        {errors.answer && <span className={styles.errorText}>{errors.answer}</span>}
        <small className={styles.helpText}>
          Usa el editor para formatear la respuesta con negritas, listas, enlaces, colores, etc.
        </small>
      </div>
      <div className={styles.buttonContainer}>
        <Button type="submit" variant="primary" size="md" isLoading={loading} fullWidth>
          {form.id ? 'Guardar cambios' : 'Crear pregunta frecuente'}
        </Button>
      </div>
    </form>
  );
};

FaqForm.propTypes = {
  onSuccess: PropTypes.func,
  initialData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    question: PropTypes.string,
    answer: PropTypes.string,
    status: PropTypes.string
  })
};

