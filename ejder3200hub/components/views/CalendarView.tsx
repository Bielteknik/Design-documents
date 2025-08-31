
import React, { useState, useMemo, useCallback } from 'react';
import { Event, EventType, TaskStatus, Project, Resource, Task, Priority } from '../../types';
import { 
    Calendar, CheckSquare, Users, ChevronLeft, ChevronRight, CalendarPlus, StickyNote, Check, Settings,
    Plus, Briefcase, Clock, User, Tag, Edit, MapPin, ThumbsUp, MessageSquare
} from 'lucide-react';
import { CalendarViewMode } from '../../App';
import { ToolsView } from './ToolsView';

interface CalendarViewProps {
    events: Event[];
    openModal: (type: EventType, initialData?: Partial<Event>) => void;
    viewMode: CalendarViewMode;
    setCalendarViewMode: (mode: CalendarViewMode) => void;
    updateEventDate: (eventId: string, newDate: string) => void;
    onEventClick: (event: Event) => void;
    projects: Project[];
    tasks: Task[];
    resources: Resource[];
    toggleTaskCompletion: (eventId: string) => void;
}

const QuickAddMenu: React.FC<{ x: number, y: number, date: string, onSelect: (type: EventType) => void, onClose: () => void }> = ({ x, y, date, onSelect, onClose }) => {
    const eventOptions = [
        { type: EventType.Appointment, label: 'Randevu', icon: Calendar, color: 'text-appointment' },
        { type: EventType.Task, label: 'Görev', icon: CheckSquare, color: 'text-task' },
        { type: EventType.Meeting, label: 'Toplantı', icon: Users, color: 'text-meeting' },
        { type: EventType.Event, label: 'Etkinlik', icon: CalendarPlus, color: 'text-event' },
        { type: EventType.Note, label: 'Not', icon: StickyNote, color: 'text-gray-500' },
    ];
    return (
        <div className="fixed inset-0 z-50" onClick={onClose}>
            <div
                className="absolute bg-card-bg rounded-md shadow-lg-custom ring-1 ring-black ring-opacity-5 z-50 animate-fadeIn py-1"
                style={{ top: y, left: x }}
                onClick={(e) => e.stopPropagation()}
            >
                {eventOptions.map(option => {
                    const Icon = option.icon;
                    return (
                        <a
                            key={option.type}
                            href="#"
                            onClick={(e) => { e.preventDefault(); onSelect(option.type); }}
                            className="flex items-center px-4 py-2 text-sm text-text-primary hover:bg-main-bg"
                        >
                            <Icon className={`mr-3 h-5 w-5 ${option.color}`} />
                            {option.label}
                        </a>
                    );
                })}
            </div>
        </div>
    );
};

const toYYYYMMDD = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const Avatar: React.FC<{ resource?: Resource }> = ({ resource }) => {
    if (!resource) return null;
    const avatarColors = ['bg-indigo-500', 'bg-teal-500', 'bg-amber-500', 'bg-rose-500', 'bg-cyan-500'];
    const getAvatarColor = (id: string) => avatarColors[id.charCodeAt(id.length-1) % avatarColors.length];

    return (
        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-xs ring-2 ring-card-bg ${getAvatarColor(resource.id)}`} title={resource.name}>
            {resource.initials}
        </div>
    );
};

const eventTypeIcons: { [key in EventType]: React.ElementType } = {
    [EventType.Appointment]: Calendar,
    [EventType.Task]: CheckSquare,
    [EventType.Meeting]: Users,
    [EventType.Event]: CalendarPlus,
    [EventType.Note]: StickyNote,
};

const priorityTagStyle: { [key in Priority]: string } = {
  [Priority.High]: 'bg-status-red-bg text-status-red-text',
  [Priority.Medium]: 'bg-status-yellow-bg text-status-yellow-text',
  [Priority.Low]: 'bg-status-purple-bg text-status-purple-text',
};

const taskStatusTagStyle: { [key in TaskStatus]: string } = {
  [TaskStatus.ToDo]: 'bg-status-blue-bg text-status-blue-text',
  [TaskStatus.InProgress]: 'bg-status-yellow-bg text-status-yellow-text',
  [TaskStatus.Done]: 'bg-status-green-bg text-status-green-text',
};

interface ActionCardProps {
    event: Event;
    onView: () => void;
    resources: Resource[];
    projects: Project[];
}

const ActionCard: React.FC<ActionCardProps> = ({ event, onView, resources, projects }) => {
    const typeConfig: { [key in EventType]?: { color: string } } = {
        [EventType.Task]: { color: 'var(--color-task)' },
        [EventType.Note]: { color: '#6B7280' },
        [EventType.Meeting]: { color: 'var(--color-meeting)' },
        [EventType.Appointment]: { color: 'var(--color-appointment)' },
        [EventType.Event]: { color: 'var(--color-event)' },
    };

    const config = typeConfig[event.type];
    if (!config) return null;
    const { color } = config;

    const Icon = eventTypeIcons[event.type];
    const project = projects.find(p => p.id === event.projectId);
    const assignee = resources.find(r => r.id === event.assignee);
    const reporter = resources.find(r => r.id === event.reporterId);
    const participants = event.participants ? resources.filter(r => event.participants!.includes(r.id)) : [];
    const author = event.type === EventType.Task ? reporter : null;

    const renderMetrics = () => {
        switch(event.type) {
            case EventType.Task:
                return <>
                    {project && <div className="flex items-center gap-2" title="Proje"><Briefcase size={14} className="text-purple-500"/> <span className="font-medium text-text-primary truncate">{project.name}</span></div>}
                    {event.endDate && <div className="flex items-center gap-2" title="Bitiş Tarihi"><Clock size={14} className="text-blue-500"/> <span className="font-medium text-text-primary">{new Date(event.endDate).toLocaleDateString('tr-TR')}</span></div>}
                    {assignee && <div className="flex items-center gap-2" title="Atanan"><User size={14} className="text-green-500"/> <span className="font-medium text-text-primary">{assignee.name}</span></div>}
                    {event.estimatedHours && <div className="flex items-center gap-2" title="Tahmini Süre"><Clock size={14} className="text-orange-500"/> <span className="font-medium text-text-primary">{event.estimatedHours} saat</span></div>}
                </>;
            case EventType.Meeting:
                return <>
                    {event.startTime && <div className="flex items-center gap-2" title="Saat"><Clock size={14} className="text-blue-500"/> <span className="font-medium text-text-primary">{event.startTime} - {event.endTime}</span></div>}
                    {participants.length > 0 && <div className="flex items-center gap-2" title="Katılımcılar"><Users size={14} className="text-purple-500"/> <span className="font-medium text-text-primary">{participants.length} kişi</span></div>}
                    {event.location && <div className="flex items-center gap-2" title="Konum"><MapPin size={14} className="text-green-500"/> <span className="font-medium text-text-primary truncate">{event.location}</span></div>}
                    {project && <div className="flex items-center gap-2" title="Proje"><Briefcase size={14} className="text-orange-500"/> <span className="font-medium text-text-primary truncate">{project.name}</span></div>}
                </>;
            case EventType.Event:
            case EventType.Appointment:
                return <>
                    {event.startTime && <div className="flex items-center gap-2" title="Saat"><Clock size={14} className="text-blue-500"/> <span className="font-medium text-text-primary">{event.startTime} - {event.endTime}</span></div>}
                    {event.location && <div className="flex items-center gap-2" title="Konum"><MapPin size={14} className="text-green-500"/> <span className="font-medium text-text-primary truncate">{event.location}</span></div>}
                </>;
            case EventType.Note:
                return <>
                    {event.tags && event.tags.length > 0 && <div className="flex items-center gap-2" title="Etiketler"><Tag size={14} className="text-blue-500"/> <span className="font-medium text-text-primary">{event.tags.join(', ')}</span></div>}
                </>;
            default: return null;
        }
    }

    return (
        <div 
            onClick={onView}
            style={{ borderLeftColor: color }}
            className={`bg-card-bg p-4 rounded-lg shadow-md-custom cursor-pointer border-l-4 flex flex-col gap-3 hover:shadow-lg-custom hover:-translate-y-0.5 transition-all duration-200 h-full`}
        >
            {/* Header */}
            <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-2 rounded-lg">
                        <Icon className="w-6 h-6 text-text-secondary" />
                    </div>
                    <div>
                        <h4 className="font-bold text-md text-text-primary leading-tight">{event.title}</h4>
                        <p className="text-sm text-text-secondary">{event.type}</p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                   {event.status && <span className={`text-xs font-semibold px-2 py-1 rounded-md ${taskStatusTagStyle[event.status]}`}>{event.status}</span>}
                   {event.priority && <span className={`text-xs font-semibold px-2 py-1 rounded-md ${priorityTagStyle[event.priority]}`}>{event.priority}</span>}
                </div>
            </div>

            {/* Description */}
            <p className="text-sm text-text-secondary line-clamp-2 flex-grow">
                {event.description || event.content || 'Açıklama yok.'}
            </p>
            
            {/* Metrics */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-text-secondary">
                {renderMetrics()}
            </div>

            {/* Interaction */}
            <div className="flex justify-between items-center">
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-text-secondary">
                        <ThumbsUp size={16} /> <span>0</span>
                    </div>
                     <div className="flex items-center gap-1.5 text-sm font-semibold text-text-secondary">
                        <MessageSquare size={16} /> <span>0</span>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <div className="flex -space-x-2">
                        {event.type === EventType.Task && assignee && <Avatar resource={assignee} />}
                        {event.type === EventType.Meeting && participants.slice(0, 3).map(p => <Avatar key={p.id} resource={p} />)}
                        {event.type === EventType.Meeting && participants.length > 3 && 
                            <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-xs ring-2 ring-card-bg bg-gray-500" title={`${participants.length - 3} more`}>
                               +{participants.length - 3}
                            </div>
                        }
                    </div>

                    <button className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 border-2 border-dashed text-gray-400 font-bold text-xs ring-2 ring-card-bg">
                       +
                    </button>
                    <button onClick={(e) => {e.stopPropagation(); /* onEdit */}} className="text-text-secondary hover:text-project p-2 rounded-full hover:bg-gray-100 transition-colors"><Edit size={16} /></button>
                </div>
            </div>
            
            {/* Footer */}
            <div className="border-t pt-3 flex items-center justify-between text-xs min-h-[34px]">
                {author ? (
                    <div className="flex items-center gap-2">
                        <Avatar resource={author} />
                        <div>
                            <p className="font-semibold text-text-primary">{author.name}</p>
                            <p className="text-text-secondary">{author.position}</p>
                        </div>
                    </div>
                ) : <div />}
                <p className="text-text-secondary">{new Date(event.date).toLocaleDateString('tr-TR')}</p>
            </div>
        </div>
    );
};


export const CalendarView: React.FC<CalendarViewProps> = React.memo(({ events, openModal, viewMode, setCalendarViewMode, updateEventDate, onEventClick, projects, resources, toggleTaskCompletion }) => {
    const [currentDate, setCurrentDate] = useState(new Date('2025-08-15'));
    const [quickAddMenu, setQuickAddMenu] = useState<{ x: number; y: number; date: string } | null>(null);
    const [draggedOverDate, setDraggedOverDate] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('Takvim');

    const eventsByDate = useMemo(() => {
        const map = new Map<string, Event[]>();
        events.forEach(event => {
            const dateStr = event.date;
            if (!map.has(dateStr)) {
                map.set(dateStr, []);
            }
            map.get(dateStr)!.push(event);
        });
        for (const dayEvents of map.values()) {
            dayEvents.sort((a,b) => (a.startTime || '').localeCompare(b.startTime || ''));
        }
        return map;
    }, [events]);

    const getEventsForDay = useCallback((day: Date) => {
        const dateStr = toYYYYMMDD(day);
        return eventsByDate.get(dateStr) || [];
    }, [eventsByDate]);


    const tabs = [
        { id: 'Takvim', label: 'Takvim', icon: Calendar },
        { id: 'Görevler', label: 'Görevler', icon: CheckSquare },
        { id: 'Notlar', label: 'Notlar', icon: StickyNote },
        { id: 'Toplantılar', label: 'Toplantılar', icon: Users },
        { id: 'Etkinlikler', label: 'Etkinlikler', icon: CalendarPlus },
        { id: 'Araçlar', label: 'Araçlar', icon: Settings },
    ];
    
    const CalendarTabs = () => (
      <div className="border-b border-border-color">
        <nav className="-mb-px flex space-x-4 overflow-x-auto" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
                <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-3 py-3 text-sm font-medium border-b-2 transition-colors duration-200 focus:outline-none
                    ${
                    isActive
                        ? 'border-b-project text-project'
                        : 'border-transparent text-text-secondary hover:text-project focus:border-b-project'
                    }
                `}
                >
                <tab.icon className={`h-5 w-5`} />
                <span>{tab.label}</span>
                </button>
            )
          })}
        </nav>
      </div>
    );
    
    const getEventsForTab = () => {
        switch(activeTab) {
            case 'Görevler':
                return events.filter(e => e.type === EventType.Task);
            case 'Notlar':
                return events.filter(e => e.type === EventType.Note);
            case 'Toplantılar':
                return events.filter(e => e.type === EventType.Meeting);
            case 'Etkinlikler':
                return events.filter(e => e.type === EventType.Event || e.type === EventType.Appointment);
            default:
                return [];
        }
    };

    const renderCardListView = () => {
        const filteredEvents = getEventsForTab().sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
        const titles: {[key: string]: {title: string, subtitle: string, button: string, type: EventType}} = {
            'Etkinlikler': { title: 'Randevular ve Etkinlikler', subtitle: 'Özel günler, kutlamalar ve etkinliklerinizi yönetin', button: 'Yeni Etkinlik', type: EventType.Event },
            'Görevler': { title: 'Görevler', subtitle: 'Tüm görevlerinizi buradan yönetin', button: 'Yeni Görev', type: EventType.Task },
            'Notlar': { title: 'Notlar', subtitle: 'Notlarınızı düzenleyin ve takip edin', button: 'Yeni Not', type: EventType.Note },
            'Toplantılar': { title: 'Toplantılar', subtitle: 'Toplantılarınızı planlayın ve yönetin', button: 'Yeni Toplantı', type: EventType.Meeting },
        };

        const config = titles[activeTab];

        return (
            <div>
                {config && (
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-text-primary">{config.title}</h2>
                            <p className="text-text-secondary mt-1">{config.subtitle}</p>
                        </div>
                        <button 
                            onClick={() => openModal(config.type)}
                            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-project text-white rounded-lg hover:bg-project-focus transition-colors">
                            <Plus size={18} />
                            <span>{config.button}</span>
                        </button>
                    </div>
                )}
                
                {filteredEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 grid-auto-rows-1fr">
                        {filteredEvents.map(event => <ActionCard key={event.id} event={event} onView={() => onEventClick(event)} resources={resources} projects={projects} />)}
                    </div>
                ) : (
                    <div className="text-center py-16 text-text-secondary bg-card-bg rounded-lg">Bu sekmede gösterilecek bir içerik yok.</div>
                )}
            </div>
        );
    };

    const handleDayDoubleClick = (day: Date, e: React.MouseEvent) => {
        e.preventDefault();
        const dateStr = toYYYYMMDD(day);
        setQuickAddMenu({ x: e.clientX, y: e.clientY, date: dateStr });
    };

    const handleQuickAddSelect = (type: EventType) => {
        if (quickAddMenu) {
            openModal(type, { date: quickAddMenu.date });
            setQuickAddMenu(null);
        }
    };

    const changeDate = (amount: number, unit: 'day' | 'week' | 'month') => {
        const newDate = new Date(currentDate);
        if (unit === 'day') newDate.setDate(newDate.getDate() + amount);
        if (unit === 'week') newDate.setDate(newDate.getDate() + amount * 7);
        if (unit === 'month') newDate.setMonth(newDate.getMonth() + amount);
        setCurrentDate(newDate);
    };

    const handleDragStart = (e: React.DragEvent, eventId: string) => {
        e.dataTransfer.setData('text', eventId);
    };

    const handleDrop = (e: React.DragEvent, newDate: Date) => {
        e.preventDefault();
        const eventId = e.dataTransfer.getData('text');
        const dateStr = toYYYYMMDD(newDate);
        
        const originalEvent = events.find(ev => ev.id === eventId);

        if (eventId && dateStr && originalEvent && originalEvent.date !== dateStr) {
            updateEventDate(eventId, dateStr);
        }
        setDraggedOverDate(null);
    };

    const handleDragOver = (e: React.DragEvent, day: Date) => {
        e.preventDefault();
        const dateStr = toYYYYMMDD(day);
        if (draggedOverDate !== dateStr) {
            setDraggedOverDate(dateStr);
        }
    };

    const renderHeader = () => {
        const formatOptions: Intl.DateTimeFormatOptions = viewMode === 'month' 
            ? { month: 'long', year: 'numeric' }
            : { month: 'long', day: 'numeric', year: 'numeric' };

        const calendarViewOptions: { id: CalendarViewMode, name: string }[] = [
            { id: 'day', name: 'Gün' },
            { id: 'week', name: 'Hafta' },
            { id: 'month', name: 'Ay' },
        ];

        return (
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-semibold w-48">{currentDate.toLocaleDateString('tr-TR', formatOptions)}</h2>
                    <div className="flex items-center gap-1">
                        <button onClick={() => changeDate(-1, viewMode)} className="p-1.5 text-text-secondary hover:bg-main-bg rounded-md"><ChevronLeft size={20} /></button>
                        <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 text-sm font-semibold text-text-primary hover:bg-main-bg rounded-md border border-border-color">Bugün</button>
                        <button onClick={() => changeDate(1, viewMode)} className="p-1.5 text-text-secondary hover:bg-main-bg rounded-md"><ChevronRight size={20} /></button>
                    </div>
                </div>
                <div className="bg-main-bg p-1 rounded-lg flex items-center gap-1">
                    {calendarViewOptions.map(option => (
                        <button
                            key={option.id}
                            onClick={() => setCalendarViewMode(option.id)}
                            className={`px-3 py-1 text-sm font-semibold rounded-md transition-all duration-200 ${
                                viewMode === option.id
                                    ? 'bg-card-bg text-project shadow-sm'
                                    : 'text-text-secondary hover:text-text-primary'
                            }`}
                        >
                            {option.name}
                        </button>
                    ))}
                </div>
            </div>
        );
    };
    
    const renderMonthView = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);

        const startDate = new Date(firstDayOfMonth);
        startDate.setDate(startDate.getDate() - (startDate.getDay() === 0 ? 6 : startDate.getDay() - 1));

        const days = [];
        for (let i = 0; i < 42; i++) {
            days.push(new Date(startDate));
            startDate.setDate(startDate.getDate() + 1);
        }

        return (
             <>
                <div className="grid grid-cols-7 gap-1 text-center font-medium text-text-secondary">
                    {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(d => <div key={d}>{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-px mt-2 bg-border-color border border-border-color rounded-lg overflow-hidden">
                    {days.map((day, index) => {
                        const dayEvents = getEventsForDay(day);
                        const isCurrentMonth = day.getMonth() === month;
                        const isToday = day.toDateString() === new Date().toDateString();
                        const dateStr = toYYYYMMDD(day);
                        
                        return (
                            <div 
                                key={index} 
                                className={`min-h-[100px] p-2 flex flex-col transition-colors duration-200 relative ${isCurrentMonth ? 'bg-card-bg' : 'bg-main-bg'} ${draggedOverDate === dateStr ? 'bg-status-blue-bg' : ''}`}
                                onDoubleClick={(e) => handleDayDoubleClick(day, e)}
                                onDrop={(e) => handleDrop(e, day)}
                                onDragOver={(e) => handleDragOver(e, day)}
                                onDragLeave={() => setDraggedOverDate(null)}
                            >
                                <div className="flex justify-between items-center">
                                    <span className={`font-semibold text-sm ${isToday ? 'bg-appointment text-white rounded-full w-6 h-6 flex items-center justify-center' : ''} ${!isCurrentMonth ? 'text-text-secondary/50' : ''}`}>
                                        {day.getDate()}
                                    </span>
                                </div>
                                <div className="mt-1 space-y-1 overflow-hidden flex-1">
                                    {dayEvents.slice(0, 2).map(event => {
                                        const project = projects.find(p => p.id === event.projectId);
                                        const color = project?.color || '#A0AEC0';
                                        
                                        const isTaskDone = event.type === EventType.Task && event.status === TaskStatus.Done;

                                        return (
                                            <div 
                                                key={event.id}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, event.id)}
                                                onClick={() => onEventClick(event)}
                                                className={`text-white text-xs rounded px-2 py-1 flex items-center cursor-pointer group relative`}
                                                style={{ backgroundColor: color }}
                                            >
                                                {event.type === EventType.Task && (
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); toggleTaskCompletion(event.id); }}
                                                        className={`w-4 h-4 rounded-sm border-2 border-white flex-shrink-0 mr-1.5 flex items-center justify-center ${isTaskDone ? 'bg-white/50' : 'bg-transparent'}`}
                                                    >
                                                        {isTaskDone && <Check size={10} className="text-black" />}
                                                    </button>
                                                )}
                                                <span className={`truncate ${isTaskDone ? 'line-through opacity-70' : ''}`}>{event.title}</span>
                                            </div>
                                        );
                                    })}
                                    {dayEvents.length > 2 && <div className="text-xs text-text-secondary mt-1">+ {dayEvents.length - 2} daha</div>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </>
        );
    };

    const renderWeekView = () => {
        const startOfWeek = new Date(currentDate);
        const dayOfWeek = startOfWeek.getDay();
        const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        startOfWeek.setDate(startOfWeek.getDate() + diffToMonday);

        const weekDays = Array.from({ length: 7 }).map((_, i) => {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            return day;
        });
    
        return (
            <div className="flex flex-col h-full">
                <div className="grid grid-cols-7 text-center font-medium text-text-secondary border-b border-border-color">
                    {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((d, i) => (
                        <div key={d} className="py-2">
                            <div>{d}</div>
                            <div className={`text-lg font-semibold ${toYYYYMMDD(weekDays[i]) === toYYYYMMDD(new Date()) ? 'text-project' : ''}`}>{weekDays[i].getDate()}</div>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 flex-1 overflow-y-auto" style={{minHeight: '400px'}}>
                    {weekDays.map((day) => {
                        const dayEvents = getEventsForDay(day);
                        return (
                            <div key={day.toISOString()} className="border-r border-border-color p-2 space-y-2">
                                {dayEvents.map(event => {
                                    const project = projects.find(p => p.id === event.projectId);
                                    const color = project?.color || '#A0AEC0';
                                    const isTaskDone = event.type === EventType.Task && event.status === TaskStatus.Done;
                                    return (
                                        <div 
                                            key={event.id}
                                            onClick={() => onEventClick(event)}
                                            className={`text-white text-xs rounded px-2 py-1 flex items-center cursor-pointer group relative`}
                                            style={{ backgroundColor: color }}
                                        >
                                            {event.type === EventType.Task && (
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); toggleTaskCompletion(event.id); }}
                                                    className={`w-4 h-4 rounded-sm border-2 border-white flex-shrink-0 mr-1.5 flex items-center justify-center ${isTaskDone ? 'bg-white/50' : 'bg-transparent'}`}
                                                >
                                                    {isTaskDone && <Check size={10} className="text-black" />}
                                                </button>
                                            )}
                                            <div>
                                                <p className={`truncate font-semibold ${isTaskDone ? 'line-through opacity-70' : ''}`}>{event.title}</p>
                                                {event.startTime && <p className="text-xs opacity-80">{event.startTime}</p>}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderDayView = () => {
        const dayEvents = getEventsForDay(currentDate);
        const isToday = toYYYYMMDD(currentDate) === toYYYYMMDD(new Date());
    
        return (
            <div className="p-4">
                <h3 className={`text-lg font-semibold mb-4 ${isToday ? 'text-project' : ''}`}>
                    {currentDate.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </h3>
                <div className="space-y-4">
                    {dayEvents.length > 0 ? dayEvents.map(event => {
                        const project = projects.find(p => p.id === event.projectId);
                        const color = project?.color || '#A0AEC0';
                        const isTaskDone = event.type === EventType.Task && event.status === TaskStatus.Done;
                        
                        return (
                            <div 
                                key={event.id}
                                onClick={() => onEventClick(event)}
                                className="p-3 rounded-lg flex items-start gap-4 cursor-pointer"
                                style={{ borderLeft: `4px solid ${color}`, backgroundColor: `${color}1A`}}
                            >
                                <div className="w-20 text-right font-semibold text-sm text-text-primary">
                                    {event.startTime ? 
                                        (<><div>{event.startTime}</div>{event.endTime && <div className="text-xs text-text-secondary"> - {event.endTime}</div>}</>)
                                        : 'Tüm gün'
                                    }
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                         {event.type === EventType.Task && (
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); toggleTaskCompletion(event.id); }}
                                                className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center`}
                                                style={{ borderColor: color, backgroundColor: isTaskDone ? color : 'transparent'}}
                                            >
                                                {isTaskDone && <Check size={14} className="text-white" />}
                                            </button>
                                        )}
                                        <p className={`font-semibold ${isTaskDone ? 'line-through opacity-70' : ''}`}>{event.title}</p>
                                    </div>
                                    {event.description && <p className="text-sm text-text-secondary mt-1">{event.description}</p>}
                                </div>
                            </div>
                        )
                    }) : (
                        <p className="text-text-secondary">Bugün için planlanmış bir etkinlik yok.</p>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col">
            <CalendarTabs />
            
            {activeTab === 'Takvim' ? (
                <div className="bg-card-bg rounded-lg flex flex-col mt-4 overflow-hidden p-4">
                    {renderHeader()}
                    <div className="flex-1 overflow-y-auto">
                        {viewMode === 'month' && renderMonthView()}
                        {viewMode === 'week' && renderWeekView()}
                        {viewMode === 'day' && renderDayView()}
                    </div>
                </div>
            ) : activeTab === 'Araçlar' ? (
                 <div className="flex-1 overflow-y-auto mt-6">
                    <ToolsView />
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto mt-6">
                    {renderCardListView()}
                </div>
            )}

            {quickAddMenu && <QuickAddMenu {...quickAddMenu} onSelect={handleQuickAddSelect} onClose={() => setQuickAddMenu(null)} />}
        </div>
    );
});
