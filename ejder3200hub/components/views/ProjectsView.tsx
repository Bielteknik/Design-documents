

import React, { useState, useMemo } from 'react';
import { Project, Task, Resource, TaskStatus, Idea, IdeaStatus, Priority, ProjectStatus, Evaluation, Comment } from '../../types';
import { LayoutGrid, GanttChartSquare, KanbanSquare, Milestone, Lightbulb, Filter, X, Archive } from 'lucide-react';
import { ProjectCards } from './project_views/ProjectCards';
import { GanttChart } from './project_views/GanttChart';
import { KanbanBoard } from './project_views/KanbanBoard';
import { TimelineView } from './project_views/TimelineView';
import { IdeaBoard } from './project_views/IdeaBoard';


type ProjectViewMode = 'ideas' | 'cards' | 'gantt' | 'kanban' | 'timeline';

interface ProjectsViewProps {
    projects: Project[];
    tasks: Task[];
    resources: Resource[];
    updateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
    ideas: Idea[];
    updateIdeaStatus: (ideaId: string, newStatus: IdeaStatus) => void;
    onIdeaClick: (idea: Idea) => void;
    onProjectClick: (project: Project) => void;
    convertIdeaToProject: (ideaId: string) => void;
    evaluations: Evaluation[];
    comments: Comment[];
}

const viewOptions: { id: ProjectViewMode; name: string; icon: React.ElementType }[] = [
    { id: 'ideas', name: 'Fikirler', icon: Lightbulb },
    { id: 'cards', name: 'Projeler', icon: LayoutGrid },
    { id: 'gantt', name: 'Gantt', icon: GanttChartSquare },
    { id: 'kanban', name: 'Kanban', icon: KanbanSquare },
    { id: 'timeline', name: 'Zaman Çizelgesi', icon: Milestone },
];

export const ProjectsView: React.FC<ProjectsViewProps> = React.memo(({ projects, tasks, resources, updateTaskStatus, ideas, updateIdeaStatus, onIdeaClick, onProjectClick, convertIdeaToProject, evaluations, comments }) => {
    const [viewMode, setViewMode] = useState<ProjectViewMode>('ideas');
    const [projectFilters, setProjectFilters] = useState({
        manager: 'all',
        status: 'all',
        priority: 'all',
    });
    const [showArchivedIdeas, setShowArchivedIdeas] = useState(false);

    const handleProjectFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProjectFilters(prev => ({...prev, [name]: value}));
    }

    const clearProjectFilters = () => {
        setProjectFilters({ manager: 'all', status: 'all', priority: 'all' });
    }

    const filteredProjects = useMemo(() => {
        return projects.filter(p => {
            const managerMatch = projectFilters.manager === 'all' || p.manager.id === projectFilters.manager;
            const statusMatch = projectFilters.status === 'all' || p.status === projectFilters.status;
            const priorityMatch = projectFilters.priority === 'all' || p.priority === projectFilters.priority;
            return managerMatch && statusMatch && priorityMatch;
        });
    }, [projects, projectFilters]);

    const filteredIdeas = useMemo(() => {
        if (showArchivedIdeas) {
            return ideas;
        }
        return ideas.filter(idea => idea.status !== IdeaStatus.Archived);
    }, [ideas, showArchivedIdeas]);

    const isProjectFilterActive = projectFilters.manager !== 'all' || projectFilters.status !== 'all' || projectFilters.priority !== 'all';

    const uniqueManagers = useMemo(() => {
        const managerIds = new Set(projects.map(p => p.manager.id));
        return resources.filter(r => managerIds.has(r.id));
    }, [projects, resources]);

    const renderFilters = () => {
        if (viewMode === 'ideas') {
            return (
                <div className="bg-main-bg p-3 rounded-lg border flex items-center gap-4">
                    <div className="flex items-center gap-2 font-semibold text-text-secondary">
                        <Filter size={16} />
                        <span>Filtrele:</span>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="showArchived"
                            checked={showArchivedIdeas}
                            onChange={(e) => setShowArchivedIdeas(e.target.checked)}
                            className="h-4 w-4 rounded border-border-color text-project focus:ring-project"
                        />
                         <label htmlFor="showArchived" className="ml-2 text-sm font-medium text-text-secondary flex items-center gap-1.5">
                            <Archive size={14} /> Arşivlenmiş Fikirleri Göster
                        </label>
                    </div>
                </div>
            );
        }
        return (
             <div className="bg-main-bg p-3 rounded-lg border flex flex-col sm:flex-row items-center gap-3">
                    <div className="flex items-center gap-2 font-semibold text-text-secondary">
                        <Filter size={16} />
                        <span>Filtrele:</span>
                    </div>
                    <select name="manager" value={projectFilters.manager} onChange={handleProjectFilterChange} className="w-full sm:w-auto p-2 border border-border-color rounded-md bg-card-bg text-sm focus:ring-project focus:border-project">
                        <option value="all">Tüm Yöneticiler</option>
                        {uniqueManagers.map(manager => (
                             <option key={manager.id} value={manager.id}>{manager.name}</option>
                        ))}
                    </select>
                    <select name="status" value={projectFilters.status} onChange={handleProjectFilterChange} className="w-full sm:w-auto p-2 border border-border-color rounded-md bg-card-bg text-sm focus:ring-project focus:border-project">
                        <option value="all">Tüm Durumlar</option>
                        {Object.values(ProjectStatus).map(status => <option key={status} value={status}>{status}</option>)}
                    </select>
                    <select name="priority" value={projectFilters.priority} onChange={handleProjectFilterChange} className="w-full sm:w-auto p-2 border border-border-color rounded-md bg-card-bg text-sm focus:ring-project focus:border-project">
                        <option value="all">Tüm Öncelikler</option>
                        {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    {isProjectFilterActive && (
                        <button onClick={clearProjectFilters} className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800 sm:ml-auto p-2 rounded-md hover:bg-red-50 transition-colors">
                            <X size={14} /> Temizle
                        </button>
                    )}
                </div>
        );
    }

    const renderActiveView = () => {
        switch (viewMode) {
            case 'ideas':
                return <IdeaBoard 
                            ideas={filteredIdeas} 
                            updateIdeaStatus={updateIdeaStatus} 
                            onCardClick={onIdeaClick} 
                            onConvertToProject={convertIdeaToProject}
                            evaluations={evaluations}
                            comments={comments}
                            resources={resources}
                        />;
            case 'gantt':
                return <GanttChart projects={filteredProjects} tasks={tasks} />;
            case 'kanban':
                return <KanbanBoard tasks={tasks} projects={filteredProjects} resources={resources} updateTaskStatus={updateTaskStatus} />;
            case 'timeline':
                return <TimelineView projects={filteredProjects} tasks={tasks} resources={resources} />;
            case 'cards':
            default:
                return <ProjectCards projects={filteredProjects} tasks={tasks} resources={resources} onProjectClick={onProjectClick} />;
        }
    };


    return (
        <div className="animate-fadeIn space-y-6">
            <div className="space-y-4">
                <div className="border-b border-border-color">
                    <nav className="-mb-px flex items-center space-x-4 overflow-x-auto" aria-label="Project Views">
                        {viewOptions.map(option => {
                            const isActive = viewMode === option.id;
                            return (
                                <button
                                    key={option.id}
                                    onClick={() => setViewMode(option.id)}
                                    className={`flex-shrink-0 flex items-center gap-2 px-3 py-3 text-sm font-medium border-b-2 transition-colors duration-200 focus:outline-none 
                                        ${
                                        isActive
                                            ? 'border-b-project text-project'
                                            : 'border-transparent text-text-secondary hover:text-project focus:border-b-project'
                                    }`}
                                    aria-pressed={isActive}
                                >
                                    <option.icon size={16} />
                                    <span>{option.name}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>
                {renderFilters()}
            </div>
            
            <div>{renderActiveView()}</div>
        </div>
    );
});
