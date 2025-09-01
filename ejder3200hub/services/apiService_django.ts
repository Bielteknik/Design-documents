// Django REST API Service
import { 
    Project, Task, Resource, Event, Idea, Comment, Department,
    PurchaseRequest, Invoice, Feedback 
} from '../types';

// Django REST API Base URL (default port 8000)
const API_BASE_URL = 'http://localhost:8000/api/v1';

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

const get = <T>(endpoint: string): Promise<T> => 
    fetch(`${API_BASE_URL}${endpoint}`)
        .then(handleResponse);

const post = <T>(endpoint: string, body: any): Promise<T> => 
    fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    }).then(handleResponse);

const put = <T>(endpoint: string, body: any): Promise<T> => 
    fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    }).then(handleResponse);

const patch = <T>(endpoint: string, body: any): Promise<T> => 
    fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    }).then(handleResponse);

const del = (endpoint: string): Promise<{success: boolean}> => 
    fetch(`${API_BASE_URL}${endpoint}`, { method: 'DELETE' })
        .then(handleResponse);

// Django pagination response interface
interface DjangoPaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export const djangoApiService = {
    // RESOURCES & DEPARTMENTS
    getResources: (): Promise<Resource[]> => 
        get<DjangoPaginatedResponse<Resource>>('/resources/').then(res => res.results),
    
    getResource: (id: string): Promise<Resource> => 
        get(`/resources/${id}/`),
    
    addResource: (data: Partial<Resource>): Promise<Resource> => 
        post('/resources/', data),
    
    updateResource: (id: string, data: Partial<Resource>): Promise<Resource> => 
        put(`/resources/${id}/`, data),
    
    deleteResource: (id: string): Promise<{success: boolean}> => 
        del(`/resources/${id}/`),

    getResourcesByRole: (): Promise<{[key: string]: {name: string, resources: Resource[]}}>  => 
        get('/resources/by_role/'),

    getManagers: (): Promise<Resource[]> => 
        get('/resources/managers/'),

    getDepartments: (): Promise<Department[]> => 
        get<DjangoPaginatedResponse<Department>>('/departments/').then(res => res.results),
    
    getDepartment: (id: string): Promise<Department> => 
        get(`/departments/${id}/`),
    
    addDepartment: (data: Partial<Department>): Promise<Department> => 
        post('/departments/', data),
    
    updateDepartment: (id: string, data: Partial<Department>): Promise<Department> => 
        put(`/departments/${id}/`, data),
    
    deleteDepartment: (id: string): Promise<{success: boolean}> => 
        del(`/departments/${id}/`),

    getDepartmentHierarchy: (): Promise<Department[]> => 
        get('/departments/hierarchy/'),

    // PROJECTS & TASKS
    getProjects: (): Promise<Project[]> => 
        get<DjangoPaginatedResponse<Project>>('/projects/').then(res => res.results),
    
    getProject: (id: string): Promise<Project> => 
        get(`/projects/${id}/`),
    
    addProject: (data: Partial<Project>): Promise<Project> => 
        post('/projects/', data),
    
    updateProject: (id: string, data: Partial<Project>): Promise<Project> => 
        put(`/projects/${id}/`, data),
    
    deleteProject: (id: string): Promise<{success: boolean}> => 
        del(`/projects/${id}/`),

    getProjectStatistics: (): Promise<{total_projects: number, average_progress: number, status_breakdown: {[key: string]: number}}> => 
        get('/projects/statistics/'),

    getProjectTasks: (projectId: string, status?: string): Promise<Task[]> => {
        const params = status ? `?status=${status}` : '';
        return get(`/projects/${projectId}/tasks/${params}`);
    },

    updateProjectProgress: (id: string, progress: number): Promise<Project> => 
        post(`/projects/${id}/update_progress/`, { progress }),

    getTasks: (): Promise<Task[]> => 
        get<DjangoPaginatedResponse<Task>>('/tasks/').then(res => res.results),
    
    getTask: (id: string): Promise<Task> => 
        get(`/tasks/${id}/`),
    
    addTask: (data: Partial<Task>): Promise<Task> => 
        post('/tasks/', data),
    
    updateTask: (id: string, data: Partial<Task>): Promise<Task> => 
        put(`/tasks/${id}/`, data),
    
    deleteTask: (id: string): Promise<{success: boolean}> => 
        del(`/tasks/${id}/`),

    getMyTasks: (assigneeId: string): Promise<Task[]> => 
        get(`/tasks/my_tasks/?assignee_id=${assigneeId}`),

    getTaskStatistics: (): Promise<{total_tasks: number, status_breakdown: {[key: string]: number}, priority_breakdown: {[key: string]: number}}> => 
        get('/tasks/statistics/'),

    // IDEAS & VOTES
    getIdeas: (): Promise<Idea[]> => 
        get<DjangoPaginatedResponse<Idea>>('/ideas/').then(res => res.results),
    
    getIdea: (id: string): Promise<Idea> => 
        get(`/ideas/${id}/`),
    
    addIdea: (data: Partial<Idea>): Promise<Idea> => 
        post('/ideas/', data),
    
    updateIdea: (id: string, data: Partial<Idea>): Promise<Idea> => 
        put(`/ideas/${id}/`, data),
    
    deleteIdea: (id: string): Promise<{success: boolean}> => 
        del(`/ideas/${id}/`),

    // EVENTS & RSVPS
    getEvents: (): Promise<Event[]> => 
        get<DjangoPaginatedResponse<Event>>('/events/').then(res => res.results),
    
    getEvent: (id: string): Promise<Event> => 
        get(`/events/${id}/`),
    
    addEvent: (data: Partial<Event>): Promise<Event> => 
        post('/events/', data),
    
    updateEvent: (id: string, data: Partial<Event>): Promise<Event> => 
        put(`/events/${id}/`, data),
    
    deleteEvent: (id: string): Promise<{success: boolean}> => 
        del(`/events/${id}/`),

    // COMMENTS
    getComments: (): Promise<Comment[]> => 
        get<DjangoPaginatedResponse<Comment>>('/comments/').then(res => res.results),
    
    getComment: (id: string): Promise<Comment> => 
        get(`/comments/${id}/`),
    
    addComment: (data: Partial<Comment>): Promise<Comment> => 
        post('/comments/', data),
    
    updateComment: (id: string, data: Partial<Comment>): Promise<Comment> => 
        put(`/comments/${id}/`, data),
    
    deleteComment: (id: string): Promise<{success: boolean}> => 
        del(`/comments/${id}/`),

    // FEEDBACK
    getFeedbacks: (): Promise<Feedback[]> => 
        get<DjangoPaginatedResponse<Feedback>>('/feedbacks/').then(res => res.results),
    
    addFeedback: (data: Partial<Feedback>): Promise<Feedback> => 
        post('/feedbacks/', data),

    // PURCHASE REQUESTS
    getPurchaseRequests: (): Promise<PurchaseRequest[]> => 
        get<DjangoPaginatedResponse<PurchaseRequest>>('/purchase-requests/').then(res => res.results),
    
    addPurchaseRequest: (data: Partial<PurchaseRequest>): Promise<PurchaseRequest> => 
        post('/purchase-requests/', data),

    // INVOICES
    getInvoices: (): Promise<Invoice[]> => 
        get<DjangoPaginatedResponse<Invoice>>('/invoices/').then(res => res.results),
    
    addInvoice: (data: Partial<Invoice>): Promise<Invoice> => 
        post('/invoices/', data),

    // UTILITY FUNCTIONS
    search: (endpoint: string, query: string): Promise<any[]> => 
        get(`${endpoint}?search=${encodeURIComponent(query)}`),

    filter: (endpoint: string, filters: {[key: string]: any}): Promise<any[]> => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params.append(key, value.toString());
            }
        });
        return get(`${endpoint}?${params.toString()}`);
    },
};

// Backward compatibility wrapper
export const apiService = {
    ...djangoApiService,
    // Keep the original function names for compatibility
    getProjects: djangoApiService.getProjects,
    getTasks: djangoApiService.getTasks,
    getTask: djangoApiService.getTask,
    getResources: djangoApiService.getResources,
    getEvents: djangoApiService.getEvents,
    getDepartments: djangoApiService.getDepartments,
    getIdeas: djangoApiService.getIdeas,
    getComments: djangoApiService.getComments,
    
    updateTask: djangoApiService.updateTask,
    updateProject: djangoApiService.updateProject,
    addComment: djangoApiService.addComment,
    updateComment: djangoApiService.updateComment,
    deleteComment: djangoApiService.deleteComment,
    addEvent: djangoApiService.addEvent,
    updateEvent: djangoApiService.updateEvent,
    addIdea: djangoApiService.addIdea,
    updateIdea: djangoApiService.updateIdea,
    deleteIdea: djangoApiService.deleteIdea,
    addResource: djangoApiService.addResource,
    updateResource: djangoApiService.updateResource,
    deleteResource: djangoApiService.deleteResource,
    addDepartment: djangoApiService.addDepartment,
    updateDepartment: djangoApiService.updateDepartment,
    deleteDepartment: djangoApiService.deleteDepartment,
};