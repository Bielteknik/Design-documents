import { 
    Project, Task, Resource, Event, Notification, Idea, PurchaseRequest, Invoice, Evaluation, 
    Comment, Department, PerformanceEvaluation, Announcement, Feedback, ApiLog, SystemMetric, DatabaseStats 
} from '../types';

// Django API response interface
interface DjangoListResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

// Django API Base URL
const DJANGO_API_BASE_URL = 'http://localhost:8000/api/v1';

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const errorText = await response.text();
        console.error("Django API Error Response:", errorText);
        try {
            const errorJson = JSON.parse(errorText);
            throw new Error(errorJson.detail || errorJson.error || `Request failed with status ${response.status}`);
        } catch (e) {
            throw new Error(errorText || `Request failed with status ${response.status}`);
        }
    }
    if (response.status === 204) { // No Content
        return { success: true };
    }
    return response.json();
};

const get = <T = any>(endpoint: string): Promise<T> => fetch(`${DJANGO_API_BASE_URL}${endpoint}`).then(handleResponse);

const post = <T = any>(endpoint: string, body: any): Promise<T> => fetch(`${DJANGO_API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
}).then(handleResponse);

const put = <T = any>(endpoint: string, body: any): Promise<T> => fetch(`${DJANGO_API_BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
}).then(handleResponse);

const patch = <T = any>(endpoint: string, body: any): Promise<T> => fetch(`${DJANGO_API_BASE_URL}${endpoint}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
}).then(handleResponse);

const del = (endpoint: string): Promise<{success: boolean}> => fetch(`${DJANGO_API_BASE_URL}${endpoint}`, { 
    method: 'DELETE' 
}).then(handleResponse);

// Django API adapter functions to transform data between frontend and backend formats
const prepareDjangoProjectPayload = (data: Partial<Project>) => {
    const { manager, team, startDate, endDate, ...rest } = data;
    const payload: any = { ...rest };
    // Remove readonly fields
    delete payload.createdAt;
    delete payload.updatedAt;
    if (manager) payload.manager = manager.id;
    if (team) payload.team = team; // Django expects array of strings
    if (startDate) payload.start_date = startDate;
    if (endDate) payload.end_date = endDate;
    return payload;
};

const prepareDjangoTaskPayload = (data: Partial<Task>) => {
    const { assignee, reporter, project, startDate, endDate, ...rest } = data;
    const payload: any = { ...rest };
    // Remove readonly fields
    delete payload.createdAt;
    delete payload.updatedAt;
    if (assignee) payload.assignee = assignee.id;
    if (reporter) payload.reporter = reporter.id;
    if (project) payload.project = project.id;
    if (startDate) payload.start_date = startDate;
    if (endDate) payload.end_date = endDate;
    return payload;
};

const prepareDjangoIdeaPayload = (data: Partial<Idea>) => {
    const { author, projectLeader, potentialTeam, relatedDepartments, ...rest } = data;
    const payload: any = { ...rest };
    // Remove readonly fields
    delete payload.createdAt;
    delete payload.updatedAt;
    if (author) payload.author = author.id;
    if (projectLeader) payload.project_leader = projectLeader.id;
    if (potentialTeam) payload.potential_team = potentialTeam;
    if (relatedDepartments) payload.related_departments = relatedDepartments;
    return payload;
};

const prepareDjangoEventPayload = (data: Partial<Event>) => {
    const { project, startTime, endTime, ...rest } = data;
    const payload: any = { ...rest };
    // Remove readonly fields
    delete payload.createdAt;
    delete payload.updatedAt;
    if (project) payload.project = project.id;
    if (startTime) payload.start_time = startTime;
    if (endTime) payload.end_time = endTime;
    return payload;
};

const prepareDjangoResourcePayload = (data: Partial<Resource>) => {
    const { startDate, ...rest } = data;
    const payload: any = { ...rest };
    // Remove readonly fields
    delete payload.createdAt;
    delete payload.updatedAt;
    if (startDate) payload.start_date = startDate;
    return payload;
};

const prepareDjangoCommentPayload = (data: Partial<Comment>) => {
    const { ...rest } = data;
    const payload: any = { ...rest };
    // Remove readonly fields
    delete payload.createdAt;
    delete payload.updatedAt;
    // Map frontend field names to Django field names
    if (data.authorId) payload.resource = data.authorId;
    if (data.author && typeof data.author === 'object') payload.resource = data.author.id;
    if (data.projectId) payload.project = data.projectId;
    if (data.ideaId) payload.idea = data.ideaId;
    // Map text to content for Django
    if (data.text) payload.content = data.text;
    return payload;
};

// Transform Django response to frontend format
const transformDjangoProject = (project: any): Project => ({
    ...project,
    startDate: project.start_date,
    endDate: project.end_date,
    createdAt: project.created_at,
    updatedAt: project.updated_at,
    manager: project.manager_name ? { id: project.manager, name: project.manager_name } : project.manager
});

const transformDjangoTask = (task: any): Task => ({
    ...task,
    startDate: task.start_date,
    endDate: task.end_date,
    createdAt: task.created_at,
    updatedAt: task.updated_at,
    assignee: task.assignee_name ? { id: task.assignee, name: task.assignee_name } : task.assignee,
    reporter: task.reporter_name ? { id: task.reporter, name: task.reporter_name } : task.reporter,
    project: task.project_name ? { id: task.project, name: task.project_name } : task.project
});

const transformDjangoResource = (resource: any): Resource => ({
    ...resource,
    startDate: resource.start_date,
    createdAt: resource.created_at,
    updatedAt: resource.updated_at
});

const transformDjangoIdea = (idea: any): Idea => ({
    ...idea,
    createdAt: idea.created_at,
    updatedAt: idea.updated_at,
    potentialTeam: idea.potential_team,
    relatedDepartments: idea.related_departments,
    author: idea.author_name ? { id: idea.author, name: idea.author_name } : idea.author,
    projectLeader: idea.project_leader_name ? { id: idea.project_leader, name: idea.project_leader_name } : idea.project_leader
});

const transformDjangoEvent = (event: any): Event => ({
    ...event,
    startTime: event.start_time,
    endTime: event.end_time,
    createdAt: event.created_at,
    updatedAt: event.updated_at,
    project: event.project_name ? { id: event.project, name: event.project_name } : event.project
});

export const djangoApiService = {
    // GETTERS
    getProjects: async (): Promise<Project[]> => {
        const response = await get<DjangoListResponse<any> | any[]>('/projects/');
        return Array.isArray(response) 
            ? response.map(transformDjangoProject) 
            : (response.results || []).map(transformDjangoProject);
    },
    
    getTasks: async (): Promise<Task[]> => {
        const response = await get<DjangoListResponse<any> | any[]>('/tasks/');
        return Array.isArray(response) 
            ? response.map(transformDjangoTask) 
            : (response.results || []).map(transformDjangoTask);
    },
    
    getTask: async (id: string): Promise<Task> => {
        const task = await get<any>(`/tasks/${id}/`);
        return transformDjangoTask(task);
    },
    
    getResources: async (): Promise<Resource[]> => {
        const response = await get<DjangoListResponse<any> | any[]>('/resources/');
        return Array.isArray(response) 
            ? response.map(transformDjangoResource) 
            : (response.results || []).map(transformDjangoResource);
    },
    
    getEvents: async (): Promise<Event[]> => {
        const response = await get<DjangoListResponse<any> | any[]>('/events/');
        return Array.isArray(response) 
            ? response.map(transformDjangoEvent) 
            : (response.results || []).map(transformDjangoEvent);
    },
    
    getDepartments: async (): Promise<Department[]> => {
        const response = await get<DjangoListResponse<Department> | Department[]>('/departments/');
        return Array.isArray(response) ? response : (response.results || []);
    },
    
    getIdeas: async (): Promise<Idea[]> => {
        const response = await get<DjangoListResponse<any> | any[]>('/ideas/');
        return Array.isArray(response) 
            ? response.map(transformDjangoIdea) 
            : (response.results || []).map(transformDjangoIdea);
    },
    
    getComments: async (): Promise<Comment[]> => {
        const response = await get<DjangoListResponse<Comment> | Comment[]>('/comments/');
        return Array.isArray(response) ? response : (response.results || []);
    },

    // Django-specific endpoints
    getInvoices: async (): Promise<Invoice[]> => {
        const response = await get<DjangoListResponse<Invoice> | Invoice[]>('/invoices/');
        return Array.isArray(response) ? response : (response.results || []);
    },
    
    getPurchaseRequests: async (): Promise<PurchaseRequest[]> => {
        const response = await get<DjangoListResponse<PurchaseRequest> | PurchaseRequest[]>('/purchase-requests/');
        return Array.isArray(response) ? response : (response.results || []);
    },
    
    getFeedback: async (): Promise<Feedback[]> => {
        const response = await get<DjangoListResponse<Feedback> | Feedback[]>('/feedbacks/');
        return Array.isArray(response) ? response : (response.results || []);
    },

    // MUTATIONS
    updateTask: async (id: string, data: Partial<Task>): Promise<Task> => {
        const payload = prepareDjangoTaskPayload(data);
        const task = await patch(`/tasks/${id}/`, payload);
        return transformDjangoTask(task);
    },
    
    updateProject: async (id: string, data: Partial<Project>): Promise<Project> => {
        const payload = prepareDjangoProjectPayload(data);
        const project = await patch(`/projects/${id}/`, payload);
        return transformDjangoProject(project);
    },

    addComment: async (payload: Partial<Comment>): Promise<Comment> => {
        const djangoPayload = prepareDjangoCommentPayload(payload);
        return post('/comments/', djangoPayload);
    },
    
    updateComment: async (id: string, data: Partial<Comment>): Promise<Comment> => {
        const payload = prepareDjangoCommentPayload(data);
        return patch(`/comments/${id}/`, payload);
    },
    
    deleteComment: async (id: string): Promise<{ success: boolean }> => {
        return del(`/comments/${id}/`);
    },

    addEvent: async (eventData: Omit<Event, 'id'>): Promise<Event> => {
        console.log('🔍 Frontend Event Data:', eventData);
        const payload = prepareDjangoEventPayload(eventData);
        console.log('🔄 Django Payload:', payload);
        try {
            const event = await post('/events/', payload);
            console.log('✅ Django Response:', event);
            return transformDjangoEvent(event);
        } catch (error) {
            console.error('❌ Event Creation Error:', error);
            throw error;
        }
    },
    
    updateEvent: async (id: string, data: Partial<Event>): Promise<Event> => {
        const payload = prepareDjangoEventPayload(data);
        const event = await patch(`/events/${id}/`, payload);
        return transformDjangoEvent(event);
    },
    
    addIdea: async (ideaData: Partial<Idea>): Promise<Idea> => {
        const payload = prepareDjangoIdeaPayload(ideaData);
        const idea = await post('/ideas/', payload);
        return transformDjangoIdea(idea);
    },
    
    updateIdea: async (id: string, data: Partial<Idea>): Promise<Idea> => {
        const payload = prepareDjangoIdeaPayload(data);
        const idea = await patch(`/ideas/${id}/`, payload);
        return transformDjangoIdea(idea);
    },
    
    deleteIdea: async (id: string): Promise<{ success: boolean }> => {
        return del(`/ideas/${id}/`);
    },

    addResource: async (resourceData: Partial<Resource>): Promise<Resource> => {
        const payload = prepareDjangoResourcePayload(resourceData);
        const resource = await post('/resources/', payload);
        return transformDjangoResource(resource);
    },
    
    updateResource: async (id: string, updatedResourceData: Partial<Resource>): Promise<Resource> => {
        const payload = prepareDjangoResourcePayload(updatedResourceData);
        const resource = await patch(`/resources/${id}/`, payload);
        return transformDjangoResource(resource);
    },
    
    deleteResource: async (id: string): Promise<{ success: boolean }> => {
        return del(`/resources/${id}/`);
    },
    
    updateProjectTeam: async (projectId: string, teamIds: string[]): Promise<Project> => {
        const project = await patch(`/projects/${projectId}/`, { team: teamIds });
        return transformDjangoProject(project);
    },

    addDepartment: async (dept: Omit<Department, 'id'>): Promise<Department> => {
        return post('/departments/', dept);
    },
    
    updateDepartment: async (id: string, data: Partial<Department>): Promise<Department> => {
        return patch(`/departments/${id}/`, data);
    },
    
    deleteDepartment: async (id: string): Promise<{ success: boolean }> => {
        return del(`/departments/${id}/`);
    },

    // Invoice operations
    addInvoice: async (invoiceData: Omit<Invoice, 'id' | 'status'>): Promise<Invoice> => {
        return post('/invoices/', invoiceData);
    },
    
    updateInvoice: async (id: string, data: Partial<Invoice>): Promise<Invoice> => {
        return patch(`/invoices/${id}/`, data);
    },

    // Purchase Request operations  
    addPurchaseRequest: async (requestData: Omit<PurchaseRequest, 'id' | 'status' | 'requesterId' | 'requestDate'>, currentUserId: string): Promise<PurchaseRequest> => {
        const payload = { ...requestData, requester_id: currentUserId };
        return post('/purchase-requests/', payload);
    },
    
    updatePurchaseRequest: async (id: string, data: Partial<PurchaseRequest>): Promise<PurchaseRequest> => {
        return patch(`/purchase-requests/${id}/`, data);
    },

    // Feedback operations
    addFeedback: async (data: Omit<Feedback, 'id' | 'timestamp' | 'status'>): Promise<Feedback> => {
        return post('/feedbacks/', data);
    },

    // Placeholder functions - not yet implemented in Django
    getNotifications: (): Promise<Notification[]> => Promise.resolve([]),
    getEvaluations: (): Promise<Evaluation[]> => Promise.resolve([]),
    getPerformanceEvaluations: (): Promise<PerformanceEvaluation[]> => Promise.resolve([]),
    getAnnouncements: (): Promise<Announcement[]> => Promise.resolve([]),
    getApiLogs: (): Promise<ApiLog[]> => Promise.resolve([]),
    getSystemMetrics: (): Promise<SystemMetric[]> => Promise.resolve([]),
    getDatabaseStats: (): Promise<DatabaseStats[]> => Promise.resolve([]),

    updateNotification: (id: string, data: Partial<Notification>): Promise<Notification | null> => Promise.resolve(null),
    addProjectFile: (projectId: string, fileName: string): Promise<Project | null> => Promise.resolve(null),
    deleteProjectFile: (projectId: string, fileName: string): Promise<Project | null> => Promise.resolve(null),
    convertIdeaToProject: (ideaId: string): Promise<{ project: Project, tasks: Task[], idea: Idea } | null> => Promise.resolve(null),
    addEvaluation: (data: Partial<Evaluation>): Promise<Evaluation | null> => Promise.resolve(null),
    addAnnouncement: (data: Partial<Announcement>): Promise<Announcement | null> => Promise.resolve(null),
};