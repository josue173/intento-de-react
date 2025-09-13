import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Edit, 
  Trash2, 
  Calendar,
  Tag,
  User,
  AlertCircle
} from 'lucide-react';
import { Task } from '../types';
import { 
  formatRelativeDate, 
  getPriorityColor, 
  getCategoryColor 
} from '../utils';

interface TaskCardProps {
  task: Task;
  onToggleStatus: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  isDragging?: boolean;
}

const statusIcons = {
  'pending': Circle,
  'in-progress': Clock,
  'completed': CheckCircle2
};

const statusLabels = {
  'pending': 'Pendiente',
  'in-progress': 'En progreso',
  'completed': 'Completada'
};

const priorityLabels = {
  'low': 'Baja',
  'medium': 'Media',
  'high': 'Alta',
  'urgent': 'Urgente'
};

const categoryLabels = {
  'work': 'Trabajo',
  'personal': 'Personal',
  'shopping': 'Compras',
  'health': 'Salud',
  'education': 'Educación',
  'other': 'Otros'
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleStatus,
  onEdit,
  onDelete,
  isDragging = false
}) => {
  const StatusIcon = statusIcons[task.status];
  const priorityColor = getPriorityColor(task.priority);
  const categoryColor = getCategoryColor(task.category);
  
  const isOverdue = task.dueDate && 
    task.status !== 'completed' && 
    task.dueDate < new Date();

  const handleStatusToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleStatus(task.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(task);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(task.id);
  };

  return (
    <div 
      className={`
        card p-4 cursor-pointer transition-all
        ${isDragging ? 'opacity-50 rotate-3' : 'hover:shadow-lg'}
        ${task.status === 'completed' ? 'opacity-75' : ''}
        ${isOverdue ? 'border-l-4 border-l-red-500' : ''}
      `}
      onClick={() => onEdit(task)}
    >
      {/* Header con estado y acciones */}
      <div className="flex items-start justify-between mb-3">
        <button
          onClick={handleStatusToggle}
          className={`
            p-1 rounded-full transition-colors
            ${task.status === 'completed' 
              ? 'text-green-500 hover:text-green-600' 
              : 'text-gray-400 hover:text-primary'
            }
          `}
          aria-label={`Marcar como ${task.status === 'completed' ? 'pendiente' : 'completada'}`}
        >
          <StatusIcon size={20} />
        </button>
        
        <div className="flex gap-2">
          <button
            onClick={handleEdit}
            className="p-1 rounded transition-colors text-gray-400 hover:text-primary"
            aria-label="Editar tarea"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 rounded transition-colors text-gray-400 hover:text-error"
            aria-label="Eliminar tarea"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Título */}
      <h3 className={`
        text-lg font-medium mb-2 leading-tight
        ${task.status === 'completed' ? 'line-through text-muted' : ''}
      `}>
        {task.title}
      </h3>

      {/* Descripción */}
      {task.description && (
        <p className={`
          text-sm text-secondary mb-3 line-clamp-2
          ${task.status === 'completed' ? 'line-through' : ''}
        `}>
          {task.description}
        </p>
      )}

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-xs text-gray-600"
            >
              <Tag size={10} />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Información adicional */}
      <div className="flex items-center justify-between text-xs text-secondary">
        <div className="flex items-center gap-3">
          {/* Prioridad */}
          <span 
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-white font-medium"
            style={{ backgroundColor: priorityColor }}
          >
            {task.priority === 'urgent' && <AlertCircle size={10} />}
            {priorityLabels[task.priority]}
          </span>

          {/* Categoría */}
          <span 
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-white text-xs"
            style={{ backgroundColor: categoryColor }}
          >
            {categoryLabels[task.category]}
          </span>

          {/* Asignado a */}
          {task.assignedTo && (
            <span className="inline-flex items-center gap-1">
              <User size={12} />
              {task.assignedTo}
            </span>
          )}
        </div>

        {/* Fecha de vencimiento */}
        {task.dueDate && (
          <span className={`
            inline-flex items-center gap-1
            ${isOverdue ? 'text-error font-medium' : ''}
          `}>
            <Calendar size={12} />
            {formatRelativeDate(task.dueDate)}
            {isOverdue && <AlertCircle size={12} />}
          </span>
        )}
      </div>

      {/* Estado visual */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-muted">
          <span>Estado: {statusLabels[task.status]}</span>
          <span>Actualizada: {formatRelativeDate(task.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
};

// Agregar CSS personalizado para line-clamp
const styles = `
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

// Agregar los estilos al head si no existen
if (typeof document !== 'undefined') {
  const styleId = 'task-card-styles';
  if (!document.getElementById(styleId)) {
    const styleElement = document.createElement('style');
    styleElement.id = styleId;
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
  }
}
