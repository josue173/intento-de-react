import { Task, TaskFilters, TaskStats, TaskPriority, TaskCategory, UserPreferences, CreateTaskData } from '../types';

// Generar un ID único
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Claves para localStorage
const STORAGE_KEYS = {
  TASKS: 'task-manager-tasks',
  PREFERENCES: 'task-manager-preferences',
  FILTERS: 'task-manager-filters'
};

// Manejo de localStorage
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      
      const parsed = JSON.parse(item);
      
      // Si es un array de tareas, convertir las fechas
      if (key === STORAGE_KEYS.TASKS && Array.isArray(parsed)) {
        return parsed.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined
        })) as T;
      }
      
      return parsed;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return defaultValue;
    }
  },
  
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  },
  
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
    }
  }
};

// Cargar tareas desde localStorage
export const loadTasks = (): Task[] => {
  return storage.get(STORAGE_KEYS.TASKS, []);
};

// Guardar tareas en localStorage
export const saveTasks = (tasks: Task[]): void => {
  storage.set(STORAGE_KEYS.TASKS, tasks);
};

// Cargar preferencias desde localStorage
export const loadPreferences = (): UserPreferences => {
  const defaultPreferences: UserPreferences = {
    theme: 'light',
    defaultCategory: 'personal',
    defaultPriority: 'medium',
    autoSave: true,
    notifications: true
  };
  
  return storage.get(STORAGE_KEYS.PREFERENCES, defaultPreferences);
};

// Guardar preferencias en localStorage
export const savePreferences = (preferences: UserPreferences): void => {
  storage.set(STORAGE_KEYS.PREFERENCES, preferences);
};

// Filtrar y ordenar tareas
export const filterAndSortTasks = (tasks: Task[], filters: TaskFilters): Task[] => {
  let filtered = [...tasks];
  
  // Filtrar por búsqueda
  if (filters.search.trim()) {
    const searchTerm = filters.search.toLowerCase();
    filtered = filtered.filter(task =>
      task.title.toLowerCase().includes(searchTerm) ||
      task.description.toLowerCase().includes(searchTerm) ||
      task.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }
  
  // Filtrar por estado
  if (filters.status !== 'all') {
    filtered = filtered.filter(task => task.status === filters.status);
  }
  
  // Filtrar por categoría
  if (filters.category !== 'all') {
    filtered = filtered.filter(task => task.category === filters.category);
  }
  
  // Filtrar por prioridad
  if (filters.priority !== 'all') {
    filtered = filtered.filter(task => task.priority === filters.priority);
  }
  
  // Filtrar por asignado
  if (filters.assignedTo !== 'all') {
    filtered = filtered.filter(task => 
      task.assignedTo === filters.assignedTo ||
      (filters.assignedTo === 'unassigned' && !task.assignedTo)
    );
  }
  
  // Ordenar
  filtered.sort((a, b) => {
    let comparison = 0;
    
    switch (filters.sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'createdAt':
        comparison = a.createdAt.getTime() - b.createdAt.getTime();
        break;
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) comparison = 0;
        else if (!a.dueDate) comparison = 1;
        else if (!b.dueDate) comparison = -1;
        else comparison = a.dueDate.getTime() - b.dueDate.getTime();
        break;
      case 'priority':
        const priorityOrder: Record<TaskPriority, number> = {
          urgent: 0, high: 1, medium: 2, low: 3
        };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        break;
      case 'order':
        comparison = a.order - b.order;
        break;
    }
    
    return filters.sortOrder === 'desc' ? -comparison : comparison;
  });
  
  return filtered;
};

// Calcular estadísticas
export const calculateTaskStats = (tasks: Task[]): TaskStats => {
  const now = new Date();
  
  const stats: TaskStats = {
    total: tasks.length,
    pending: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
    byCategory: {
      work: 0,
      personal: 0,
      shopping: 0,
      health: 0,
      education: 0,
      other: 0
    },
    byPriority: {
      low: 0,
      medium: 0,
      high: 0,
      urgent: 0
    }
  };
  
  tasks.forEach(task => {
    // Contar por estado
    switch (task.status) {
      case 'pending':
        stats.pending++;
        break;
      case 'in-progress':
        stats.inProgress++;
        break;
      case 'completed':
        stats.completed++;
        break;
    }
    
    // Contar vencidas (no completadas y con fecha de vencimiento pasada)
    if (task.status !== 'completed' && task.dueDate && task.dueDate < now) {
      stats.overdue++;
    }
    
    // Contar por categoría
    stats.byCategory[task.category]++;
    
    // Contar por prioridad
    stats.byPriority[task.priority]++;
  });
  
  return stats;
};

// Formatear fecha
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Formatear fecha relativa
export const formatRelativeDate = (date: Date): string => {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Mañana';
  if (diffDays === -1) return 'Ayer';
  if (diffDays > 0) return `En ${diffDays} días`;
  return `Hace ${Math.abs(diffDays)} días`;
};

// Obtener color por prioridad
export const getPriorityColor = (priority: TaskPriority): string => {
  const colors = {
    low: '#10b981',      // green-500
    medium: '#f59e0b',   // amber-500
    high: '#f97316',     // orange-500
    urgent: '#ef4444'    // red-500
  };
  return colors[priority];
};

// Obtener color por categoría
export const getCategoryColor = (category: TaskCategory): string => {
  const colors = {
    work: '#3b82f6',        // blue-500
    personal: '#8b5cf6',    // violet-500
    shopping: '#ec4899',    // pink-500
    health: '#10b981',      // emerald-500
    education: '#f59e0b',   // amber-500
    other: '#6b7280'        // gray-500
  };
  return colors[category];
};

// Validar datos de tarea
export const validateTaskData = (data: Partial<Task> | Partial<CreateTaskData>): string[] => {
  const errors: string[] = [];
  
  if (!data.title?.trim()) {
    errors.push('El título es requerido');
  }
  
  if (data.title && data.title.length > 100) {
    errors.push('El título no puede exceder 100 caracteres');
  }
  
  if (data.description && data.description.length > 500) {
    errors.push('La descripción no puede exceder 500 caracteres');
  }
  
  if (data.dueDate && data.dueDate < new Date()) {
    errors.push('La fecha de vencimiento no puede ser en el pasado');
  }
  
  return errors;
};

// Debounce function para optimizar búsquedas
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
};

// Exportar las claves de storage para uso en el contexto
export { STORAGE_KEYS };