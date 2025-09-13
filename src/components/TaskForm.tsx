import React, { useState, useEffect } from 'react';
import { X, Plus, Calendar, Tag, User } from 'lucide-react';
import { Task, CreateTaskData, TaskPriority, TaskCategory } from '../types';
import { validateTaskData } from '../utils';
import { useApp } from '../context/AppContext';

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: CreateTaskData) => void;
  onCancel: () => void;
  isOpen: boolean;
}

const priorityOptions: { value: TaskPriority; label: string; color: string }[] = [
  { value: 'low', label: 'Baja', color: '#10b981' },
  { value: 'medium', label: 'Media', color: '#f59e0b' },
  { value: 'high', label: 'Alta', color: '#f97316' },
  { value: 'urgent', label: 'Urgente', color: '#ef4444' }
];

const categoryOptions: { value: TaskCategory; label: string; color: string }[] = [
  { value: 'work', label: 'Trabajo', color: '#3b82f6' },
  { value: 'personal', label: 'Personal', color: '#8b5cf6' },
  { value: 'shopping', label: 'Compras', color: '#ec4899' },
  { value: 'health', label: 'Salud', color: '#10b981' },
  { value: 'education', label: 'Educación', color: '#f59e0b' },
  { value: 'other', label: 'Otros', color: '#6b7280' }
];

export const TaskForm: React.FC<TaskFormProps> = ({
  task,
  onSubmit,
  onCancel,
  isOpen
}) => {
  const { preferences } = useApp();
  
  const [formData, setFormData] = useState<CreateTaskData>({
    title: '',
    description: '',
    priority: preferences.defaultPriority,
    category: preferences.defaultCategory,
    dueDate: undefined,
    tags: [],
    assignedTo: undefined
  });
  
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Llenar el formulario cuando se edita una tarea
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        priority: task.priority,
        category: task.category,
        dueDate: task.dueDate,
        tags: [...task.tags],
        assignedTo: task.assignedTo
      });
    } else {
      // Resetear formulario para nueva tarea
      setFormData({
        title: '',
        description: '',
        priority: preferences.defaultPriority,
        category: preferences.defaultCategory,
        dueDate: undefined,
        tags: [],
        assignedTo: undefined
      });
    }
    setTagInput('');
    setErrors([]);
  }, [task, preferences, isOpen]);

  const handleInputChange = (field: keyof CreateTaskData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags?.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tag]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const formatDateForInput = (date: Date | undefined): string => {
    if (!date) return '';
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validar datos
      const validationErrors = validateTaskData(formData);
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        return;
      }
      
      // Enviar datos
      await onSubmit(formData);
      
      // Resetear formulario si es exitoso
      if (!task) {
        setFormData({
          title: '',
          description: '',
          priority: preferences.defaultPriority,
          category: preferences.defaultCategory,
          dueDate: undefined,
          tags: [],
          assignedTo: undefined
        });
        setTagInput('');
      }
      
    } catch (error) {
      setErrors(['Error al guardar la tarea. Intenta nuevamente.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-modal p-4">
      <div className="bg-surface rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold">
            {task ? 'Editar Tarea' : 'Nueva Tarea'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Errores */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-red-800 mb-2">
                Se encontraron los siguientes errores:
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Título */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Título *
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="¿Qué necesitas hacer?"
              className="input"
              required
              maxLength={100}
            />
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Descripción
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe los detalles de la tarea..."
              className="input min-h-[100px] resize-vertical"
              maxLength={500}
              rows={3}
            />
          </div>

          {/* Prioridad y Categoría */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="priority" className="block text-sm font-medium mb-2">
                Prioridad
              </label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value as TaskPriority)}
                className="input"
              >
                {priorityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-2">
                Categoría
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value as TaskCategory)}
                className="input"
              >
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fecha de vencimiento */}
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium mb-2">
              <Calendar size={16} className="inline mr-1" />
              Fecha de vencimiento
            </label>
            <input
              id="dueDate"
              type="datetime-local"
              value={formatDateForInput(formData.dueDate)}
              onChange={(e) => handleInputChange('dueDate', e.target.value ? new Date(e.target.value) : undefined)}
              className="input"
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          {/* Asignado a */}
          <div>
            <label htmlFor="assignedTo" className="block text-sm font-medium mb-2">
              <User size={16} className="inline mr-1" />
              Asignado a
            </label>
            <input
              id="assignedTo"
              type="text"
              value={formData.assignedTo || ''}
              onChange={(e) => handleInputChange('assignedTo', e.target.value || undefined)}
              placeholder="Nombre de la persona"
              className="input"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-2">
              <Tag size={16} className="inline mr-1" />
              Etiquetas
            </label>
            
            {/* Tags existentes */}
            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary text-white rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:bg-white hover:bg-opacity-20 rounded-full p-0.5"
                      aria-label={`Eliminar etiqueta ${tag}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
            
            {/* Input para nuevos tags */}
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                placeholder="Agregar etiqueta..."
                className="input flex-1"
              />
              <button
                type="button"
                onClick={handleAddTag}
                disabled={!tagInput.trim()}
                className="btn btn-secondary flex-shrink-0"
              >
                <Plus size={16} />
              </button>
            </div>
            <p className="text-xs text-muted mt-1">
              Presiona Enter o coma para agregar una etiqueta
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-secondary flex-1"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary flex-1"
              disabled={isSubmitting || !formData.title.trim()}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Guardando...
                </span>
              ) : (
                task ? 'Actualizar Tarea' : 'Crear Tarea'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
