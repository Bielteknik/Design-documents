import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { Project, Task, Resource, Event, TaskStatus, Notification, Idea, EventType, Priority, RsvpStatus, NotificationType, IdeaStatus, PurchaseRequest, Invoice, PurchaseRequestStatus, InvoiceStatus, ProjectStatus, Evaluation, VoteStatus, Comment, Department, PerformanceEvaluation, Announcement, Feedback, ApiLog, SystemMetric, DatabaseStats } from '../types';

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


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    projectsData, tasksData, resourcesData, eventsData, ideasData, 
                    departmentsData, commentsData
                ] = await Promise.all([
                    apiService.getProjects(),
                    apiService.getTasks(),
                    apiService.getResources(),
                    apiService.getEvents(),
                    apiService.getIdeas(),
                    apiService.getDepartments(),
                    apiService.getComments(),
                ]);

                setProjects(projectsData);
                setTasks(tasksData);
                setResources(resourcesData);
                setEvents(eventsData);
                setIdeas(ideasData);
                setDepartments(departmentsData);
                setComments(commentsData);

                // Mocked data until backend is ready
                setNotifications(await apiService.getNotifications());
                setPurchaseRequests(await apiService.getPurchaseRequests());
                setInvoices(await apiService.getInvoices());
                setEvaluations(await apiService.getEvaluations());
                setPerformanceEvaluations(await apiService.getPerformanceEvaluations());
                setAnnouncements(await apiService.getAnnouncements());
                setFeedback(await apiService.getFeedback());
                setApiLogs(await apiService.getApiLogs());
                setSystemMetrics(await apiService.getSystemMetrics());
                setDatabaseStats(await apiService.getDatabaseStats());
            } catch (error) {
                console.error("Failed to fetch data:", error);
                alert(`Veri alınamadı: ${error instanceof Error ? error.message : String(error)}`);
            }
        };
        fetchData();
    }, []);


    const updateTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
        const updatedTask = await apiService.updateTask(taskId, { status: newStatus });
        if (updatedTask) {
            setTasks(prevTasks => prevTasks.map(task => (task.id === taskId ? updatedTask : task)));
            setEvents(prevEvents => prevEvents.map(event =>
                event.id === taskId && event.type === EventType.Task ? { ...event, status: newStatus } : event
            ));
        }
    };

    const updateTaskProgress = async (taskId: string, progress: number) => {
        const updatedTask = await apiService.updateTask(taskId, { progress });
        if (updatedTask) {
            setTasks(prevTasks => prevTasks.map(task => (task.id === taskId ? updatedTask : task)));
            setEvents(prevEvents => prevEvents.map(event =>
                event.id === taskId && event.type === EventType.Task ? { ...event, progress } : event
            ));
        }
    };
    
    const toggleTaskCompletion = (eventId: string) => {
        const event = events.find(e => e.id === eventId);
        if (event && event.type === EventType.Task) {
            const newStatus = event.status === TaskStatus.Done ? TaskStatus.ToDo : TaskStatus.Done;
            updateTaskStatus(eventId, newStatus);
        }
    };


    const addEvent = async (event: Omit<Event, 'id'>) => {
        const newEvent = await apiService.addEvent(event);
        if (newEvent) {
            setEvents(prevEvents => [...prevEvents, newEvent]);

            if (newEvent.type === EventType.Task) {
                 const newTask = await apiService.getTask(newEvent.id);
                 if (newTask) setTasks(prev => [...prev, newTask]);
            }
            
            // Notification logic to be implemented on the backend
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

    const addIdea = async (ideaData: Omit<Idea, 'id' | 'status' | 'authorId'>) => {
        const authorHasIdeas = ideas.some(i => i.authorId === currentUserId);
        if (!authorHasIdeas) {
            awardBadge(currentUserId, 'idea_starter');
        }
        
        const payload = { ...ideaData, authorId: currentUserId };
        const newIdea = await apiService.addIdea(payload);
        if (newIdea) {
            setIdeas(prevIdeas => [newIdea, ...prevIdeas]);
        }
    };

    const updateIdea = async (updatedIdea: Idea) => {
        const result = await apiService.updateIdea(updatedIdea.id, updatedIdea);
        if (result) {
            setIdeas(prevIdeas => prevIdeas.map(idea => (idea.id === updatedIdea.id ? result : idea)));
        }
    };
    
    const deleteIdea = async (ideaId: string) => {
        const result = await apiService.deleteIdea(ideaId);
        if(result.success) {
            setIdeas(prevIdeas => prevIdeas.filter(idea => idea.id !== ideaId));
            setEvents(prevEvents => prevEvents.map(event => 
                event.ideaId === ideaId ? { ...event, ideaId: undefined } : event
            ));
        }
    };

    const updateIdeaStatus = async (ideaId: string, newStatus: IdeaStatus) => {
        const updatedIdea = await apiService.updateIdea(ideaId, { status: newStatus });
        if (updatedIdea) {
            setIdeas(prevIdeas => prevIdeas.map(idea => (idea.id === ideaId ? updatedIdea : idea)));
        }
    };

    const updateEvent = async (updatedEvent: Event) => {
        const result = await apiService.updateEvent(updatedEvent.id, updatedEvent);
        if (result) {
            setEvents(prevEvents => prevEvents.map(event => event.id === updatedEvent.id ? result : event));

            if (result.type === EventType.Task) {
                 const updatedTask = await apiService.getTask(result.id);
                 if (updatedTask) {
                    setTasks(prevTasks => prevTasks.map(task => task.id === result.id ? updatedTask : task));
                 }
            }
        }
    };
    
    const updateRsvpStatus = (eventId: string, userId: string, status: RsvpStatus) => {
         setEvents(prevEvents =>
            prevEvents.map(event => {
                if (event.id === eventId && event.rsvp) {
                    const newRsvp = { ...event.rsvp, [userId]: status };
                    apiService.updateEvent(eventId, { rsvp: newRsvp }); // Fire-and-forget
                    return { ...event, rsvp: newRsvp };
                }
                return event;
            })
        );
    };

    const updateEventDate = async (eventId: string, newDate: string) => {
        const updatedEvent = await apiService.updateEvent(eventId, { date: newDate });
        if (updatedEvent) {
             setEvents(prevEvents => prevEvents.map(event => (event.id === eventId ? updatedEvent : event)));
        }
    };

    const markNotificationAsRead = (notificationId: string) => {
        apiService.updateNotification(notificationId, { read: true });
        setNotifications(prev => 
            prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
        );
    };

    const markAllNotificationsAsRead = () => {
        notifications.forEach(n => {
            if (!n.read) apiService.updateNotification(n.id, { read: true });
        });
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const addPurchaseRequest = async (requestData: Omit<PurchaseRequest, 'id' | 'status' | 'requesterId' | 'requestDate'>) => {
        // To be implemented
    };

    const updatePurchaseRequestStatus = async (id: string, status: PurchaseRequestStatus) => {
        const updatedRequest = await apiService.updatePurchaseRequest(id, { status });
        if (updatedRequest) {
            setPurchaseRequests(prev => prev.map(r => r.id === id ? updatedRequest : r));
        }
    };

    const addInvoice = async (invoiceData: Omit<Invoice, 'id' | 'status'>) => {
        const newInvoice = await apiService.addInvoice(invoiceData);
        if (newInvoice) {
            setInvoices(prev => [newInvoice, ...prev]);
        }
    };

    const updateInvoiceStatus = async (id: string, status: InvoiceStatus) => {
        const updatedInvoice = await apiService.updateInvoice(id, { status });
        if (updatedInvoice) {
            setInvoices(prev => prev.map(i => i.id === id ? updatedInvoice : i));
        }
    };

    const addProjectFile = async (projectId: string, fileName: string) => {
        const updatedProject = await apiService.addProjectFile(projectId, fileName);
        if(updatedProject) {
            setProjects(prev => prev.map(p => p.id === projectId ? updatedProject : p));
        }
    };

    const deleteProjectFile = async (projectId: string, fileName: string) => {
        const updatedProject = await apiService.deleteProjectFile(projectId, fileName);
         if(updatedProject) {
            setProjects(prev => prev.map(p => p.id === projectId ? updatedProject : p));
        }
    };
    
    const addResource = async (resourceData: Omit<Resource, 'id' | 'initials' | 'currentLoad' | 'skills' | 'department'> & { skills: string }) => {
        const payload = { ...resourceData, skills: resourceData.skills.split(',').map(s => s.trim()) };
        const newResource = await apiService.addResource(payload);
        if (newResource) {
            setResources(prev => [...prev, newResource]);
        }
    };

    const updateResource = async (updatedResourceData: Partial<Resource> & { skills: string | string[], id: string }) => {
        const payload = { 
            ...updatedResourceData, 
            // FIX: Safely handle both string and string[] types for skills to prevent runtime errors.
            skills: Array.isArray(updatedResourceData.skills) 
                ? updatedResourceData.skills.join(',') 
                : (updatedResourceData.skills as string || '').split(',').map(s => s.trim()).join(',') 
        };
        const updatedResource = await apiService.updateResource(updatedResourceData.id, { 
            ...payload, 
            skills: (payload.skills || '').split(',').map(s => s.trim()).filter(s => s.length > 0)
        });
        if(updatedResource){
            setResources(prev => prev.map(r => r.id === updatedResource.id ? updatedResource : r));
        }
    };

    const deleteResource = async (resourceId: string) => {
        const result = await apiService.deleteResource(resourceId);
        if(result.success) {
            setResources(prev => prev.filter(r => r.id !== resourceId));
            // You may need to refetch tasks/projects or filter them locally
        }
    };

    const updateProjectTeam = async (projectId: string, teamIds: string[]) => {
        const updatedProject = await apiService.updateProjectTeam(projectId, teamIds);
        if(updatedProject) {
            setProjects(prev => prev.map(p => p.id === projectId ? updatedProject : p));
        }
    };

    const convertIdeaToProject = async (ideaId: string) => {
        const result = await apiService.convertIdeaToProject(ideaId);
        if(result) {
            setProjects(prev => [...prev, result.project]);
            if(result.tasks) {
                setTasks(prev => [...prev, ...result.tasks]);
            }
            setIdeas(prev => prev.map(i => i.id === ideaId ? result.idea : i));
        }
    };

    const addEvaluation = async (evaluationData: Omit<Evaluation, 'id' | 'author' | 'authorId' | 'timestamp'>) => {
        const payload = { ...evaluationData, authorId: currentUserId };
        const newEval = await apiService.addEvaluation(payload);
        if(newEval){
            setEvaluations(prev => [newEval, ...prev]);
        }
    };

    const addComment = async (item: Project | Idea, text: string, authorId: string) => {
        const isProject = 'code' in item;
        const payload = {
            text,
            authorId,
            projectId: isProject ? item.id : undefined,
            ideaId: !isProject ? item.id : undefined,
        };
        const newComment = await apiService.addComment(payload);
        if (newComment) {
            setComments(prev => [...prev, newComment]);
            // Mention logic can be moved to backend
        }
    };

    const updateComment = async (commentId: string, text: string) => {
        const updatedComment = await apiService.updateComment(commentId, { text });
        if(updatedComment) {
            setComments(prev => prev.map(c => c.id === commentId ? updatedComment : c));
        }
    };

    const deleteComment = async (commentId: string) => {
        const result = await apiService.deleteComment(commentId);
        if(result.success) {
            setComments(prev => prev.filter(c => c.id !== commentId));
        }
    };

    const voteOnComment = (commentId: string, userId: string, vote: VoteStatus) => {
        setComments(prev => prev.map(c => {
            if (c.id === commentId) {
                const newVotes = { ...(c.votes || {}) };
                if (newVotes[userId] === vote) delete newVotes[userId];
                else newVotes[userId] = vote;
                
                apiService.updateComment(commentId, { votes: newVotes }); // Fire-and-forget
                return { ...c, votes: newVotes };
            }
            return c;
        }));
    };

    const addDepartment = async (dept: Omit<Department, 'id' | 'manager'>) => {
        const newDepartment = await apiService.addDepartment(dept);
        if(newDepartment) {
            setDepartments(prev => [...prev, newDepartment]);
        }
    };

    const updateDepartment = async (dept: Department) => {
        const updatedDept = await apiService.updateDepartment(dept.id, dept);
        if(updatedDept) {
            setDepartments(prev => prev.map(d => d.id === dept.id ? updatedDept : d));
        }
    };

    const deleteDepartment = async (departmentId: string) => {
        const hasResources = resources.some(r => r.departmentId === departmentId);
        if (hasResources) {
            alert('Bu departmana atanmış personel olduğu için silemezsiniz.'); return;
        }
        const result = await apiService.deleteDepartment(departmentId);
        if(result.success) {
            setDepartments(prev => prev.filter(d => d.id !== departmentId));
        }
    };

    const addAnnouncement = async (announcement: Omit<Announcement, 'id' | 'author' | 'authorId' | 'timestamp'>) => {
        const payload = { ...announcement, authorId: currentUserId };
        const newAnnouncement = await apiService.addAnnouncement(payload, currentUserId);
        if (newAnnouncement) {
            setAnnouncements(prev => [newAnnouncement, ...prev]);
        }
    };

    // FIX: Corrected function signature to not omit `authorId` which is required in the function body.
    const addFeedback = async (feedbackData: Omit<Feedback, 'id' | 'timestamp' | 'status' | 'author'>) => {
        const newFeedback = await apiService.addFeedback(feedbackData);
        if(newFeedback) {
            setFeedback(prev => [newFeedback, ...prev]);
        }
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