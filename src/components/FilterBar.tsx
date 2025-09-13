import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  ArrowUpDown,
  Moon,
  Sun,
  Settings,
  BarChart3
} from 'lucide-react';
import { TaskFilters, TaskStatus, TaskCategory, TaskPriority } from '../types';
import { useApp } from '../context/AppContext';
import { debounce } from '../utils';

interface FilterBarProps {
  onShowStats?: () => void;
  onShowSettings?: () => void;
}

const statusOptions: { value: TaskStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'in-progress', label: 'En progreso' },
  { value: 'completed', label: 'Completadas' }
];

const categoryOptions: { value: TaskCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'work', label: 'Trabajo' },
  { value: 'personal', label: 'Personal' },
  { value: 'shopping', label: 'Compras' },
  { value: 'health', label: 'Salud' },
  { value: 'education', label: 'Educación' },
  { value: 'other', label: 'Otros' }
];

const priorityOptions: { value: TaskPriority | 'all'; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'urgent', label: 'Urgente' },
  { value: 'high', label: 'Alta' },
  { value: 'medium', label: 'Media' },
  { value: 'low', label: 'Baja' }
];

const sortOptions: { value: TaskFilters['sortBy']; label: string }[] = [
  { value: 'createdAt', label: 'Fecha de creación' },
  { value: 'dueDate', label: 'Fecha de vencimiento' },
  { value: 'priority', label: 'Prioridad' },
  { value: 'title', label: 'Título' },
  { value: 'order', label: 'Orden personalizado' }
];

export const FilterBar: React.FC<FilterBarProps> = ({
  onShowStats,
  onShowSettings
}) => {
  const { 
    filters, 
    setFilter, 
    clearFilters, 
    theme, 
    toggleTheme,
    getFilteredTasks
  } = useApp();
  
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search);

  // Debounced search function
  const debouncedSearch = useMemo(
    () => debounce((value: string) => {
      setFilter('search', value);
    }, 300),
    [setFilter]
  );

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    debouncedSearch(value);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setFilter('search', '');
  };

  const handleClearFilters = () => {
    setSearchInput('');
    clearFilters();
    setShowAdvancedFilters(false);
  };

  const hasActiveFilters = () => {
    return (
      filters.search !== '' ||
      filters.status !== 'all' ||
      filters.category !== 'all' ||
      filters.priority !== 'all' ||
      filters.assignedTo !== 'all'
    );
  };

  const filteredTasksCount = getFilteredTasks().length;

  return (
    <div className="bg-surface border-b border-border sticky top-0 z-sticky">
      <div className="container py-4">
        {/* Barra principal */}
        <div className="flex items-center gap-4 mb-4">
          {/* Búsqueda */}
          <div className="flex-1 max-w-md relative">
            <div className="relative">
              <Search 
                size={20} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" 
              />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Buscar tareas..."
                className="input pl-10 pr-10"
              />
              {searchInput && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-primary"
                  aria-label="Limpiar búsqueda"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center gap-2">
            {/* Filtros avanzados */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`btn btn-secondary ${hasActiveFilters() ? 'bg-primary text-white' : ''}`}
              aria-label="Mostrar filtros avanzados"
            >
              <Filter size={16} />
              {hasActiveFilters() && (
                <span className="bg-white text-primary rounded-full px-1.5 py-0.5 text-xs font-bold min-w-[20px]">
                  {Object.values(filters).filter(v => v !== 'all' && v !== '' && v !== 'createdAt' && v !== 'desc').length}
                </span>
              )}
            </button>

            {/* Estadísticas */}
            {onShowStats && (
              <button
                onClick={onShowStats}
                className="btn btn-secondary"
                aria-label="Mostrar estadísticas"
              >
                <BarChart3 size={16} />
              </button>
            )}

            {/* Tema */}
            <button
              onClick={toggleTheme}
              className="btn btn-secondary"
              aria-label={`Cambiar a tema ${theme === 'light' ? 'oscuro' : 'claro'}`}
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>

            {/* Configuración */}
            {onShowSettings && (
              <button
                onClick={onShowSettings}
                className="btn btn-secondary"
                aria-label="Configuración"
              >
                <Settings size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Filtros avanzados */}
        {showAdvancedFilters && (
          <div className="bg-background-secondary rounded-lg p-4 animate-slide-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Estado */}
              <div>
                <label htmlFor="status-filter" className="block text-sm font-medium mb-2">
                  Estado
                </label>
                <select
                  id="status-filter"
                  value={filters.status}
                  onChange={(e) => setFilter('status', e.target.value as TaskStatus | 'all')}
                  className="input"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Categoría */}
              <div>
                <label htmlFor="category-filter" className="block text-sm font-medium mb-2">
                  Categoría
                </label>
                <select
                  id="category-filter"
                  value={filters.category}
                  onChange={(e) => setFilter('category', e.target.value as TaskCategory | 'all')}
                  className="input"
                >
                  {categoryOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Prioridad */}
              <div>
                <label htmlFor="priority-filter" className="block text-sm font-medium mb-2">
                  Prioridad
                </label>
                <select
                  id="priority-filter"
                  value={filters.priority}
                  onChange={(e) => setFilter('priority', e.target.value as TaskPriority | 'all')}
                  className="input"
                >
                  {priorityOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ordenar por */}
              <div>
                <label htmlFor="sort-filter" className="block text-sm font-medium mb-2">
                  Ordenar por
                </label>
                <div className="flex gap-2">
                  <select
                    id="sort-filter"
                    value={filters.sortBy}
                    onChange={(e) => setFilter('sortBy', e.target.value as TaskFilters['sortBy'])}
                    className="input flex-1"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                    className={`btn btn-secondary flex-shrink-0 ${filters.sortOrder === 'desc' ? 'rotate-180' : ''}`}
                    aria-label={`Cambiar orden a ${filters.sortOrder === 'asc' ? 'descendente' : 'ascendente'}`}
                  >
                    <ArrowUpDown size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Asignado a */}
            <div className="mb-4">
              <label htmlFor="assigned-filter" className="block text-sm font-medium mb-2">
                Asignado a
              </label>
              <input
                id="assigned-filter"
                type="text"
                value={filters.assignedTo === 'all' ? '' : filters.assignedTo}
                onChange={(e) => setFilter('assignedTo', e.target.value || 'all')}
                placeholder="Filtrar por persona asignada..."
                className="input max-w-md"
              />
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3">
              <button
                onClick={handleClearFilters}
                className="btn btn-secondary"
                disabled={!hasActiveFilters()}
              >
                <X size={16} />
                Limpiar filtros
              </button>
              <button
                onClick={() => setShowAdvancedFilters(false)}
                className="btn btn-primary"
              >
                Aplicar filtros
              </button>
            </div>
          </div>
        )}

        {/* Información de resultados */}
        <div className="flex items-center justify-between text-sm text-secondary mt-3">
          <div>
            Mostrando <span className="font-medium">{filteredTasksCount}</span> tarea{filteredTasksCount !== 1 ? 's' : ''}
            {hasActiveFilters() && (
              <span> (filtradas)</span>
            )}
          </div>
          
          {hasActiveFilters() && (
            <button
              onClick={handleClearFilters}
              className="text-primary hover:underline"
            >
              Mostrar todas
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
