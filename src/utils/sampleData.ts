import { Task } from '../types';
import { generateId } from './index';

export const createSampleTasks = (): Task[] => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  const lastWeek = new Date(now);
  lastWeek.setDate(lastWeek.getDate() - 7);

  const sampleTasks: Task[] = [
    {
      id: generateId(),
      title: 'Revisar y responder emails importantes',
      description: 'Revisar la bandeja de entrada y responder a los emails más importantes del día. Priorizar clientes y proveedores.',
      status: 'pending',
      priority: 'high',
      category: 'work',
      dueDate: tomorrow,
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // hace 2 horas
      updatedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000), // hace 1 hora
      tags: ['comunicación', 'emails', 'urgente'],
      assignedTo: 'Juan Pérez',
      order: 0
    },
    {
      id: generateId(),
      title: 'Completar presentación para el cliente',
      description: 'Finalizar las últimas diapositivas de la presentación para la reunión del viernes. Incluir gráficos de resultados y propuestas.',
      status: 'in-progress',
      priority: 'urgent',
      category: 'work',
      dueDate: nextWeek,
      createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000), // hace 1 día
      updatedAt: new Date(now.getTime() - 30 * 60 * 1000), // hace 30 minutos
      tags: ['presentación', 'cliente', 'diseño'],
      assignedTo: 'María García',
      order: 1
    },
    {
      id: generateId(),
      title: 'Comprar ingredientes para la cena',
      description: 'Lista de compras: tomates, cebolla, ajo, pasta, queso parmesano, aceite de oliva, y hierbas frescas.',
      status: 'pending',
      priority: 'medium',
      category: 'shopping',
      dueDate: tomorrow,
      createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000), // hace 3 horas
      updatedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
      tags: ['comida', 'supermercado', 'cena'],
      order: 2
    },
    {
      id: generateId(),
      title: 'Ejercicio cardiovascular - 45 minutos',
      description: 'Sesión de cardio en el gimnasio: 20 minutos en cinta, 15 minutos en bicicleta elíptica, 10 minutos de enfriamiento.',
      status: 'completed',
      priority: 'medium',
      category: 'health',
      dueDate: lastWeek,
      createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // hace 1 semana
      updatedAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000), // hace 6 días
      tags: ['ejercicio', 'gimnasio', 'salud'],
      order: 3
    },
    {
      id: generateId(),
      title: 'Estudiar capítulo 5 de React',
      description: 'Leer y practicar los ejercicios del capítulo sobre hooks avanzados: useReducer, useContext, y custom hooks.',
      status: 'in-progress',
      priority: 'high',
      category: 'education',
      dueDate: nextWeek,
      createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000), // hace 12 horas
      updatedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // hace 2 horas
      tags: ['programación', 'react', 'hooks', 'aprendizaje'],
      assignedTo: 'Carlos Rodríguez',
      order: 4
    },
    {
      id: generateId(),
      title: 'Llamar al dentista para cita',
      description: 'Programar limpieza dental semestral. Preguntar sobre disponibilidad para la próxima semana.',
      status: 'pending',
      priority: 'low',
      category: 'health',
      createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000), // hace 4 horas
      updatedAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
      tags: ['salud', 'dental', 'cita'],
      order: 5
    },
    {
      id: generateId(),
      title: 'Organizar escritorio de trabajo',
      description: 'Limpiar y organizar el espacio de trabajo: clasificar documentos, ordenar cajones, limpiar pantalla y teclado.',
      status: 'completed',
      priority: 'low',
      category: 'personal',
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // hace 2 días
      updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // hace 1 día
      tags: ['organización', 'limpieza', 'productividad'],
      order: 6
    },
    {
      id: generateId(),
      title: 'Revisar facturas pendientes',
      description: 'Verificar y procesar las facturas del mes. Marcar las que están próximas a vencer y programar pagos.',
      status: 'pending',
      priority: 'urgent',
      category: 'work',
      dueDate: new Date(now.getTime() - 24 * 60 * 60 * 1000), // vencida ayer
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // hace 5 días
      updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      tags: ['finanzas', 'facturas', 'pagos', 'vencida'],
      assignedTo: 'Ana López',
      order: 7
    },
    {
      id: generateId(),
      title: 'Planificar viaje de fin de semana',
      description: 'Investigar destinos cercanos, revisar el clima, hacer reservas de hotel y planificar actividades.',
      status: 'pending',
      priority: 'low',
      category: 'personal',
      dueDate: nextWeek,
      createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000), // hace 6 horas
      updatedAt: new Date(now.getTime() - 6 * 60 * 60 * 1000),
      tags: ['viaje', 'planificación', 'fin de semana', 'reservas'],
      order: 8
    },
    {
      id: generateId(),
      title: 'Actualizar portfolio personal',
      description: 'Agregar los últimos proyectos completados, actualizar la sección de habilidades y mejorar el diseño responsive.',
      status: 'in-progress',
      priority: 'medium',
      category: 'work',
      dueDate: nextWeek,
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // hace 3 días
      updatedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000), // hace 1 hora
      tags: ['portfolio', 'diseño web', 'proyectos', 'responsive'],
      order: 9
    }
  ];

  return sampleTasks;
};

// Función para cargar datos de ejemplo si no hay tareas guardadas
export const loadSampleDataIfEmpty = () => {
  const existingTasks = localStorage.getItem('task-manager-tasks');
  
  if (!existingTasks || JSON.parse(existingTasks).length === 0) {
    const sampleTasks = createSampleTasks();
    localStorage.setItem('task-manager-tasks', JSON.stringify(sampleTasks));
    return sampleTasks;
  }
  
  return null;
};