

import React from 'react';
import { Project, ProjectStatus, Priority, Resource, Task, TaskStatus } from '../../../types';
import { Edit, Trash2, CheckCircle, Circle } from 'lucide-react';

interface ProjectCardsProps {
    projects: Project[];
    tasks: Task[];
    resources: Resource[];
    onProjectClick: (project: Project) => void;
}

const getStatusAndPriorityStyles = (status: ProjectStatus, priority: Priority) => {
    const statusTagStyle: { [key in ProjectStatus]: string } = {
      [ProjectStatus.Active]: 'bg-status-green-bg text-status-green-text',
      [ProjectStatus.Planning]: 'bg-status-yellow-bg text-status-yellow-text',
      [ProjectStatus.Completed]: 'bg-status-blue-bg text-status-blue-text',
    };
    const priorityTagStyle: { [key in Priority]: string } = {
      [Priority.High]: 'bg-status-red-bg text-status-red-text',
      [Priority.Medium]: 'bg-status-yellow-bg text-status-yellow-text',
      [Priority.Low]: 'bg-status-purple-bg text-status-purple-text',
    };
    
    return { statusClass: statusTagStyle[status], priorityClass: priorityTagStyle[priority] };
};

const getProjectHealth = (project: Project, tasks: Task[], today: Date): 'green' | 'yellow' | 'red' => {
    const projectTasks = tasks.filter(t => t.projectId === project.id);
    
    const overdueTasks = projectTasks.filter(t => 
        t.endDate && new Date(t.endDate) < today && t.status !== TaskStatus.Done
    );
    
    if (overdueTasks.length > 0) {
        if (overdueTasks.some(t => t.priority === Priority.High)) return 'red';
        return 'yellow';
    }

    const projectStartDate = new Date(project.startDate);
    const projectEndDate = new Date(project.endDate);
    if (projectEndDate < projectStartDate) return 'green';

    const totalDuration = projectEndDate.getTime() - projectStartDate.getTime();
    if (totalDuration <= 0) return 'green';
    
    const timeElapsed = today.getTime() - projectStartDate.getTime();
    const timeRatio = Math.min(Math.max(timeElapsed / totalDuration, 0), 1);
    
    const progressRatio = project.progress / 100;

    if (progressRatio < timeRatio - 0.25) return 'red';
    if (progressRatio < timeRatio - 0.10) return 'yellow';
    
    return 'green';
};

const healthColorClasses = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
};


const Avatar: React.FC<{ initials: string, colorClass: string, title?: string }> = ({ initials, colorClass, title }) => (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ring-2 ring-white ${colorClass}`} title={title}>
        {initials}
    </div>
);

const avatarColors = ['bg-indigo-500', 'bg-teal-500', 'bg-amber-500', 'bg-rose-500', 'bg-cyan-500'];
const getAvatarColor = (id: string) => avatarColors[id.charCodeAt(id.length-1) % avatarColors.length];

export const ProjectCards: React.FC<ProjectCardsProps> = ({ projects, tasks, resources, onProjectClick }) => {
    const todayForHealth = new Date('2025-02-15');
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map(project => {
                const { manager } = project;
                const teamMembers = resources.filter(r => project.team.includes(r.id));
                const projectTasks = tasks.filter(t => t.projectId === project.id);
                const { statusClass, priorityClass } = getStatusAndPriorityStyles(project.status, project.priority);
                
                const formattedBudget = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0 }).format(project.budget);
                const startDate = new Date(project.startDate).toLocaleDateString('tr-TR');
                const endDate = new Date(project.endDate).toLocaleDateString('tr-TR');

                const health = getProjectHealth(project, tasks, todayForHealth);

                return (
                    <div 
                        key={project.id} 
                        onClick={() => onProjectClick(project)} 
                        className="bg-card-bg rounded-lg shadow-md-custom p-5 flex flex-col gap-4 hover:shadow-lg-custom hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                    >
                        {/* Card Header */}
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: project.color }}></div>
                                <h3 className="font-bold text-text-primary text-lg">{project.name}</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={(e) => e.stopPropagation()} className="text-text-secondary hover:text-project"><Edit size={18} /></button>
                                <button onClick={(e) => e.stopPropagation()} className="text-text-secondary hover:text-red-500"><Trash2 size={18} /></button>
                            </div>
                        </div>

                        {/* Project Info */}
                        <div>
                             <p className="text-sm text-text-secondary mb-2">{project.code}</p>
                             <div className="flex items-center gap-2">
                                <div className={`w-2.5 h-2.5 rounded-full ${healthColorClasses[health]}`} title={`Proje Sağlığı: ${health}`}></div>
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${statusClass}`}>
                                    {project.status}
                                </span>
                                 <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${priorityClass}`}>{project.priority}</span>
                            </div>
                        </div>

                        {/* Progress */}
                        <div>
                            <div className="flex justify-between items-center text-sm text-text-secondary mb-1">
                                <span>İlerleme</span>
                                <span className="font-semibold text-text-primary">{project.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="h-2 rounded-full" style={{ width: `${project.progress}%`, backgroundColor: project.color }}></div>
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-text-secondary">Başlangıç:</p>
                                <p className="font-semibold text-text-primary">{startDate}</p>
                            </div>
                            <div>
                                <p className="text-text-secondary">Bitiş:</p>
                                <p className="font-semibold text-text-primary">{endDate}</p>
                            </div>
                        </div>

                        {/* People */}
                        <div className="space-y-3 text-sm">
                            <div>
                                <p className="text-text-secondary mb-1">Proje Yöneticisi:</p>
                                {manager && (
                                    <div className="flex items-center gap-2">
                                        <Avatar initials={manager.initials} colorClass={getAvatarColor(manager.id)} title={manager.name} />
                                        <span className="font-medium text-text-primary">{manager.name}</span>
                                    </div>
                                )}
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <p className="text-text-secondary">Ekip Üyeleri:</p>
                                    <p className="text-text-secondary font-medium">{teamMembers.length} kişi</p>
                                </div>
                                <div className="flex -space-x-2">
                                    {teamMembers.map(member => (
                                         <Avatar key={member.id} initials={member.initials} colorClass={getAvatarColor(member.id)} title={member.name} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Budget */}
                        <div className="text-sm">
                            <p className="text-text-secondary">Bütçe:</p>
                            <p className="font-semibold text-text-primary">{formattedBudget}</p>
                        </div>

                        {/* Milestones */}
                        <div className="border-t pt-3 space-y-2 text-sm">
                             <p className="text-text-secondary font-semibold">Kilometre Taşları:</p>
                             {projectTasks.slice(0, 2).map(task => (
                                 <div key={task.id} className="flex items-center gap-2">
                                    {task.status === TaskStatus.Done 
                                        ? <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                                        : <Circle size={16} className="text-gray-400 flex-shrink-0" />
                                    }
                                    <span className={`text-text-primary ${task.status === TaskStatus.Done ? 'line-through text-text-secondary' : ''}`}>{task.title}</span>
                                 </div>
                             ))}
                             {projectTasks.length > 2 && (
                                 <p className="text-xs text-text-secondary ml-6">+ {projectTasks.length - 2} daha...</p>
                             )}
                        </div>

                    </div>
                );
            })}
        </div>
    );
};