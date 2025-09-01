// Mock API service for standalone frontend - no actual API calls
// All operations are performed in-memory using the store

export const mockApiService = {
    // Projects
    getProjects: async () => [],
    addProject: async (project: any) => ({ ...project, id: Date.now().toString() }),
    updateProject: async (id: string, updates: any) => ({ id, ...updates }),
    deleteProject: async (id: string) => ({ success: true }),

    // Tasks
    getTasks: async () => [],
    getTask: async (id: string) => null,
    addTask: async (task: any) => ({ ...task, id: Date.now().toString() }),
    updateTask: async (id: string, updates: any) => ({ id, ...updates }),
    deleteTask: async (id: string) => ({ success: true }),

    // Resources
    getResources: async () => [],
    addResource: async (resource: any) => ({ ...resource, id: Date.now().toString() }),
    updateResource: async (id: string, updates: any) => ({ id, ...updates }),
    deleteResource: async (id: string) => ({ success: true }),

    // Events
    getEvents: async () => [],
    addEvent: async (event: any) => ({ ...event, id: Date.now().toString() }),
    updateEvent: async (id: string, updates: any) => ({ id, ...updates }),
    deleteEvent: async (id: string) => ({ success: true }),

    // Ideas
    getIdeas: async () => [],
    addIdea: async (idea: any) => ({ ...idea, id: Date.now().toString() }),
    updateIdea: async (id: string, updates: any) => ({ id, ...updates }),
    deleteIdea: async (id: string) => ({ success: true }),

    // Comments
    getComments: async () => [],
    addComment: async (comment: any) => ({ ...comment, id: Date.now().toString() }),
    updateComment: async (id: string, updates: any) => ({ id, ...updates }),
    deleteComment: async (id: string) => ({ success: true }),

    // Evaluations
    getEvaluations: async () => [],
    addEvaluation: async (evaluation: any) => ({ ...evaluation, id: Date.now().toString() }),

    // Departments
    getDepartments: async () => [],
    addDepartment: async (dept: any) => ({ ...dept, id: Date.now().toString() }),
    updateDepartment: async (id: string, updates: any) => ({ id, ...updates }),
    deleteDepartment: async (id: string) => ({ success: true }),

    // Notifications
    getNotifications: async () => [],
    updateNotification: async (id: string, updates: any) => ({ id, ...updates }),

    // Purchase Requests
    getPurchaseRequests: async () => [],
    addPurchaseRequest: async (request: any) => ({ ...request, id: Date.now().toString() }),
    updatePurchaseRequest: async (id: string, updates: any) => ({ id, ...updates }),

    // Invoices
    getInvoices: async () => [],
    addInvoice: async (invoice: any) => ({ ...invoice, id: Date.now().toString() }),
    updateInvoice: async (id: string, updates: any) => ({ id, ...updates }),

    // Performance Evaluations
    getPerformanceEvaluations: async () => [],

    // Announcements
    getAnnouncements: async () => [],
    addAnnouncement: async (announcement: any) => ({ ...announcement, id: Date.now().toString() }),

    // Feedback
    getFeedback: async () => [],
    addFeedback: async (feedback: any) => ({ ...feedback, id: Date.now().toString() }),

    // System Data
    getApiLogs: async () => [],
    getSystemMetrics: async () => [],
    getDatabaseStats: async () => [],

    // Project specific operations
    addProjectFile: async (projectId: string, fileName: string) => ({ projectId, fileName }),
    deleteProjectFile: async (projectId: string, fileName: string) => ({ projectId, fileName }),
    updateProjectTeam: async (projectId: string, teamIds: string[]) => ({ projectId, teamIds }),
    convertIdeaToProject: async (ideaId: string) => ({ 
        project: { id: Date.now().toString() }, 
        idea: { id: ideaId }, 
        tasks: [] 
    }),
};

// Export the mock service as the main API service for the standalone frontend
export const currentApiService = mockApiService;