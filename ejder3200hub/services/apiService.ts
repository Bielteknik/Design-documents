

import { 
    Project, Task, Resource, Event, Notification, Idea, PurchaseRequest, Invoice, Evaluation, 
    Comment, Department, PerformanceEvaluation, Announcement, Feedback, ApiLog, SystemMetric, DatabaseStats 
} from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        try {
            const errorJson = JSON.parse(errorText);
            throw new Error(errorJson.error || `Request failed with status ${response.status}`);
        } catch (e) {
            throw new Error(errorText || `Request failed with status ${response.status}`);
        }
    }
    if (response.status === 204) { // No Content
        return { success: true };
    }
    return response.json();
};


const get = <T>(endpoint: string): Promise<T> => fetch(`${API_BASE_URL}${endpoint}`).then(handleResponse);

const post = <T>(endpoint: string, body: any): Promise<T> => fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
}).then(handleResponse);

const put = <T>(endpoint: string, body: any): Promise<T> => fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
}).then(handleResponse);

const del = (endpoint: string): Promise<{success: boolean}> => fetch(`${API_BASE_URL}${endpoint}`, { method: 'DELETE' }).then(handleResponse);


// This service now acts as an adapter.
// Frontend uses nested objects (e.g., project.manager = { id: 'r1', name: '...' })
// Backend API for mutations (POST/PUT) expects IDs (e.g., { ..., managerId: 'r1' })
const prepareProjectPayload = (data: Partial<Project>) => {
    const { manager, team, ...rest } = data;
    const payload: any = { ...rest };
    if (manager) payload.managerId = manager.id;
    // FIX: `team` is already an array of string IDs, so no mapping is needed.
    if (team) payload.teamIds = team;
    return payload;
};

const prepareTaskPayload = (data: Partial<Task | Event>) => {
    const { assignee, reporter, project, ...rest } = data;
    const payload: any = { ...rest };
    if (assignee) payload.assigneeId = assignee.id;
    if (reporter) payload.reporterId = reporter.id;
    if (project) payload.projectId = project.id;
    return payload;
};

const prepareIdeaPayload = (data: Partial<Idea>) => {
    const { author, projectLeader, potentialTeam, ...rest } = data;
    const payload: any = { ...rest };
    if (author) payload.authorId = author.id;
    if (projectLeader) payload.projectLeaderId = projectLeader.id;
    // FIX: `potentialTeam` is already an array of string IDs, so no mapping is needed.
    if (potentialTeam) payload.potentialTeamIds = potentialTeam;
    return payload;
};

const prepareEventPayload = (data: Partial<Event>) => {
    const { participants, assignee, reporter, project, idea, ...rest } = data;
    const payload: any = { ...rest };
    // FIX: `participants` is already an array of string IDs, so no mapping is needed.
    if (participants) payload.participantIds = participants;
    if (assignee) payload.assigneeId = assignee.id;
    if (reporter) payload.reporterId = reporter.id;
    if (project) payload.projectId = project.id;
    if (idea) payload.ideaId = idea.id;
    return payload;
};


export const apiService = {
    // GETTERS
    getProjects: (): Promise<Project[]> => get('/projects'),
    getTasks: (): Promise<Task[]> => get('/tasks'),
    getTask: (id: string): Promise<Task> => get(`/tasks/${id}`),
    getResources: (): Promise<Resource[]> => get('/resources'),
    getEvents: (): Promise<Event[]> => get('/events'),
    getDepartments: (): Promise<Department[]> => get('/departments'),
    getIdeas: (): Promise<Idea[]> => get('/ideas'),
    getComments: (): Promise<Comment[]> => get('/comments'),

    // For now, these will return mock data until their backend routes are implemented
    getNotifications: (): Promise<Notification[]> => Promise.resolve([]),
    getPurchaseRequests: (): Promise<PurchaseRequest[]> => Promise.resolve([]),
    getInvoices: (): Promise<Invoice[]> => Promise.resolve([]),
    getEvaluations: (): Promise<Evaluation[]> => Promise.resolve([]),
    getPerformanceEvaluations: (): Promise<PerformanceEvaluation[]> => Promise.resolve([]),
    getAnnouncements: (): Promise<Announcement[]> => Promise.resolve([]),
    getFeedback: (): Promise<Feedback[]> => Promise.resolve([]),
    getApiLogs: (): Promise<ApiLog[]> => Promise.resolve([]),
    getSystemMetrics: (): Promise<SystemMetric[]> => Promise.resolve([]),
    getDatabaseStats: (): Promise<DatabaseStats[]> => Promise.resolve([]),

    // MUTATIONS
    updateTask: (id: string, data: Partial<Task>): Promise<Task> => put(`/tasks/${id}`, prepareTaskPayload(data)),
    
    updateProject: (id: string, data: Partial<Project>): Promise<Project> => {
        const payload = prepareProjectPayload(data);
        return put(`/projects/${id}`, payload);
    },

    addComment: (payload: Partial<Comment>): Promise<Comment> => post('/comments', payload),
    updateComment: (id: string, data: Partial<Comment>): Promise<Comment> => put(`/comments/${id}`, data),
    deleteComment: (id: string): Promise<{ success: boolean }> => del(`/comments/${id}`),

    addEvent: (eventData: Omit<Event, 'id'>): Promise<Event> => post('/events', prepareEventPayload(eventData)),
    updateEvent: (id: string, data: Partial<Event>): Promise<Event> => put(`/events/${id}`, prepareEventPayload(data)),
    
    addIdea: (ideaData: Partial<Idea>): Promise<Idea> => post('/ideas', ideaData),
    updateIdea: (id: string, data: Partial<Idea>): Promise<Idea> => put(`/ideas/${id}`, prepareIdeaPayload(data)),
    deleteIdea: (id: string): Promise<{ success: boolean }> => del(`/ideas/${id}`),

    addResource: (resourceData: Partial<Resource>): Promise<Resource> => post('/resources', resourceData),
    updateResource: (id: string, updatedResourceData: Partial<Resource>): Promise<Resource> => put(`/resources/${id}`, updatedResourceData),
    deleteResource: (id: string): Promise<{ success: boolean }> => del(`/resources/${id}`),
    
    updateProjectTeam: (projectId: string, teamIds: string[]): Promise<Project> => {
        return put(`/projects/${projectId}`, { teamIds });
    },

    addDepartment: (dept: Omit<Department, 'id'>): Promise<Department> => post('/departments', dept),
    updateDepartment: (id: string, data: Partial<Department>): Promise<Department> => put(`/departments/${id}`, data),
    deleteDepartment: (id: string): Promise<{ success: boolean }> => del(`/departments/${id}`),


    // Placeholder functions - these need to be connected to backend routes if they exist
    updateNotification: (id: string, data: Partial<Notification>): Promise<Notification | null> => Promise.resolve(null),
    updatePurchaseRequest: (id: string, data: Partial<PurchaseRequest>): Promise<PurchaseRequest | null> => Promise.resolve(null),
    updateInvoice: (id: string, data: Partial<Invoice>): Promise<Invoice | null> => Promise.resolve(null),
    addPurchaseRequest: (requestData: Omit<PurchaseRequest, 'id' | 'status' | 'requesterId' | 'requestDate'>, currentUserId: string): Promise<PurchaseRequest | null> => Promise.resolve(null),
    addInvoice: (invoiceData: Omit<Invoice, 'id' | 'status'>): Promise<Invoice | null> => Promise.resolve(null),
    addProjectFile: (projectId: string, fileName: string): Promise<Project | null> => Promise.resolve(null),
    deleteProjectFile: (projectId: string, fileName: string): Promise<Project | null> => Promise.resolve(null),
    convertIdeaToProject: (ideaId: string): Promise<{ project: Project, tasks: Task[], idea: Idea } | null> => Promise.resolve(null),
    addEvaluation: (data: Partial<Evaluation>): Promise<Evaluation | null> => Promise.resolve(null),
    // FIX: Updated signature to be consistent with other POST methods, accepting a single payload object.
    addAnnouncement: (data: Partial<Announcement>): Promise<Announcement | null> => Promise.resolve(null),
    addFeedback: (data: Omit<Feedback, 'id' | 'timestamp' | 'status'>): Promise<Feedback | null> => Promise.resolve(null),
};