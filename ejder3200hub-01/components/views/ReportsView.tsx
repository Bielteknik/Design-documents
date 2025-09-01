

import React from 'react';
import { Project, Task, ProjectStatus, TaskStatus, Resource } from '../../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Briefcase, CheckCircle, AlertTriangle, Clock, BarChart2 } from 'lucide-react';

interface ReportsViewProps {
    projects: Project[];
    tasks: Task[];
    resources: Resource[];
}

const KpiCard: React.FC<{ title: string; value: string | number; icon: React.ElementType; color: string }> = ({ title, value, icon: Icon, color }) => (
    <div className="bg-card-bg p-6 rounded-lg shadow-md-custom flex items-center gap-4">
        <div className={`p-3 rounded-full`} style={{ backgroundColor: `${color}1A`}}>
             <Icon size={24} style={{ color: color }}/>
        </div>
        <div>
            <p className="text-sm text-text-secondary">{title}</p>
            <p className="text-2xl font-bold text-text-primary">{value}</p>
        </div>
    </div>
);

const ResourceHeatmap: React.FC<{ resources: Resource[]; tasks: Task[] }> = ({ resources, tasks }) => {
    const today = new Date('2025-08-15'); // Fixed date for consistent demo
    const startOfWeek = new Date(today);
    startOfWeek.setDate(startOfWeek.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1)); // Set to Monday

    const weekDates = Array.from({ length: 7 }).map((_, i) => {
        const date = new Date(startOfWeek);
        date.setDate(date.getDate() + i);
        return date;
    });

    const getLoadForDay = (resource: Resource, date: Date) => {
        let dailyLoad = 0;
        const dateStr = date.toISOString().split('T')[0];
        
        tasks.forEach(task => {
            if (task.assigneeId === resource.id && task.startDate && task.endDate && task.estimatedHours) {
                const startDate = new Date(task.startDate);
                const endDate = new Date(task.endDate);
                if (date >= startDate && date <= endDate) {
                    const durationDays = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24) + 1;
                    const dailyHours = task.estimatedHours / durationDays;
                    dailyLoad += dailyHours;
                }
            }
        });
        return dailyLoad;
    };
    
    const getUtilizationColor = (utilization: number) => {
        if (utilization > 100) return 'bg-red-500';
        if (utilization > 80) return 'bg-yellow-500';
        if (utilization > 0) return 'bg-green-500';
        return 'bg-main-bg';
    };

    return (
        <div className="bg-card-bg p-6 rounded-lg shadow-md-custom overflow-x-auto">
            <h3 className="text-lg font-semibold mb-4">Kaynak Kullanım Isı Haritası (Haftalık)</h3>
            <div className="grid grid-cols-8 gap-1 min-w-[800px]">
                <div />
                {weekDates.map(date => (
                    <div key={date.toISOString()} className="text-center font-bold text-sm text-text-secondary">
                        <p>{date.toLocaleDateString('tr-TR', { weekday: 'short' })}</p>
                        <p>{date.getDate()}</p>
                    </div>
                ))}

                {resources.map(resource => (
                    <React.Fragment key={resource.id}>
                        <div className="font-semibold text-sm text-right pr-2 py-2 truncate">{resource.name}</div>
                        {weekDates.map(date => {
                            const dailyLoad = getLoadForDay(resource, date);
                            const dailyCapacity = resource.weeklyHours / 5; // Assume 5-day work week
                            const utilization = dailyCapacity > 0 ? (dailyLoad / dailyCapacity) * 100 : 0;
                            const color = getUtilizationColor(utilization);
                            
                            return (
                                <div key={date.toISOString()} className={`rounded-md p-1 h-10 group relative`}>
                                     <div className={`w-full h-full ${color} opacity-70`}></div>
                                     <div className="absolute inset-0 p-2 opacity-0 group-hover:opacity-100 bg-black/50 text-white text-xs flex flex-col justify-center items-center transition-opacity">
                                        <p>{Math.round(utilization)}%</p>
                                        <p>{dailyLoad.toFixed(1)} sa</p>
                                    </div>
                                </div>
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

const renderCustomizedLabel = ({ name, percent }: { name: string; percent?: number }) => {
    if (percent === undefined) {
        return name;
    }
    return `${name} ${(percent * 100).toFixed(0)}%`;
};

export const ReportsView: React.FC<ReportsViewProps> = React.memo(({ projects, tasks, resources }) => {
    const totalProjects = projects.length;
    const completedProjects = projects.filter(p => p.status === ProjectStatus.Completed).length;
    const completionRate = totalProjects > 0 ? ((completedProjects / totalProjects) * 100).toFixed(0) : 0;

    const today = new Date('2025-02-15');
    const delayedProjects = projects.filter(p => {
        if (p.status === ProjectStatus.Completed) return false;
        
        const projectTasks = tasks.filter(t => t.projectId === p.id);
        const hasOverdueTasks = projectTasks.some(t => 
            t.endDate && new Date(t.endDate) < today && t.status !== TaskStatus.Done
        );
        if(hasOverdueTasks) return true;

        const startDate = new Date(p.startDate);
        const endDate = new Date(p.endDate);
        const totalDuration = endDate.getTime() - startDate.getTime();
        if (totalDuration <= 0) return false;
        
        const timeElapsed = today.getTime() - startDate.getTime();
        const timeRatio = Math.max(0, timeElapsed / totalDuration);
        
        return p.progress / 100 < timeRatio - 0.1;
    }).length;
    
    const averageProgress = totalProjects > 0 ? (projects.reduce((sum, p) => sum + p.progress, 0) / totalProjects).toFixed(0) : 0;

    const kpiData = [
        { title: 'Toplam Proje', value: totalProjects, icon: Briefcase, color: 'var(--color-project)' },
        { title: 'Tamamlanma Oranı', value: `${completionRate}%`, icon: CheckCircle, color: 'var(--color-task)' },
        { title: 'Geciken Projeler', value: delayedProjects, icon: AlertTriangle, color: '#EF4444' },
        { title: 'Ortalama İlerleme', value: `${averageProgress}%`, icon: BarChart2, color: 'var(--color-event)' },
    ];

    const projectStatusData = Object.values(ProjectStatus).map(status => ({
        name: status,
        value: projects.filter(p => p.status === status).length,
    }));
    
    const COLORS = ['var(--color-task)', 'var(--color-event)', 'var(--color-appointment)'];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-text-primary">Raporlar ve Analitik</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiData.map(kpi => <KpiCard key={kpi.title} {...kpi} />)}
            </div>

            <ResourceHeatmap resources={resources} tasks={tasks} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card-bg p-6 rounded-lg shadow-md-custom">
                     <h3 className="text-lg font-semibold mb-4">Proje Durum Dağılımı</h3>
                     <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={projectStatusData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    nameKey="name"
                                    label={renderCustomizedLabel}
                                >
                                    {projectStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                     </div>
                </div>
                 <div className="bg-card-bg p-6 rounded-lg shadow-md-custom">
                    <h3 className="text-lg font-semibold mb-4">Aktivite Akışı</h3>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                            <img src="https://picsum.photos/seed/r1/40/40" className="w-10 h-10 rounded-full mt-1"/>
                            <div>
                                <p className="text-sm"><span className="font-semibold">Ahmet Çelik</span>, "Mobil Bankacılık" projesine yeni bir görev ekledi.</p>
                                <p className="text-xs text-text-secondary">2 saat önce</p>
                            </div>
                        </li>
                         <li className="flex items-start gap-3">
                            <img src="https://picsum.photos/seed/r2/40/40" className="w-10 h-10 rounded-full mt-1"/>
                            <div>
                                <p className="text-sm"><span className="font-semibold">Zeynep Demir</span>, "Ana sayfa tasarımı" görevini tamamladı.</p>
                                <p className="text-xs text-text-secondary">Dün</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
});