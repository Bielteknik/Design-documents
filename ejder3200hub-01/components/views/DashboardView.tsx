import React, { useMemo, useState } from 'react';
import { Project, Task, Idea, Notification, Resource, User, ProjectStatus, TaskStatus, IdeaStatus, Priority, Event, EventType, Announcement, Evaluation, VoteStatus, Role, FeedbackCategory, Department } from '../../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Briefcase, AlertTriangle, Lightbulb, CheckCircle, Activity, Plus, Calendar, CheckSquare, Clock, Megaphone, Trophy, X as XIcon, MessageSquare, Users } from 'lucide-react';
import { Modal } from '../Modal';
import { useProAjandaStore } from '../../hooks/useProAjandaStore';
import { FeedbackModal } from '../FeedbackModal';


interface DashboardViewProps {
    currentUser: User;
    projects: Project[];
    tasks: Task[];
    ideas: Idea[];
    notifications: Notification[];
    resources: Resource[];
    events: Event[];
    onAddEventClick: (type: EventType, initialData?: any) => void;
    onAddIdeaClick: () => void;
    announcements: Announcement[];
    evaluations: Evaluation[];
    store: ReturnType<typeof useProAjandaStore>;
}

const AnnouncementModal: React.FC<{ isOpen: boolean; onClose: () => void; onSubmit: (data: Omit<Announcement, 'id' | 'author' | 'authorId' | 'timestamp'>) => void; departments: Department[] }> = ({ isOpen, onClose, onSubmit, departments }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [departmentId, setDepartmentId] = useState('all');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // FIX: The component now correctly calls onSubmit without `authorId`, which is handled by the store.
        onSubmit({ title, content, departmentId });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Yeni Duyuru Oluştur">
            <form onSubmit={handleSubmit} className="flex flex-col">
                <div className="p-6 space-y-4">
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Duyuru Başlığı" className="w-full p-2 border rounded" required />
                    <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Duyuru içeriği..." className="w-full p-2 border rounded" rows={5} required />
                    <select value={departmentId} onChange={e => setDepartmentId(e.target.value)} className="w-full p-2 border rounded bg-white">
                        <option value="all">Tüm Departmanlar</option>
                        {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                </div>
                <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">İptal</button>
                    <button type="submit" className="px-4 py-2 bg-project text-white rounded">Yayınla</button>
                </div>
            </form>
        </Modal>
    );
};


const KpiCard: React.FC<{ title: string; value: string | number; icon: React.ElementType; color: string }> = ({ title, value, icon: Icon, color }) => (
    <div className="bg-card-bg p-5 rounded-lg shadow-md-custom flex items-start justify-between">
        <div>
            <p className="text-sm text-text-secondary font-medium">{title}</p>
            <p className="text-3xl font-bold text-text-primary mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg`} style={{ backgroundColor: `${color}1A`}}>
             <Icon size={22} style={{ color: color }}/>
        </div>
    </div>
);

const priorityColors: { [key in Priority]: string } = {
    [Priority.High]: 'text-red-500',
    [Priority.Medium]: 'text-yellow-500',
    [Priority.Low]: 'text-blue-500',
};

// FIX: Moved the CustomYAxisTick component outside of the DashboardView component.
// This prevents it from being recreated on every render, which can cause performance issues or infinite loops in charting libraries.
const CustomYAxisTick = (props: any) => {
    const { x, y, payload, healthColors } = props;
    const health = healthColors[payload.value]?.health || 'gray';
    const color = health === 'green' ? '#22C55E' : health === 'yellow' ? '#F59E0B' : '#EF4444';

    return (
        <g transform={`translate(${x},${y})`}>
            <title>{`Proje Sağlığı: ${health}`}</title>
            <circle cx="-10" cy="0" r="4" fill={color} />
            <text x="0" y="0" dy={4} textAnchor="end" fill="#6B7280" fontSize={12}>
                {payload.value}
            </text>
        </g>
    );
};


export const DashboardView: React.FC<DashboardViewProps> = React.memo(({ currentUser, projects, tasks, ideas, events, onAddEventClick, onAddIdeaClick, announcements, evaluations, resources, store }) => {
    
    const [isAnnouncementModalOpen, setAnnouncementModalOpen] = useState(false);
    const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false);


    const kpiData = useMemo(() => {
        const today = new Date();
        const oneWeekFromNow = new Date(today);
        oneWeekFromNow.setDate(today.getDate() + 7);

        const activeProjects = projects.filter(p => p.status === ProjectStatus.Active).length;
        
        const tasksDueThisWeek = tasks.filter(t => {
            if (!t.endDate) return false;
            const endDate = new Date(t.endDate);
            return endDate >= today && endDate <= oneWeekFromNow && t.status !== TaskStatus.Done;
        }).length;

        const overdueTasks = tasks.filter(t => t.endDate && new Date(t.endDate) < today && t.status !== TaskStatus.Done).length;
        
        const newIdeas = ideas.filter(i => i.status === IdeaStatus.New).length;

        return [
            { title: 'Aktif Projeler', value: activeProjects, icon: Briefcase, color: '#7C3AED' },
            { title: 'Bu Hafta Bitecek Görevler', value: tasksDueThisWeek, icon: CheckCircle, color: '#22C55E' },
            { title: 'Gecikmiş Görevler', value: overdueTasks, icon: AlertTriangle, color: '#EF4444' },
            { title: 'Yeni Fikirler', value: newIdeas, icon: Lightbulb, color: '#F59E0B' },
        ];
    }, [projects, tasks, ideas]);

    const myTasksByPriority = useMemo(() => {
        // FIX: Changed `t.assignee` to use string comparison, aligning with the refactored `Task` type.
        const myTasks = tasks.filter(t => t.assigneeId === currentUser.id && t.status !== TaskStatus.Done);
        return {
            [Priority.High]: myTasks.filter(t => t.priority === Priority.High),
            [Priority.Medium]: myTasks.filter(t => t.priority === Priority.Medium),
            [Priority.Low]: myTasks.filter(t => t.priority === Priority.Low),
        }
    }, [tasks, currentUser.id]);

    const projectProgressData = useMemo(() => {
        const healthData: { [key: string]: { health: string } } = {};
        const data = projects.map(p => {
            const overdueTasksCount = tasks.filter(t => 
                t.projectId === p.id && 
                t.endDate && 
                new Date(t.endDate) < new Date('2025-02-15') &&
                t.status !== TaskStatus.Done
            ).length;

            const timePassed = new Date('2025-02-15').getTime() - new Date(p.startDate).getTime();
            const projectDuration = new Date(p.endDate).getTime() - new Date(p.startDate).getTime();
            const timeRatio = projectDuration > 0 ? timePassed / projectDuration : 0;
            const progressRatio = p.progress / 100;

            let health = 'green';
            if (overdueTasksCount > 0 || (timeRatio > progressRatio + 0.25)) {
                health = 'red';
            } else if (timeRatio > progressRatio + 0.1) {
                health = 'yellow';
            }
            healthData[p.name] = { health };
            return {
                name: p.name,
                progress: p.progress,
                color: p.color,
            };
        });
        return { data, healthData };
    }, [projects, tasks]);
    
    const todaysEvents = useMemo(() => {
        const todayStr = new Date('2025-08-15').toISOString().split('T')[0];
        return events.filter(e => e.date === todayStr);
    }, [events]);

    const handleFeedbackSubmit = (data: any) => {
        store.addFeedback(data);
        setFeedbackModalOpen(false);
    };

    return (
        <div className="space-y-6">
             <FeedbackModal
                isOpen={isFeedbackModalOpen}
                onClose={() => setFeedbackModalOpen(false)}
                onSubmit={handleFeedbackSubmit}
                currentUser={currentUser}
                departments={store.departments}
                projects={store.projects}
                resources={store.resources}
            />
            <AnnouncementModal 
                isOpen={isAnnouncementModalOpen} 
                onClose={() => setAnnouncementModalOpen(false)}
                onSubmit={store.addAnnouncement}
                departments={store.departments}
            />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                     <h1 className="text-2xl font-bold text-text-primary">Hoş Geldin, {currentUser.username.split(' ')[0]}!</h1>
                     <p className="text-text-secondary mt-1">İşte bugünün özeti.</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <button 
                        onClick={() => onAddEventClick(EventType.Task)}
                        className="flex items-center gap-2 px-3 py-2 bg-card-bg text-text-primary border border-border-color rounded-lg hover:bg-main-bg transition-colors shadow-sm text-sm font-semibold">
                        <Plus size={16} /> Görev Ekle
                    </button>
                    <button 
                        onClick={onAddIdeaClick}
                        className="flex items-center gap-2 px-3 py-2 bg-project text-white rounded-lg hover:bg-project-focus transition-colors shadow-sm text-sm font-semibold">
                        <Lightbulb size={16} /> Fikir Ekle
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiData.map(kpi => <KpiCard key={kpi.title} {...kpi} />)}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* My Tasks */}
                <div className="lg:col-span-1 bg-card-bg p-6 rounded-lg shadow-md-custom">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">Öncelikli Görevlerim</h3>
                    <div className="space-y-4">
                        {Object.entries(myTasksByPriority).map(([priority, taskList]) => Array.isArray(taskList) && taskList.length > 0 && (
                            <div key={priority}>
                                <h4 className={`text-sm font-bold mb-2 flex items-center gap-2 ${priorityColors[priority as Priority]}`}>
                                    <div className={`w-2 h-2 rounded-full ${priorityColors[priority as Priority].replace('text-','bg-')}`}></div>
                                    {priority} Öncelik
                                </h4>
                                <ul className="space-y-2">
                                    {Array.isArray(taskList) && taskList.map(task => (
                                        <li key={task.id} className="flex items-center gap-2 text-sm bg-main-bg p-2 rounded-md">
                                            <CheckSquare size={16} className="text-text-secondary" />
                                            <span className="flex-1 truncate">{task.title}</span>
                                            <span className="text-xs text-text-secondary">{projects.find(p => p.id === task.projectId)?.code}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                         {Object.values(myTasksByPriority).flat().length === 0 && (
                            <p className="text-sm text-text-secondary text-center py-8">Tamamlanmamış göreviniz bulunmuyor.</p>
                        )}
                    </div>
                </div>

                {/* Project Progress */}
                <div className="lg:col-span-2 bg-card-bg p-6 rounded-lg shadow-md-custom">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">Proje İlerleme Durumu</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={projectProgressData.data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" domain={[0, 100]} unit="%" />
                                <YAxis 
                                    type="category" 
                                    dataKey="name" 
                                    width={100}
                                    tickLine={false}
                                    axisLine={false}
                                    tick={<CustomYAxisTick healthColors={projectProgressData.healthData} />}
                                />
                                <Tooltip cursor={{ fill: 'rgba(243, 244, 246, 0.5)' }}/>
                                <Bar dataKey="progress" barSize={20}>
                                    {projectProgressData.data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {/* Announcements */}
                <div className="bg-card-bg p-6 rounded-lg shadow-md-custom">
                     <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2"><Megaphone/> Duyurular</h3>
                        {currentUser.role === Role.Admin && (
                            <button onClick={() => setAnnouncementModalOpen(true)} className="text-sm font-semibold text-project hover:underline">Yeni Duyuru</button>
                        )}
                     </div>
                    <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                        {announcements.map(ann => (
                            <div key={ann.id} className="p-3 bg-main-bg rounded-lg">
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold text-sm">{ann.title}</p>
                                    <p className="text-xs text-text-secondary">{ann.timestamp}</p>
                                </div>
                                <p className="text-sm text-text-secondary mt-1">{ann.content}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Today's Events */}
                 <div className="bg-card-bg p-6 rounded-lg shadow-md-custom">
                    <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2"><Calendar/> Bugünün Ajandası</h3>
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {todaysEvents.map(event => {
                            const eventTypeConfig = {
                                [EventType.Meeting]: { icon: Users, color: 'var(--color-meeting)'},
                                [EventType.Task]: { icon: CheckSquare, color: 'var(--color-task)'},
                                [EventType.Appointment]: { icon: Calendar, color: 'var(--color-appointment)'},
                                [EventType.Event]: { icon: Calendar, color: 'var(--color-event)'},
                                [EventType.Note]: { icon: MessageSquare, color: '#6B7280'},
                            };
                            const config = eventTypeConfig[event.type];
                            const Icon = config.icon;
                            return(
                                <div key={event.id} className="flex items-center gap-3 p-2.5 rounded-lg" style={{backgroundColor: `${config.color}1A`}}>
                                    <Icon size={18} style={{color: config.color}}/>
                                    <div className="flex-1">
                                        <p className="font-semibold text-sm">{event.title}</p>
                                        <p className="text-xs text-text-secondary">{event.type}</p>
                                    </div>
                                    {event.startTime && <span className="text-sm font-medium"><Clock size={12} className="inline mr-1"/>{event.startTime}</span>}
                                </div>
                            )
                        })}
                        {todaysEvents.length === 0 && <p className="text-sm text-text-secondary text-center py-8">Bugün için planlanmış bir etkinlik yok.</p>}
                    </div>
                </div>
             </div>

             <div className="bg-white rounded-lg p-6 shadow-md-custom text-center flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h3 className="text-xl font-bold">Geri Bildirimleriniz Bizim İçin Değerli!</h3>
                    <p className="text-text-secondary mt-1">Uygulama hakkındaki düşüncelerinizi, karşılaştığınız sorunları veya yeni özellik taleplerinizi bize iletin.</p>
                </div>
                <button 
                    onClick={() => setFeedbackModalOpen(true)}
                    className="flex-shrink-0 flex items-center gap-2 px-6 py-3 bg-yellow-400 text-yellow-900 font-bold rounded-lg hover:bg-yellow-500 transition-colors shadow-sm text-md">
                    <MessageSquare /> Geri Bildirim Gönder
                </button>
            </div>
        </div>
    );
});