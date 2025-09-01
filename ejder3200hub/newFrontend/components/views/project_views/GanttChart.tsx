

import React from 'react';
import { Project, ProjectStatus, Task, TaskStatus, Priority } from '../../../types';

interface GanttChartProps {
    projects: Project[];
    tasks: Task[];
}

const statusColors = {
    [ProjectStatus.Active]: 'bg-green-500',
    [ProjectStatus.Planning]: 'bg-yellow-500',
    [ProjectStatus.Completed]: 'bg-blue-500',
};

const healthColorClasses = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
};

// Helper to calculate date differences
const diffDays = (date1: Date, date2: Date) => {
    return Math.floor((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24));
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


export const GanttChart: React.FC<GanttChartProps> = ({ projects, tasks }) => {
    const allDates = projects.flatMap(p => [new Date(p.startDate), new Date(p.endDate)]);
    if (projects.length === 0) {
        return <div className="bg-card-bg p-6 rounded-lg shadow-md-custom text-center text-text-secondary">Gantt şeması için proje bulunmuyor.</div>
    }
    const timelineStart = new Date(Math.min(...allDates.map(d => d.getTime())));
    const timelineEnd = new Date(Math.max(...allDates.map(d => d.getTime())));
    timelineEnd.setDate(timelineEnd.getDate() + 30); // Add some padding
    const totalTimelineDays = diffDays(timelineStart, timelineEnd);
    const todayForHealth = new Date('2025-02-15');

    return (
        <div className="bg-card-bg p-6 rounded-lg shadow-md-custom overflow-x-auto custom-scrollbar">
            <h3 className="text-lg font-semibold mb-4">Proje Zaman Çizelgesi</h3>
            <div className="relative" style={{ minWidth: '800px' }}>
                {/* Month markers */}
                <div className="flex border-b pb-2 mb-2">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="flex-1 text-center text-sm text-text-secondary">{new Date(2024, i).toLocaleString('default', { month: 'short' })}</div>
                    ))}
                </div>
                <div className="space-y-3">
                    {projects.map(project => {
                        const projectStart = new Date(project.startDate);
                        const projectEnd = new Date(project.endDate);
                        
                        const startOffset = diffDays(timelineStart, projectStart);
                        const duration = diffDays(projectStart, projectEnd);
                        
                        const left = (startOffset / totalTimelineDays) * 100;
                        const width = (duration / totalTimelineDays) * 100;

                        const health = getProjectHealth(project, tasks, todayForHealth);

                        return (
                            <div key={project.id} className="flex items-center">
                                <div className="w-48 pr-4 text-sm font-medium truncate flex items-center gap-2" title={project.name}>
                                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${healthColorClasses[health]}`} title={`Health: ${health}`}></div>
                                    <span className="truncate">{project.name}</span>
                                </div>
                                <div className="flex-1 h-8 bg-gray-200 rounded-md relative group">
                                    <div
                                        className={`absolute h-full rounded-md ${statusColors[project.status]} transition-all duration-300`}
                                        style={{ left: `${left}%`, width: `${width}%` }}
                                    >
                                        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-white text-xs font-semibold truncate pr-2">{project.name}</div>
                                    </div>
                                    {/* Tooltip */}
                                    <div className="absolute left-0 top-full mt-2 w-max p-2 bg-gray-800 text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                                        <p><strong>Status:</strong> {project.status}</p>
                                        <p><strong>Progress:</strong> {project.progress}%</p>
                                        <p><strong>Dates:</strong> {project.startDate} to {project.endDate}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};