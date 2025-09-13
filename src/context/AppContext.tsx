import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { 
  AppContextType, 
  AppAction, 
  Task, 
  TaskFilters, 
  UserPreferences,
  CreateTaskData,
  UpdateTaskData,
  TaskStats,
  Theme
} from '../types';
import { 
  generateId, 
  loadTasks, 
  saveTasks, 
  loadPreferences, 
  savePreferences,
  filterAndSortTasks,
  calculateTaskStats
} from '../utils';
import { loadSampleDataIfEmpty } from '../utils/sampleData';

// Estado inicial
interface AppState {
  tasks: Task[];
  filters: TaskFilters;
  isLoading: boolean;
  theme: Theme;
  preferences: UserPreferences;
}

const initialFilters: TaskFilters = {
  status: 'all',
  category: 'all',
  priority: 'all',
  assignedTo: 'all',
  search: '',
  sortBy: 'createdAt',
  sortOrder: 'desc'
};

const initialState: AppState = {
  tasks: [],
  filters: initialFilters,
  isLoading: true,
  theme: 'light',
  preferences: {
    theme: 'light',
    defaultCategory: 'personal',
    defaultPriority: 'medium',
    autoSave: true,
    notifications: true
  }
};

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'LOAD_TASKS':
      return {
        ...state,
        tasks: action.payload,
        isLoading: false
      };
    
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload]
      };
    
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task => {
          if (task.id === action.payload.id) {
            return {
              ...task,
              ...action.payload.updates,
              updatedAt: new Date()
            };
          }
          return task;
        })
      };
    
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      };
    
    case 'TOGGLE_TASK_STATUS':
      return {
        ...state,
        tasks: state.tasks.map(task => {
          if (task.id === action.payload) {
            const newStatus = task.status === 'completed' ? 'pending' : 
                             task.status === 'pending' ? 'in-progress' : 'completed';
            return {
              ...task,
              status: newStatus,
              updatedAt: new Date()
            };
          }
          return task;
        })
      };
    
    case 'REORDER_TASKS':
      const taskOrder = action.payload;
      return {
        ...state,
        tasks: state.tasks.map(task => {
          const newOrder = taskOrder.indexOf(task.id);
          return newOrder !== -1 ? { ...task, order: newOrder } : task;
        })
      };
    
    case 'SET_FILTER':
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.key]: action.payload.value
        }
      };
    
    case 'CLEAR_FILTERS':
      return {
        ...state,
        filters: initialFilters
      };
    
    case 'TOGGLE_THEME':
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      return {
        ...state,
        theme: newTheme,
        preferences: {
          ...state.preferences,
          theme: newTheme
        }
      };
    
    case 'UPDATE_PREFERENCES':
      const newPreferences = { ...state.preferences, ...action.payload };
      return {
        ...state,
        preferences: newPreferences,
        theme: newPreferences.theme || state.theme
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    
    default:
      return state;
  }
};

// Crear el contexto
const AppContext = createContext<AppContextType | undefined>(undefined);

// Hook para usar el contexto
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe ser usado dentro de un AppProvider');
  }
  return context;
};

// Provider del contexto
interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Inicializar datos desde localStorage
  useEffect(() => {
    const loadData = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        // Cargar preferencias
        const preferences = loadPreferences();
        dispatch({ type: 'UPDATE_PREFERENCES', payload: preferences });
        
        // Cargar tareas o datos de ejemplo si no existen
        const sampleData = loadSampleDataIfEmpty();
        const tasks = sampleData || loadTasks();
        dispatch({ type: 'LOAD_TASKS', payload: tasks });
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    
    loadData();
  }, []);

  // Guardar tareas cuando cambian (si autoSave está activado)
  useEffect(() => {
    if (state.preferences.autoSave && !state.isLoading) {
      saveTasks(state.tasks);
    }
  }, [state.tasks, state.preferences.autoSave, state.isLoading]);

  // Guardar preferencias cuando cambian
  useEffect(() => {
    if (!state.isLoading) {
      savePreferences(state.preferences);
    }
  }, [state.preferences, state.isLoading]);

  // Aplicar tema al documento
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  // Métodos para tareas
  const addTask = useCallback((taskData: CreateTaskData) => {
    const now = new Date();
    const newTask: Task = {
      id: generateId(),
      title: taskData.title.trim(),
      description: taskData.description.trim(),
      status: 'pending',
      priority: taskData.priority,
      category: taskData.category,
      dueDate: taskData.dueDate,
      createdAt: now,
      updatedAt: now,
      tags: taskData.tags || [],
      assignedTo: taskData.assignedTo,
      order: state.tasks.length
    };
    
    dispatch({ type: 'ADD_TASK', payload: newTask });
  }, [state.tasks.length]);

  const updateTask = useCallback((data: UpdateTaskData) => {
    dispatch({ type: 'UPDATE_TASK', payload: data });
  }, []);

  const deleteTask = useCallback((id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  }, []);

  const toggleTaskStatus = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_TASK_STATUS', payload: id });
  }, []);

  const reorderTasks = useCallback((taskIds: string[]) => {
    dispatch({ type: 'REORDER_TASKS', payload: taskIds });
  }, []);

  // Métodos para filtros
  const setFilter = useCallback((key: keyof TaskFilters, value: TaskFilters[keyof TaskFilters]) => {
    dispatch({ type: 'SET_FILTER', payload: { key, value } });
  }, []);

  const clearFilters = useCallback(() => {
    dispatch({ type: 'CLEAR_FILTERS' });
  }, []);

  // Métodos de UI
  const toggleTheme = useCallback(() => {
    dispatch({ type: 'TOGGLE_THEME' });
  }, []);

  const updatePreferences = useCallback((preferences: Partial<UserPreferences>) => {
    dispatch({ type: 'UPDATE_PREFERENCES', payload: preferences });
  }, []);

  // Utilidades
  const getFilteredTasks = useCallback((): Task[] => {
    return filterAndSortTasks(state.tasks, state.filters);
  }, [state.tasks, state.filters]);

  const getTaskStats = useCallback((): TaskStats => {
    return calculateTaskStats(state.tasks);
  }, [state.tasks]);

  // Valor del contexto
  const value: AppContextType = {
    // Estado
    tasks: state.tasks,
    filters: state.filters,
    isLoading: state.isLoading,
    theme: state.theme,
    preferences: state.preferences,
    
    // Métodos de tareas
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    reorderTasks,
    
    // Métodos de filtros
    setFilter,
    clearFilters,
    
    // Métodos de UI
    toggleTheme,
    updatePreferences,
    
    // Utilidades
    getFilteredTasks,
    getTaskStats
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};