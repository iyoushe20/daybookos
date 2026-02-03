import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Project {
  id: string;
  name: string;
  pod?: string;
  quarter?: string;
  status: 'active' | 'archived';
  createdAt: Date;
}

interface ProjectContextType {
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'status' | 'createdAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getProject: (id: string) => Project | undefined;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// Demo projects
const DEMO_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'User Authentication Redesign',
    pod: 'Frontend',
    quarter: 'Q1 2026',
    status: 'active',
    createdAt: new Date('2026-01-15'),
  },
  {
    id: 'proj-2',
    name: 'Payment Gateway Integration',
    pod: 'Backend',
    quarter: 'Q1 2026',
    status: 'active',
    createdAt: new Date('2026-01-20'),
  },
];

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(DEMO_PROJECTS);

  const addProject = useCallback((project: Omit<Project, 'id' | 'status' | 'createdAt'>) => {
    const newProject: Project = {
      ...project,
      id: `proj-${Date.now()}`,
      status: 'active',
      createdAt: new Date(),
    };
    setProjects(prev => [...prev, newProject]);
  }, []);

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setProjects(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates } : p))
    );
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  }, []);

  const getProject = useCallback(
    (id: string) => projects.find(p => p.id === id),
    [projects]
  );

  return (
    <ProjectContext.Provider
      value={{ projects, addProject, updateProject, deleteProject, getProject }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
}
