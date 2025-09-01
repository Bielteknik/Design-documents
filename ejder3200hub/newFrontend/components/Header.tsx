import React, { useState, useRef, useEffect } from 'react';
import { EventType, Notification, View, User } from '../types';
import { Plus, Bell, Menu, Calendar, CheckSquare, Users, CheckCheck, CalendarPlus, StickyNote, Lightbulb, Search, Layers, BarChart2, X, LayoutDashboard, HelpCircle, Sun, Moon, Palette, LogOut, User as UserIcon, Settings, Server, MessageSquare } from 'lucide-react';
import { useTheme, themes } from '../contexts/ThemeContext';


interface HeaderProps {
    onAddEventClick: (type: EventType, initialData?: any) => void;
    onAddIdeaClick: () => void;
    notifications: Notification[];
    markNotificationAsRead: (id: string) => void;
    markAllNotificationsAsRead: () => void;
    activeView: View;
    setActiveView: (view: View) => void;
    currentUser: User | null;
}

const iconMap: { [key in View]: React.ElementType } = {
    [View.Dashboard]: LayoutDashboard,
    [View.Calendar]: Calendar,
    [View.Projects]: Lightbulb,
    [View.Resources]: Users,
    [View.Reports]: BarChart2,
    [View.Backend]: Server,
    [View.HelpCenter]: HelpCircle,
};

const ThemeMenu: React.FC = () => {
    const { setTheme } = useTheme();
    return (
        <div className="mt-2">
            <p className="px-3 py-1 text-xs font-semibold text-text-secondary">Görünüm Ayarları</p>
            <div className="grid grid-cols-2 gap-2 p-2">
                {Object.entries(themes).map(([key, theme]) => (
                    <button
                        key={key}
                        onClick={() => setTheme(key)}
                        className="flex flex-col items-center p-2 rounded-md hover:bg-main-bg"
                    >
                        <div className="w-full h-8 rounded border border-border-color flex items-stretch overflow-hidden">
                            <div style={{ backgroundColor: theme.colors['--color-project'] }} className="w-1/3 h-full"></div>
                            <div style={{ backgroundColor: theme.colors['--color-card-bg'] }} className="w-2/3 h-full"></div>
                        </div>
                        <span className="text-xs mt-1">{theme.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

export const Header: React.FC<HeaderProps> = ({ 
    onAddEventClick, 
    onAddIdeaClick,
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead,
    activeView,
    setActiveView,
    currentUser
}) => {
    const [isCreateMenuOpen, setCreateMenuOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const createMenuRef = useRef<HTMLDivElement>(null);
    const notificationsRef = useRef<HTMLDivElement>(null);
    const profileMenuRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (createMenuRef.current && !createMenuRef.current.contains(event.target as Node)) {
                setCreateMenuOpen(false);
            }
            if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
            }
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setProfileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const eventOptions = [
        { type: EventType.Appointment, label: 'Randevu', icon: Calendar, color: 'text-appointment' },
        { type: EventType.Task, label: 'Görev', icon: CheckSquare, color: 'text-task' },
        { type: EventType.Meeting, label: 'Toplantı', icon: Users, color: 'text-meeting' },
        { type: EventType.Event, label: 'Etkinlik', icon: CalendarPlus, color: 'text-event' },
        { type: EventType.Note, label: 'Not Alma', icon: StickyNote, color: 'text-gray-500' },
    ];

    const unreadCount = notifications.filter(n => !n.read).length;
    
    const navItems = Object.values(View).map(view => ({
      name: view,
      icon: iconMap[view],
    }));

    return (
        <header className="flex-shrink-0 bg-card-bg shadow-md-custom z-20 sticky top-0">
            <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and Desktop Nav */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center gap-2">
                             <div className="bg-project p-2 rounded-lg">
                                <Layers className="h-6 w-6 text-white" />
                             </div>
                            <span className="text-xl font-bold text-text-primary">ejder3200Hub</span>
                        </div>
                        <nav className="hidden lg:ml-10 lg:flex lg:items-baseline lg:space-x-4">
                             {navItems.map(item => (
                                <a
                                    key={item.name}
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); setActiveView(item.name); }}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                                        activeView === item.name
                                        ? 'bg-status-purple-bg text-project'
                                        : 'text-text-secondary hover:bg-main-bg hover:text-text-primary'
                                    }`}
                                >
                                    {item.name}
                                </a>
                            ))}
                        </nav>
                    </div>

                     {/* Right side buttons */}
                    <div className="hidden lg:flex items-center gap-4 ml-4">
                        <>
                            {activeView === View.Projects ? (
                                <button
                                    onClick={onAddIdeaClick}
                                    className="flex items-center justify-center w-10 h-10 bg-project text-white rounded-full hover:bg-project-focus transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-project"
                                    aria-label="Yeni Fikir Oluştur"
                                >
                                    <Lightbulb size={20} />
                                </button>
                            ) : (
                                <div className="relative" ref={createMenuRef}>
                                    <button
                                        onClick={() => setCreateMenuOpen(!isCreateMenuOpen)}
                                        className="flex items-center justify-center w-10 h-10 bg-project text-white rounded-full hover:bg-project-focus transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-project"
                                        aria-label="Yeni Oluştur"
                                    >
                                        <Plus size={20} />
                                    </button>
                                    {isCreateMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-card-bg rounded-md shadow-lg-custom ring-1 ring-black ring-opacity-5 z-20 animate-fadeIn">
                                            <div className="py-1">
                                                {eventOptions.map(option => (
                                                    <a
                                                        key={option.type}
                                                        href="#"
                                                        onClick={(e) => { e.preventDefault(); onAddEventClick(option.type); setCreateMenuOpen(false); }}
                                                        className={`flex items-center px-4 py-2 text-sm text-text-primary hover:bg-main-bg ${option.color}`}
                                                    >
                                                        <option.icon className="mr-3 h-5 w-5" />
                                                        {option.label}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                        <div className="relative" ref={notificationsRef}>
                            <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="relative text-text-secondary hover:text-text-primary p-2 rounded-full hover:bg-main-bg">
                                <Bell size={22} />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>
                            {isNotificationsOpen && (
                                <div className="absolute right-0 mt-2 w-80 bg-card-bg rounded-md shadow-lg-custom ring-1 ring-black ring-opacity-5 z-20 animate-fadeIn">
                                    <div className="flex justify-between items-center p-3 border-b border-border-color">
                                        <h4 className="font-semibold text-sm">Bildirimler</h4>
                                        <button onClick={markAllNotificationsAsRead} className="text-xs text-project hover:underline flex items-center gap-1">
                                            <CheckCheck size={14} /> Tümü Okundu
                                        </button>
                                    </div>
                                    <ul className="py-1 max-h-80 overflow-y-auto">
                                        {notifications.map(notification => (
                                            <li key={notification.id} onClick={() => markNotificationAsRead(notification.id)} className="border-b border-border-color last:border-b-0">
                                                <a href="#" className="flex items-start gap-3 p-3 text-sm text-text-primary hover:bg-main-bg">
                                                    {!notification.read && <span className="w-2 h-2 mt-1.5 bg-blue-500 rounded-full flex-shrink-0"></span>}
                                                    <div className={notification.read ? 'pl-5' : ''}>
                                                        <p>{notification.message}</p>
                                                        <p className="text-xs text-text-secondary mt-1">{notification.timestamp}</p>
                                                    </div>
                                                </a>
                                            </li>
                                        ))}
                                        {notifications.length === 0 && (
                                            <li className="p-4 text-center text-sm text-text-secondary">Okunmamış bildirim yok.</li>
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>
                        
                        <div className="relative" ref={profileMenuRef}>
                            <button onClick={() => setProfileMenuOpen(!isProfileMenuOpen)}>
                                <img
                                    src={`https://picsum.photos/seed/${currentUser?.id}/40/40`}
                                    alt="User Avatar"
                                    className="w-10 h-10 rounded-full"
                                />
                            </button>
                            {isProfileMenuOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-card-bg rounded-md shadow-lg-custom ring-1 ring-black ring-opacity-5 z-20 animate-fadeIn">
                                    <div className="p-4 border-b border-border-color">
                                        <p className="font-semibold text-text-primary">{currentUser?.username}</p>
                                        <p className="text-sm text-text-secondary">{currentUser?.role}</p>
                                    </div>
                                    <div className="py-1">
                                        <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-text-primary hover:bg-main-bg">
                                            <Settings size={16}/> Profil Ayarları
                                        </a>
                                        <ThemeMenu />
                                    </div>
                                    <div className="py-1 border-t border-border-color">
                                         <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-main-bg">
                                            <LogOut size={16}/> Çıkış Yap
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden flex items-center">
                         <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-main-bg focus:outline-none focus:ring-2 focus:ring-inset focus:ring-project">
                            <span className="sr-only">Ana menüyü aç</span>
                            {isMobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

             {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                         {navItems.map(item => (
                            <a
                                key={item.name}
                                href="#"
                                onClick={(e) => { e.preventDefault(); setActiveView(item.name); setIsMobileMenuOpen(false); }}
                                className={`flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                                    activeView === item.name
                                    ? 'bg-status-purple-bg text-project'
                                    : 'text-text-secondary hover:bg-main-bg hover:text-text-primary'
                                }`}
                            >
                                <item.icon className="w-5 h-5"/>
                                {item.name}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
};