import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { TaskList } from './components/TaskList';
import { TaskForm } from './components/TaskForm';
import { FilterBar } from './components/FilterBar';
import { StatsModal } from './components/StatsModal';
import { useApp } from './context/AppContext';
import { Task, CreateTaskData, UpdateTaskData } from './types';
import './styles/index.css';

// Componente de estado vacío
const EmptyState: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6">
      <Plus size={32} className="text-gray-400" />
    </div>
    <h3 className="text-xl font-medium text-gray-900 mb-2">
      No hay tareas todavía
    </h3>
    <p className="text-gray-500 mb-6 max-w-sm">
      Crea tu primera tarea para empezar a organizar tu trabajo y ser más productivo.
    </p>
    <button className="btn btn-primary">
      <Plus size={16} />
      Crear primera tarea
    </button>
  </div>
);

// Componente de loading
const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
  </div>
);

function App() {
  const {
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    reorderTasks,
    getFilteredTasks,
    isLoading,
    filters
  } = useApp();

  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);

  const filteredTasks = getFilteredTasks();

  // Manejar creación de tarea
  const handleCreateTask = async (taskData: CreateTaskData) => {
    try {
      addTask(taskData);
      setIsTaskFormOpen(false);
      toast.success('Tarea creada exitosamente');
    } catch (error) {
      toast.error('Error al crear la tarea');
      console.error('Error creating task:', error);
    }
  };

  // Manejar edición de tarea
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  // Manejar actualización de tarea
  const handleUpdateTask = async (taskData: CreateTaskData) => {
    if (!editingTask) return;

    try {
      const updateData: UpdateTaskData = {
        id: editingTask.id,
        updates: taskData
      };
      updateTask(updateData);
      setIsTaskFormOpen(false);
      setEditingTask(undefined);
      toast.success('Tarea actualizada exitosamente');
    } catch (error) {
      toast.error('Error al actualizar la tarea');
      console.error('Error updating task:', error);
    }
  };

  // Manejar eliminación de tarea
  const handleDeleteTask = async (taskId: string) => {
    try {
      deleteTask(taskId);
      toast.success('Tarea eliminada exitosamente');
    } catch (error) {
      toast.error('Error al eliminar la tarea');
      console.error('Error deleting task:', error);
    }
  };

  // Manejar cambio de estado de tarea
  const handleToggleTaskStatus = async (taskId: string) => {
    try {
      toggleTaskStatus(taskId);
      const task = filteredTasks.find(t => t.id === taskId);
      if (task) {
        const newStatus = task.status === 'completed' ? 'pending' : 
                         task.status === 'pending' ? 'in-progress' : 'completed';
        const statusText = newStatus === 'completed' ? 'completada' :
                          newStatus === 'in-progress' ? 'en progreso' : 'pendiente';
        toast.success(`Tarea marcada como ${statusText}`);
      }
    } catch (error) {
      toast.error('Error al cambiar el estado de la tarea');
      console.error('Error toggling task status:', error);
    }
  };

  // Manejar reordenamiento de tareas
  const handleReorderTasks = (taskIds: string[]) => {
    try {
      reorderTasks(taskIds);
      toast.success('Orden de tareas actualizado');
    } catch (error) {
      toast.error('Error al reordenar las tareas');
      console.error('Error reordering tasks:', error);
    }
  };

  // Cerrar formulario
  const handleCloseForm = () => {
    setIsTaskFormOpen(false);
    setEditingTask(undefined);
  };

  // Abrir formulario para nueva tarea
  const handleNewTask = () => {
    setEditingTask(undefined);
    setIsTaskFormOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-border">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">
                Gestor de Tareas
              </h1>
              <p className="text-secondary">
                Organiza tu trabajo y aumenta tu productividad
              </p>
            </div>
            <button
              onClick={handleNewTask}
              className="btn btn-primary btn-lg"
              aria-label="Crear nueva tarea"
            >
              <Plus size={20} />
              Nueva Tarea
            </button>
          </div>
        </div>
      </header>

      {/* Barra de filtros */}
      <FilterBar 
        onShowStats={() => setIsStatsModalOpen(true)}
      />

      {/* Contenido principal */}
      <main className="container py-6">
        {filteredTasks.length === 0 ? (
          <EmptyState />
        ) : (
          <TaskList
            tasks={filteredTasks}
            onReorder={handleReorderTasks}
            onToggleStatus={handleToggleTaskStatus}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            enableDragAndDrop={filters.sortBy === 'order'}
          />
        )}
      </main>

      {/* Formulario de tareas */}
      <TaskForm
        task={editingTask}
        isOpen={isTaskFormOpen}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        onCancel={handleCloseForm}
      />

      {/* Modal de estadísticas */}
      <StatsModal 
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
      />

      {/* Notificaciones */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--border-radius-lg)',
            boxShadow: 'var(--shadow-lg)',
          },
          success: {
            iconTheme: {
              primary: 'var(--color-success)',
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: 'var(--color-error)',
              secondary: 'white',
            },
          },
        }}
      />
    </div>
  );
}

export default App;