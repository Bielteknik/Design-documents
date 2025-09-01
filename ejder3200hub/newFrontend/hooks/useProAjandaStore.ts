import { useState, useEffect } from 'react';
import { Project, Task, Resource, Event, TaskStatus, Notification, Idea, EventType, Priority, RsvpStatus, NotificationType, IdeaStatus, PurchaseRequest, Invoice, PurchaseRequestStatus, InvoiceStatus, ProjectStatus, Evaluation, VoteStatus, Comment, Department, PerformanceEvaluation, Announcement, Feedback, FeedbackCategory, FeedbackStatus, ApiLog, SystemMetric, DatabaseStats } from '../types';
import { 
    mockProjects, 
    mockTasks, 
    mockResources, 
    mockEvents, 
    mockNotifications, 
    mockIdeas, 
    mockPurchaseRequests, 
    mockInvoices, 
    mockEvaluations, 
    mockComments, 
    mockDepartments, 
    mockPerformanceEvaluations, 
    mockAnnouncements, 
    mockFeedback, 
    mockApiLogs, 
    mockSystemMetrics, 
    mockDatabaseStats 
} from '../data/mockData';

// For demo purposes, let's assume the current user is 'r2' (Ahmet Kaya)
const currentUserId = 'r2';

export const useProAjandaStore = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [resources, setResources] = useState<Resource[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [performanceEvaluations, setPerformanceEvaluations] = useState<PerformanceEvaluation[]>([]);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [feedback, setFeedback] = useState<Feedback[]>([]);
    const [apiLogs, setApiLogs] = useState<ApiLog[]>([]);
    const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([]);
    const [databaseStats, setDatabaseStats] = useState<DatabaseStats[]>([]);

    // Initialize with mock data
    useEffect(() => {
        setProjects(mockProjects);
        setTasks(mockTasks);
        setResources(mockResources);
        setEvents(mockEvents);
        setNotifications(mockNotifications);
        setIdeas(mockIdeas);
        setPurchaseRequests(mockPurchaseRequests);
        setInvoices(mockInvoices);
        setEvaluations(mockEvaluations);
        setComments(mockComments);
        setDepartments(mockDepartments);
        setPerformanceEvaluations(mockPerformanceEvaluations);
        setAnnouncements(mockAnnouncements);
        setFeedback(mockFeedback);
        setApiLogs(mockApiLogs);
        setSystemMetrics(mockSystemMetrics);
        setDatabaseStats(mockDatabaseStats);
    }, []);

    const updateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
        setTasks(prevTasks => prevTasks.map(task => (task.id === taskId ? { ...task, status: newStatus } : task)));
        setEvents(prevEvents => prevEvents.map(event =>
            event.id === taskId && event.type === EventType.Task ? { ...event, status: newStatus } : event
        ));
    };

    const updateTaskProgress = (taskId: string, progress: number) => {
        setTasks(prevTasks => prevTasks.map(task => (task.id === taskId ? { ...task, progress } : task)));
        setEvents(prevEvents => prevEvents.map(event =>
            event.id === taskId && event.type === EventType.Task ? { ...event, progress } : event
        ));
    };
    
    const toggleTaskCompletion = (eventId: string) => {
        const event = events.find(e => e.id === eventId);
        if (event && event.type === EventType.Task) {
            const newStatus = event.status === TaskStatus.Done ? TaskStatus.ToDo : TaskStatus.Done;
            updateTaskStatus(eventId, newStatus);
        }
    };

    const addEvent = (event: Omit<Event, 'id'>) => {
        const newEvent: Event = { ...event, id: Date.now().toString() };
        setEvents(prevEvents => [...prevEvents, newEvent]);

        if (newEvent.type === EventType.Task) {
            const newTask: Task = {
                id: newEvent.id,
                title: newEvent.title,
                description: newEvent.description,
                status: newEvent.status || TaskStatus.ToDo,
                priority: newEvent.priority || Priority.Medium,
                assigneeId: newEvent.assigneeId || '',
                projectId: newEvent.projectId || '',
                category: newEvent.category,
                estimatedHours: newEvent.estimatedHours,
                startDate: newEvent.startDate,
                endDate: newEvent.endDate,
                completionDate: newEvent.completionDate,
                dependencies: newEvent.dependencies,
                tags: newEvent.tags,
                progress: newEvent.progress,
                spentHours: newEvent.spentHours,
                notes: newEvent.notes,
                files: newEvent.files,
            };
            setTasks(prev => [...prev, newTask]);
        }
    };
    
    const awardBadge = (resourceId: string, badgeId: string) => {
        setResources(prev => prev.map(r => {
            if (r.id === resourceId) {
                const hasBadge = r.earnedBadges?.includes(badgeId);
                if (!hasBadge) {
                    return { ...r, earnedBadges: [...(r.earnedBadges || []), badgeId] };
                }
            }
            return r;
        }));
    };

    const addIdea = (ideaData: Omit<Idea, 'id' | 'status' | 'authorId'>) => {
        const authorHasIdeas = ideas.some(i => i.authorId === currentUserId);
        if (!authorHasIdeas) {
            awardBadge(currentUserId, 'idea_starter');
        }
        
        const newIdea: Idea = {
            ...ideaData,
            id: Date.now().toString(),
            status: IdeaStatus.New,
            authorId: currentUserId
        };
        setIdeas(prevIdeas => [newIdea, ...prevIdeas]);
    };

    const updateIdea = (updatedIdea: Idea) => {
        setIdeas(prevIdeas => prevIdeas.map(idea => (idea.id === updatedIdea.id ? updatedIdea : idea)));
    };
    
    const deleteIdea = (ideaId: string) => {
        setIdeas(prevIdeas => prevIdeas.filter(idea => idea.id !== ideaId));
        setEvents(prevEvents => prevEvents.map(event => 
            event.ideaId === ideaId ? { ...event, ideaId: undefined } : event
        ));
    };

    const updateIdeaStatus = (ideaId: string, newStatus: IdeaStatus) => {
        setIdeas(prevIdeas => prevIdeas.map(idea => (idea.id === ideaId ? { ...idea, status: newStatus } : idea)));
    };

    const updateEvent = (updatedEvent: Event) => {
        setEvents(prevEvents => prevEvents.map(event => event.id === updatedEvent.id ? updatedEvent : event));

        if (updatedEvent.type === EventType.Task) {
            const updatedTask: Task = {
                id: updatedEvent.id,
                title: updatedEvent.title,
                description: updatedEvent.description,
                status: updatedEvent.status || TaskStatus.ToDo,
                priority: updatedEvent.priority || Priority.Medium,
                assigneeId: updatedEvent.assigneeId || '',
                projectId: updatedEvent.projectId || '',
                category: updatedEvent.category,
                estimatedHours: updatedEvent.estimatedHours,
                startDate: updatedEvent.startDate,
                endDate: updatedEvent.endDate,
                completionDate: updatedEvent.completionDate,
                dependencies: updatedEvent.dependencies,
                tags: updatedEvent.tags,
                progress: updatedEvent.progress,
                spentHours: updatedEvent.spentHours,
                notes: updatedEvent.notes,
                files: updatedEvent.files,
            };
            setTasks(prevTasks => prevTasks.map(task => task.id === updatedEvent.id ? updatedTask : task));
        }
    };
    
    const updateRsvpStatus = (eventId: string, userId: string, status: RsvpStatus) => {
        setEvents(prevEvents =>
            prevEvents.map(event => {
                if (event.id === eventId && event.rsvp) {
                    const newRsvp = { ...event.rsvp, [userId]: status };
                    return { ...event, rsvp: newRsvp };
                }
                return event;
            })
        );
    };

    const updateEventDate = (eventId: string, newDate: string) => {
        setEvents(prevEvents => prevEvents.map(event => (event.id === eventId ? { ...event, date: newDate } : event)));
    };

    const markNotificationAsRead = (notificationId: string) => {
        setNotifications(prev => 
            prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
        );
    };

    const markAllNotificationsAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const addPurchaseRequest = (requestData: Omit<PurchaseRequest, 'id' | 'status' | 'requesterId' | 'requestDate'>) => {
        const newRequest: PurchaseRequest = {
            ...requestData,
            id: Date.now().toString(),
            status: PurchaseRequestStatus.Pending,
            requesterId: currentUserId,
            requestDate: new Date().toISOString().split('T')[0]
        };
        setPurchaseRequests(prev => [newRequest, ...prev]);
    };

    const updatePurchaseRequestStatus = (id: string, status: PurchaseRequestStatus) => {
        setPurchaseRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    };

    const addInvoice = (invoiceData: Omit<Invoice, 'id' | 'status'>) => {
        const newInvoice: Invoice = {
            ...invoiceData,
            id: Date.now().toString(),
            status: InvoiceStatus.Unpaid
        };
        setInvoices(prev => [newInvoice, ...prev]);
    };

    const updateInvoiceStatus = (id: string, status: InvoiceStatus) => {
        setInvoices(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    };

    const addProjectFile = (projectId: string, fileName: string) => {
        setProjects(prev => prev.map(p => 
            p.id === projectId 
                ? { ...p, files: [...(p.files || []), fileName] }
                : p
        ));
    };

    const deleteProjectFile = (projectId: string, fileName: string) => {
        setProjects(prev => prev.map(p => 
            p.id === projectId 
                ? { ...p, files: (p.files || []).filter(f => f !== fileName) }
                : p
        ));
    };
    
    const addResource = (resourceData: Omit<Resource, 'id' | 'initials' | 'currentLoad' | 'skills' | 'department'> & { skills: string }) => {
        const newResource: Resource = {
            ...resourceData,
            id: Date.now().toString(),
            initials: resourceData.name.split(' ').map(word => word[0]).slice(0, 2).join('').toUpperCase(),
            currentLoad: 0,
            skills: resourceData.skills.split(',').map(s => s.trim())
        };
        setResources(prev => [...prev, newResource]);
    };

    const updateResource = (updatedResourceData: Omit<Partial<Resource>, 'skills'> & { id: string; skills: string | string[] }) => {
        const skills = Array.isArray(updatedResourceData.skills) 
            ? updatedResourceData.skills 
            : (updatedResourceData.skills || '').split(',').map(s => s.trim());
            
        setResources(prev => prev.map(r => 
            r.id === updatedResourceData.id 
                ? { ...r, ...updatedResourceData, skills }
                : r
        ));
    };

    const deleteResource = (resourceId: string) => {
        setResources(prev => prev.filter(r => r.id !== resourceId));
    };

    const updateProjectTeam = (projectId: string, teamIds: string[]) => {
        setProjects(prev => prev.map(p => 
            p.id === projectId ? { ...p, team: teamIds } : p
        ));
    };

    const convertIdeaToProject = (ideaId: string) => {
        const idea = ideas.find(i => i.id === ideaId);
        if (!idea) return;

        const newProject: Project = {
            id: Date.now().toString(),
            name: idea.name,
            code: `PRJ-${new Date().getFullYear()}-${String(projects.length + 1).padStart(3, '0')}`,
            status: ProjectStatus.Planning,
            priority: idea.priority || Priority.Medium,
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            progress: 0,
            managerId: idea.projectLeaderId || currentUserId,
            team: idea.potentialTeam || [currentUserId],
            budget: idea.totalBudget || 0,
            color: '#6366F1'
        };

        setProjects(prev => [...prev, newProject]);
        setIdeas(prev => prev.map(i => i.id === ideaId ? { ...i, status: IdeaStatus.Approved } : i));
    };

    const addEvaluation = (evaluationData: Omit<Evaluation, 'id' | 'author' | 'authorId' | 'timestamp'>) => {
        const newEval: Evaluation = {
            ...evaluationData,
            id: Date.now().toString(),
            authorId: currentUserId,
            timestamp: new Date().toISOString()
        };
        setEvaluations(prev => [newEval, ...prev]);
    };

    const addComment = (item: Project | Idea, text: string, authorId: string) => {
        const isProject = 'code' in item;
        const newComment: Comment = {
            id: Date.now().toString(),
            text,
            authorId,
            timestamp: new Date().toISOString(),
            projectId: isProject ? item.id : undefined,
            ideaId: !isProject ? item.id : undefined,
            votes: {}
        };
        setComments(prev => [...prev, newComment]);
    };

    const updateComment = (commentId: string, text: string) => {
        setComments(prev => prev.map(c => c.id === commentId ? { ...c, text } : c));
    };

    const deleteComment = (commentId: string) => {
        setComments(prev => prev.filter(c => c.id !== commentId));
    };

    const voteOnComment = (commentId: string, userId: string, vote: VoteStatus) => {
        setComments(prev => prev.map(c => {
            if (c.id === commentId) {
                const newVotes = { ...(c.votes || {}) };
                if (newVotes[userId] === vote) delete newVotes[userId];
                else newVotes[userId] = vote;
                return { ...c, votes: newVotes };
            }
            return c;
        }));
    };

    const addDepartment = (dept: Omit<Department, 'id' | 'manager'>) => {
        const newDepartment: Department = {
            ...dept,
            id: Date.now().toString()
        };
        setDepartments(prev => [...prev, newDepartment]);
    };

    const updateDepartment = (dept: Department) => {
        setDepartments(prev => prev.map(d => d.id === dept.id ? dept : d));
    };

    const deleteDepartment = (departmentId: string) => {
        const hasResources = resources.some(r => r.departmentId === departmentId);
        if (hasResources) {
            alert('Bu departmana atanmış personel olduğu için silemezsiniz.');
            return;
        }
        setDepartments(prev => prev.filter(d => d.id !== departmentId));
    };

    const addAnnouncement = (announcement: Omit<Announcement, 'id' | 'author' | 'authorId' | 'timestamp'>) => {
        const newAnnouncement: Announcement = {
            ...announcement,
            id: Date.now().toString(),
            authorId: currentUserId,
            timestamp: new Date().toISOString()
        };
        setAnnouncements(prev => [newAnnouncement, ...prev]);
    };

    const addFeedback = (feedbackData: Omit<Feedback, 'id' | 'timestamp' | 'status' | 'author'>) => {
        const newFeedback: Feedback = {
            ...feedbackData,
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            status: feedbackData.category === FeedbackCategory.BugReport ? FeedbackStatus.InProgress : FeedbackStatus.Submitted
        };
        setFeedback(prev => [newFeedback, ...prev]);
    };

    return {
        projects,
        tasks,
        resources,
        events,
        notifications,
        ideas,
        purchaseRequests,
        invoices,
        evaluations,
        comments,
        departments,
        performanceEvaluations,
        announcements,
        feedback,
        apiLogs,
        systemMetrics,
        databaseStats,
        currentUserId,
        updateTaskStatus,
        updateTaskProgress,
        addEvent,
        addIdea,
        updateIdea,
        deleteIdea,
        updateIdeaStatus,
        updateEvent,
        updateEventDate,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        toggleTaskCompletion,
        updateRsvpStatus,
        addPurchaseRequest,
        updatePurchaseRequestStatus,
        addInvoice,
        updateInvoiceStatus,
        addProjectFile,
        deleteProjectFile,
        addResource,
        updateResource,
        deleteResource,
        updateProjectTeam,
        convertIdeaToProject,
        addEvaluation,
        addComment,
        updateComment,
        deleteComment,
        voteOnComment,
        addDepartment,
        updateDepartment,
        deleteDepartment,
        addAnnouncement,
        addFeedback,
    };
};