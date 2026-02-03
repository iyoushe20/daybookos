import React, { createContext, useContext, useState, useCallback } from 'react';

export type TaskCategory = 
  | 'action_item' 
  | 'follow_up' 
  | 'meeting' 
  | 'decision' 
  | 'writing' 
  | 'blocker' 
  | 'what_next';

export type TaskStatus = 'open' | 'completed';

export interface Task {
  id: string;
  text: string;
  category: TaskCategory;
  projectId: string;
  logId?: string;
  status: TaskStatus;
  source?: string;
  confidence?: number;
  metadata?: {
    person?: string;
    riskLevel?: 'low' | 'medium' | 'high';
    documentType?: string;
  };
  createdAt: Date;
  completedAt?: Date;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  getTasksByProject: (projectId: string) => Task[];
  getOpenTasks: () => Task[];
  getTasksByCategory: (category: TaskCategory) => Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Demo tasks
const DEMO_TASKS: Task[] = [
  {
    id: 'task-1',
    text: 'Update Jira ticket STATUS-123',
    category: 'action_item',
    projectId: 'proj-2',
    status: 'open',
    source: 'Need to update Jira ticket STATUS-123',
    confidence: 95,
    createdAt: new Date(),
  },
  {
    id: 'task-2',
    text: 'Follow up with Meha on API docs',
    category: 'follow_up',
    projectId: 'proj-2',
    status: 'open',
    source: 'Need to follow up on API docs',
    confidence: 88,
    metadata: { person: 'Meha' },
    createdAt: new Date(),
  },
  {
    id: 'task-3',
    text: 'Follow up with Raj on PRD review',
    category: 'follow_up',
    projectId: 'proj-1',
    status: 'open',
    source: 'PRD is pending review from Raj',
    confidence: 92,
    metadata: { person: 'Raj' },
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: 'task-4',
    text: 'Blocked on legal sign-off for contract',
    category: 'blocker',
    projectId: 'proj-2',
    status: 'open',
    source: 'Blocked on legal sign-off for contract',
    confidence: 98,
    metadata: { riskLevel: 'high' },
    createdAt: new Date(Date.now() - 3 * 86400000),
  },
  {
    id: 'task-5',
    text: 'Vendor refused to change pricing model',
    category: 'blocker',
    projectId: 'proj-2',
    status: 'open',
    source: 'Vendor refused to change pricing model',
    confidence: 95,
    metadata: { riskLevel: 'medium' },
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: 'task-6',
    text: 'Schedule recon discussion',
    category: 'meeting',
    projectId: 'proj-2',
    status: 'open',
    source: 'Should schedule recon discussion',
    confidence: 72,
    createdAt: new Date(),
  },
  {
    id: 'task-7',
    text: 'PRD review pending',
    category: 'writing',
    projectId: 'proj-1',
    status: 'open',
    source: 'PRD review pending',
    confidence: 85,
    metadata: { documentType: 'PRD' },
    createdAt: new Date(Date.now() - 2 * 86400000),
  },
  {
    id: 'task-8',
    text: 'Finalized API contract with vendor',
    category: 'decision',
    projectId: 'proj-2',
    status: 'completed',
    confidence: 90,
    createdAt: new Date(Date.now() - 86400000),
    completedAt: new Date(),
  },
];

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(DEMO_TASKS);

  const addTask = useCallback((task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      createdAt: new Date(),
    };
    setTasks(prev => [...prev, newTask]);
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, ...updates } : t))
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const toggleTaskStatus = useCallback((id: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          const newStatus = t.status === 'open' ? 'completed' : 'open';
          return {
            ...t,
            status: newStatus,
            completedAt: newStatus === 'completed' ? new Date() : undefined,
          };
        }
        return t;
      })
    );
  }, []);

  const getTasksByProject = useCallback(
    (projectId: string) => tasks.filter(t => t.projectId === projectId),
    [tasks]
  );

  const getOpenTasks = useCallback(
    () => tasks.filter(t => t.status === 'open'),
    [tasks]
  );

  const getTasksByCategory = useCallback(
    (category: TaskCategory) => tasks.filter(t => t.category === category),
    [tasks]
  );

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        getTasksByProject,
        getOpenTasks,
        getTasksByCategory,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
