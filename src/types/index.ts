// Estados posibles de una tarea
export type TaskStatus = 'pending' | 'in-progress' | 'completed';

// Prioridades de las tareas
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

// Categorías predefinidas
export type TaskCategory = 'work' | 'personal' | 'shopping' | 'health' | 'education' | 'other';

// Interface principal para una tarea
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  assignedTo?: string;
  order: number;
}

// Interface para crear una nueva tarea
export interface CreateTaskData {
  title: string;
  description: string;
  priority: TaskPriority;
  category: TaskCategory;
  dueDate?: Date;
  tags?: string[];
  assignedTo?: string;
}

// Interface para actualizar una tarea
export interface UpdateTaskData {
  id: string;
  updates: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>;
}

// Interface para filtros
export interface TaskFilters {
  status: TaskStatus | 'all';
  category: TaskCategory | 'all';
  priority: TaskPriority | 'all';
  assignedTo: string | 'all';
  search: string;
  sortBy: 'createdAt' | 'dueDate' | 'priority' | 'title' | 'order';
  sortOrder: 'asc' | 'desc';
}

// Interface para el usuario
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Interface para estadísticas
export interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
  byCategory: Record<TaskCategory, number>;
  byPriority: Record<TaskPriority, number>;
}

// Tema de la aplicación
export type Theme = 'light' | 'dark';

// Interface para las preferencias del usuario
export interface UserPreferences {
  theme: Theme;
  defaultCategory: TaskCategory;
  defaultPriority: TaskPriority;
  autoSave: boolean;
  notifications: boolean;
}

// Interface para el contexto de la aplicación
export interface AppContextType {
  // Estado de las tareas
  tasks: Task[];
  filters: TaskFilters;
  
  // Estado de UI
  isLoading: boolean;
  theme: Theme;
  preferences: UserPreferences;
  
  // Métodos de tareas
  addTask: (task: CreateTaskData) => void;
  updateTask: (data: UpdateTaskData) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  reorderTasks: (taskIds: string[]) => void;
  
  // Métodos de filtros
  setFilter: (key: keyof TaskFilters, value: TaskFilters[keyof TaskFilters]) => void;
  clearFilters: () => void;
  
  // Métodos de UI
  toggleTheme: () => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  
  // Utilidades
  getFilteredTasks: () => Task[];
  getTaskStats: () => TaskStats;
}

// Tipos para acciones del reducer
export type AppAction = 
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: UpdateTaskData }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_TASK_STATUS'; payload: string }
  | { type: 'REORDER_TASKS'; payload: string[] }
  | { type: 'SET_FILTER'; payload: { key: keyof TaskFilters; value: TaskFilters[keyof TaskFilters] } }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'TOGGLE_THEME' }
  | { type: 'UPDATE_PREFERENCES'; payload: Partial<UserPreferences> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOAD_TASKS'; payload: Task[] };

// Interface para notificaciones
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}