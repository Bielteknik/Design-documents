import React, { useState } from 'react';
import { Project, Task, TaskStatus, Resource } from '../../../types';
import { CheckCircle, Circle, PlayCircle, ChevronDown } from 'lucide-react';

interface TimelineViewProps {
    projects: Project[];
    tasks: Task[];
    resources: Resource[];
}

const statusIcons = {
    [TaskStatus.ToDo]: <Circle className="text-gray-400" size={18}/>,
    [TaskStatus.InProgress]: <PlayCircle className="text-blue-500" size={18}/>,
    [TaskStatus.Done]: <CheckCircle className="text-green-500" size={18}/>,
};

export const TimelineView: React.FC<TimelineViewProps> = ({ projects, tasks, resources }) => {
    const [openProjects, setOpenProjects] = useState<string[]>([]);

    const toggleProject = (projectId: string) => {
        setOpenProjects(prev => 
            prev.includes(projectId) 
                ? prev.filter(id => id !== projectId)
                : [...prev, projectId]
        );
    };

    const projectTasks = projects.map(project => ({
        ...project,
        tasks: tasks.filter(task => task.projectId === project.id)
    }));

    return (
        <div className="space-y-2">
            {projectTasks.map(project => {
                const isOpen = openProjects.includes(project.id);
                return (
                    <div key={project.id} className="bg-card-bg border rounded-lg overflow-hidden shadow-sm transition-shadow hover:shadow-md">
                        <button 
                            onClick={() => toggleProject(project.id)}
                            className="w-full flex justify-between items-center p-3 hover:bg-gray-50 focus:outline-none"
                            aria-expanded={isOpen}
                            aria-controls={`project-timeline-${project.id}`}
                        >
                            <h4 className="text-sm font-semibold text-project">{project.name}</h4>
                            <ChevronDown 
                                size={20} 
                                className={`text-text-secondary transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                            />
                        </button>
                        {isOpen && (
                            <div id={`project-timeline-${project.id}`} className="p-4 pt-2 border-t">
                                <div className="relative pl-6 border-l-2 border-gray-200 mt-2">
                                    {project.tasks.length > 0 ? project.tasks.map((task, index) => (
                                        <div key={task.id} className={`relative ${index < project.tasks.length - 1 ? 'pb-4' : ''}`}>
                                            <div className="absolute -left-[15px] top-0 h-full flex items-start">
                                                 <div className="w-[28px] h-[28px] bg-white rounded-full flex items-center justify-center ring-2 ring-gray-200">
                                                    {statusIcons[task.status]}
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <p className="font-semibold text-sm text-text-primary">{task.title}</p>
                                                {/* FIX: Changed task.assignee to task.assigneeId to correctly look up the resource by ID. */}
                                                <p className="text-xs text-text-secondary">Atanan: {resources.find(r => r.id === task.assigneeId)?.name || 'Bilinmiyor'}</p>
                                            </div>
                                        </div>
                                    )) : (
                                        <p className="text-sm text-text-secondary ml-4">Bu proje için görev bulunmuyor.</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};