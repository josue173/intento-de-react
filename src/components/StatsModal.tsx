import React from 'react';
import { X, CheckCircle, Clock, Circle, AlertTriangle, BarChart3 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getPriorityColor, getCategoryColor } from '../utils';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose }) => {
  const { getTaskStats, tasks } = useApp();
  const stats = getTaskStats();

  if (!isOpen) return null;

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-modal p-4">
      <div className="bg-surface rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BarChart3 size={24} />
            Estadísticas de Tareas
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {/* Resumen general */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Resumen General</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-primary bg-opacity-10 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">{stats.total}</div>
                <div className="text-sm text-secondary">Total de tareas</div>
              </div>
              <div className="bg-yellow-500 bg-opacity-10 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600 mb-1">{stats.pending}</div>
                <div className="text-sm text-secondary flex items-center justify-center gap-1">
                  <Circle size={14} />
                  Pendientes
                </div>
              </div>
              <div className="bg-blue-500 bg-opacity-10 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">{stats.inProgress}</div>
                <div className="text-sm text-secondary flex items-center justify-center gap-1">
                  <Clock size={14} />
                  En progreso
                </div>
              </div>
              <div className="bg-green-500 bg-opacity-10 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">{stats.completed}</div>
                <div className="text-sm text-secondary flex items-center justify-center gap-1">
                  <CheckCircle size={14} />
                  Completadas
                </div>
              </div>
            </div>
          </div>

          {/* Progreso y alertas */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Tasa de completado */}
            <div className="bg-background-secondary rounded-lg p-6">
              <h4 className="font-semibold mb-3">Tasa de Completado</h4>
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div 
                    className="bg-green-500 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
                <div className="text-center text-2xl font-bold text-green-600">{completionRate}%</div>
              </div>
            </div>

            {/* Tareas vencidas */}
            <div className="bg-background-secondary rounded-lg p-6">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle size={20} className="text-red-500" />
                Tareas Vencidas
              </h4>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-500 mb-2">{stats.overdue}</div>
                <div className="text-sm text-secondary">
                  {stats.overdue === 0 ? '¡Excelente! No tienes tareas vencidas' : 
                   stats.overdue === 1 ? 'Tienes 1 tarea vencida' : 
                   `Tienes ${stats.overdue} tareas vencidas`}
                </div>
              </div>
            </div>
          </div>

          {/* Estadísticas por categoría */}
          <div className="mb-8">
            <h4 className="font-semibold mb-4">Tareas por Categoría</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(stats.byCategory).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: getCategoryColor(category as any) }}
                    ></div>
                    <span className="capitalize">{category === 'work' ? 'Trabajo' :
                                                   category === 'personal' ? 'Personal' :
                                                   category === 'shopping' ? 'Compras' :
                                                   category === 'health' ? 'Salud' :
                                                   category === 'education' ? 'Educación' :
                                                   'Otros'}</span>
                  </div>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Estadísticas por prioridad */}
          <div>
            <h4 className="font-semibold mb-4">Tareas por Prioridad</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(stats.byPriority).map(([priority, count]) => (
                <div key={priority} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: getPriorityColor(priority as any) }}
                    ></div>
                    <span className="capitalize">{priority === 'low' ? 'Baja' :
                                                   priority === 'medium' ? 'Media' :
                                                   priority === 'high' ? 'Alta' :
                                                   'Urgente'}</span>
                  </div>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Distribución visual */}
          <div className="mt-8 pt-6 border-t border-border">
            <h4 className="font-semibold mb-4">Distribución de Estados</h4>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {stats.total > 0 && (
                <>
                  {stats.pending > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">Pendientes ({Math.round((stats.pending / stats.total) * 100)}%)</span>
                    </div>
                  )}
                  {stats.inProgress > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">En progreso ({Math.round((stats.inProgress / stats.total) * 100)}%)</span>
                    </div>
                  )}
                  {stats.completed > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Completadas ({Math.round((stats.completed / stats.total) * 100)}%)</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-background-secondary rounded-b-xl">
          <button
            onClick={onClose}
            className="btn btn-primary w-full"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};