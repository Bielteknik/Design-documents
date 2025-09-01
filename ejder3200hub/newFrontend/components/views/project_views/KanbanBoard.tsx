

import React, { useState, useEffect } from 'react';
import { Task, TaskStatus, Priority, Project, Resource } from '../../../types';

interface KanbanBoardProps {
    tasks: Task[];
    projects: Project[];
    resources: Resource[];
    updateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
}

const statusConfig = {
    [TaskStatus.ToDo]: { title: 'Yapılacak', color: 'bg-gray-400' },
    [TaskStatus.InProgress]: { title: 'Devam Ediyor', color: 'bg-blue-500' },
    [TaskStatus.Done]: { title: 'Tamamlandı', color: 'bg-green-500' },
};

const tagColors: { [key: string]: string } = {
    'Frontend': 'bg-status-blue-bg text-status-blue-text',
    'Backend': 'bg-status-green-bg text-status-green-text',
    'UI/UX': 'bg-status-purple-bg text-status-purple-text',
};

const TaskCard: React.FC<{ task: Task; resources: Resource[] }> = ({ task, resources }) => {
    const onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData("text", task.id);
    };
    
    const { assignee, project } = task;

    const formattedEndDate = task.endDate 
        ? new Date(task.endDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })
        : null;

    const daysRemaining = task.endDate ? Math.ceil((new Date(task.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;
    
    let daysRemainingText = '';
    let daysRemainingColor = 'text-text-secondary';
    if (daysRemaining !== null) {
        if (daysRemaining > 7) {
            daysRemainingText = `${daysRemaining} gün kaldı`;
        } else if (daysRemaining > 0) {
            daysRemainingText = `${daysRemaining} gün kaldı`;
            daysRemainingColor = 'text-yellow-600';
        } else if (daysRemaining === 0) {
            daysRemainingText = 'Son gün';
            daysRemainingColor = 'text-red-600';
        } else {
            daysRemainingText = `${Math.abs(daysRemaining)} gün geçti`;
            daysRemainingColor = 'text-red-700 font-bold';
        }
    }

    const getStatusPillStyle = (status: TaskStatus) => {
        switch(status) {
            case TaskStatus.InProgress: return 'bg-status-yellow-bg text-status-yellow-text';
            case TaskStatus.Done: return 'bg-status-green-bg text-status-green-text';
            case TaskStatus.ToDo: return 'bg-status-blue-bg text-status-blue-text';
            default: return '';
        }
    }

    return (
        <div 
            draggable 
            onDragStart={onDragStart}
            className="bg-card-bg p-4 rounded-lg shadow-md-custom text-text-primary flex flex-col gap-3 cursor-grab active:cursor-grabbing border-l-4"
            style={{ borderLeftColor: project?.color || '#A0AEC0' }}
        >
            <h4 className="font-bold text-md">{task.title}</h4>
            
            {task.description && (
                 <p className="text-sm text-text-secondary leading-snug line-clamp-2">{task.description}</p>
            )}

            {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {task.tags.map(tag => (
                        <span key={tag} className={`px-2 py-1 text-xs font-semibold rounded-md ${tagColors[tag] || 'bg-main-bg text-text-secondary'}`}>
                            {tag}
                        </span>
                    ))}
                </div>
            )}
           
            {task.progress !== undefined && (
                 <div>
                    <div className="flex justify-between items-center text-xs mb-1">
                        <span className="text-text-secondary">İlerleme</span>
                        <span className="font-semibold">{task.progress}%</span>
                    </div>
                    <div className="w-full bg-main-bg rounded-full h-1.5">
                        <div className="h-1.5 rounded-full" style={{ width: `${task.progress}%`, backgroundColor: project?.color || '#F97316' }}></div>
                    </div>
                </div>
            )}
            
            <div className="flex justify-between items-center border-t border-border-color pt-3 mt-auto">
                <div className="flex items-center gap-2">
                    {assignee && (
                        <img 
                            src={`https://picsum.photos/seed/${assignee.id}/24/24`}
                            alt={assignee.name}
                            title={assignee.name}
                            className="w-6 h-6 rounded-full"
                        />
                    )}
                    {formattedEndDate && <span className={`text-xs font-medium ${daysRemainingColor}`}>{formattedEndDate} ({daysRemainingText})</span>}
                </div>
                 <span className={`px-2 py-1 rounded-md font-semibold text-xs ${getStatusPillStyle(task.status)}`}>{task.status}</span>
            </div>
        </div>
    );
};

interface KanbanColumnProps {
    status: TaskStatus;
    tasks: Task[];
    projects: Project[];
    resources: Resource[];
    onDrop: (e: React.DragEvent<HTMLDivElement>, status: TaskStatus) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ status, tasks, projects, resources, onDrop }) => {
    const [isOver, setIsOver] = useState(false);

    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(true);
    };

    const onDragLeave = () => setIsOver(false);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(false);
        onDrop(e, status);
    };

    const config = statusConfig[status];

    return (
        <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={handleDrop}
            className={`bg-main-bg rounded-lg p-4 transition-colors ${isOver ? 'bg-status-purple-bg' : ''}`}
        >
            <div className="flex items-center gap-2 mb-4">
                <div className={`w-2 h-2 rounded-full ${config.color}`}></div>
                <h3 className="font-bold text-text-primary">{config.title}</h3>
                <span className="text-sm bg-border-color text-text-secondary rounded-full px-2 py-0.5">{tasks.length}</span>
            </div>
            <div className="space-y-4">
                {tasks.map(task => {
                    return <TaskCard key={task.id} task={task} resources={resources} />
                })}
            </div>
        </div>
    );
};

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, projects, resources, updateTaskStatus }) => {
    
    const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: TaskStatus) => {
        const taskId = e.dataTransfer.getData("text");
        if (taskId) {
            const task = tasks.find(t => t.id === taskId);
            if (task && task.status !== newStatus) {
                 updateTaskStatus(taskId, newStatus);
            }
        }
    };
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(TaskStatus).map(status => (
                <KanbanColumn
                    key={status}
                    status={status}
                    tasks={tasks.filter(t => t.status === status)}
                    projects={projects}
                    resources={resources}
                    onDrop={handleDrop}
                />
            ))}
        </div>
    );
};
