

// FIX: Removed self-import which caused a conflict.

export enum View {
    Dashboard = 'Pano',
    Calendar = 'Ajanda',
    Projects = 'İnovasyon Merkezi',
    Resources = 'Kaynak Yönetimi',
    Reports = 'Raporlar',
    Backend = 'Backend',
    HelpCenter = 'Yardım Merkezi'
}

export enum Role {
    Superadmin = 'Süper Admin', // Yetki Ağırlığı 1
    Admin = 'Admin',             // Yetki Ağırlığı 2 (Departman Müdürü)
    Manager = 'Yönetici',        // Yetki Ağırlığı 3 (Proje Yöneticisi)
    TeamLead = 'Ekip Lideri',    // Yetki Ağırlığı 4
    Member = 'Ekip Üyesi'        // Yetki Ağırlığı 5
}

export const roleAuthority: { [key in Role]: number } = {
    [Role.Superadmin]: 1,
    [Role.Admin]: 2,
    [Role.Manager]: 3,
    [Role.TeamLead]: 4,
    [Role.Member]: 5,
};

export interface Department {
    id: string;
    name: string;
    parentId?: string;
    managerId?: string;
    manager?: Resource;
}

export enum ProjectStatus {
    Active = 'Aktif',
    Planning = 'Planlama',
    Completed = 'Tamamlandı',
}

export enum Priority {
    High = 'Yüksek',
    Medium = 'Orta',
    Low = 'Düşük'
}

export enum TaskStatus {
    ToDo = 'Yapılacak',
    InProgress = 'Devam Ediyor',
    Done = 'Tamamlandı'
}

export enum RsvpStatus {
    Accepted = 'Katılıyorum',
    Declined = 'Katılamıyorum',
    Pending = 'Bekleniyor'
}

export enum IdeaStatus {
    New = 'Yeni Fikir',
    Evaluating = 'Değerlendirmede',
    Approved = 'Onaylandı',
    Archived = 'Arşivlendi',
}

export enum PurchaseRequestStatus {
    Pending = 'Onay Bekliyor',
    Approved = 'Onaylandı',
    Rejected = 'Reddedildi',
}

export enum InvoiceStatus {
    Unpaid = 'Ödenmedi',
    Paid = 'Ödendi',
}

export enum VoteStatus {
    Supports = 'Destekliyor',
    Neutral = 'Nötr',
    Opposed = 'Karşı',
}

export enum FeedbackCategory {
    BugReport = 'Hata Bildirimi',
    FeatureRequest = 'Özellik Talebi',
    General = 'Genel Yorum',
}

export enum FeedbackStatus {
    Submitted = 'Gönderildi',
    InProgress = 'İnceleniyor',
    Resolved = 'Çözüldü',
    Closed = 'Kapatıldı',
}


export interface Idea {
    id: string;
    name: string; // Fikir Başlığı
    status: IdeaStatus;
    authorId: string;
// FIX: Made author optional to align with mock data shape.
    author?: Resource;
    
    // Temel Bilgiler
    category?: string;
    description?: string;
    summary?: string;
    
    // Problem Analizi
    problem?: string;
    problemType?: 'Teknik' | 'Operasyonel' | 'Stratejik' | 'Diğer';
    problemFrequency?: 'Sık' | 'Ara Sıra' | 'Nadir';
    solution?: string;
    
    // Stratejik Çerçeve
    benefits?: string;
    targetAudience?: string;
    relatedDepartments?: string[];
    
    // Atamalar ve Sorumluluk
    projectLeaderId?: string;
// FIX: Made projectLeader optional to align with mock data shape.
    projectLeader?: Resource;
// FIX: Changed potentialTeam to be an array of strings (resource IDs).
    potentialTeam?: string[];
    
    // Zaman Planı
    estimatedDuration?: string;
    timelinePhases?: { name: string; duration: string }[];
    criticalMilestones?: string;
    
    // Bütçe Planı
    totalBudget?: number;
    budgetItems?: { name: string; amount: number }[];
    
    // ROI Analizi
    expectedRevenueIncrease?: number; // Yeni
    expectedCostSavings?: number; // Yeni
    expectedROI?: number;
    fundingSources?: string;
    revenueSources?: string;

    // SWOT Analizi
    swotStrengths?: string;
    swotWeaknesses?: string;
    swotOpportunities?: string;
    swotThreats?: string;
    
    // Risk Analizi
    risks?: string;
    riskLevel?: 'Yüksek' | 'Orta' | 'Düşük'; // Yeni
    mitigations?: string;
    
    // Başarı Kriterleri
    successCriteria?: string;

    // Destek
    files?: string[];
    tags?: string[];
    priority?: Priority;
    creationDate?: string;
}

export interface Project {
    id: string;
    name: string;
    code: string;
    status: ProjectStatus;
    priority: Priority;
    startDate: string;
    endDate: string;
    progress: number;
    managerId: string;
// FIX: Made manager optional to align with mock data shape.
    manager?: Resource;
// FIX: Changed team to be an array of strings (resource IDs).
    team: string[];
    budget: number;
    color: string;
    files?: string[];
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: Priority;
    assigneeId: string;
// FIX: Made assignee optional to align with mock data shape.
    assignee?: Resource; 
    reporterId?: string;
// FIX: Made reporter optional to align with mock data shape.
    reporter?: Resource;
    projectId: string;
// FIX: Made project optional to align with mock data shape.
    project?: Project;
    category?: string;
    estimatedHours?: number;
    startDate?: string;
    endDate?: string;
    completionDate?: string;
    dependencies?: string[]; // Bağımlı Görevler
    tags?: string[];
    progress?: number; // İlerleme
    spentHours?: number; // Harcanan Süre
    notes?: string;
    files?: string[];
}

export enum EmploymentType {
    FullTime = 'Tam Zamanlı',
    PartTime = 'Yarı Zamanlı',
    Contractor = 'Sözleşmeli',
    Intern = 'Stajyer',
}

export interface Resource {
    id:string;
    name: string;
    initials: string;
    position: string;
    departmentId: string;
    department?: Department;
    email?: string;
    phone?: string;
    startDate?: string;
    employmentType?: EmploymentType;
    skills: string[];
    weeklyHours: number;
    currentLoad: number;
    managerId?: string;
    bio?: string;
    earnedBadges?: string[];
}

export enum EventType {
    Appointment = 'Randevu',
    Task = 'Görev',
    Meeting = 'Toplantı',
    Event = 'Etkinlik',
    Note = 'Not'
}

export interface Event {
    id:string;
    title: string;
    date: string; // This can be start date for tasks
    type: EventType;
    description?: string;
    content?: string;
    tags?: string[];
    startTime?: string;
    endTime?: string;
    location?: string;
// FIX: Changed participants to be an array of strings (resource IDs).
    participants?: string[];
    priority?: Priority;
    reminder?: string;
    projectId?: string;
    project?: Project;
    ideaId?: string;
    idea?: Idea;
    files?: string[];
    assigneeId?: string;
    assignee?: Resource;
    status?: TaskStatus; // For tasks on the calendar
    rsvp?: { [participantId: string]: RsvpStatus };

    // New detailed task fields
    reporterId?: string;
    reporter?: Resource;
    category?: string;
    estimatedHours?: number;
    startDate?: string;
    endDate?: string;
    completionDate?: string;
    dependencies?: string[];
    progress?: number;
    spentHours?: number;
    notes?: string;
}

export enum NotificationType {
    Info = 'Bilgi',
    TaskCompleted = 'Görev Tamamlandı',
    Overload = 'Aşırı Yük',
    ProjectRisk = 'Proje Riski',
    TaskAssigned = 'Görev Atandı',
    NewProject = 'Yeni Proje',
    MeetingInvite = 'Toplantı Daveti',
    NewPurchaseRequest = 'Yeni Satın Alma Talebi',
    NewInvoice = 'Yeni Fatura',
    Mention = 'Bahsedilme',
}

export interface Notification {
    id: string;
    message: string;
    timestamp: string;
    read: boolean;
    authorId: string;
// FIX: Made author optional to align with mock data shape.
    author?: Resource;
    type: NotificationType;
    eventId?: string;
}

export interface Comment {
    id: string;
    authorId: string;
// FIX: Made author optional to align with mock data shape.
    author?: Resource;
    text: string;
    timestamp: string;
    votes?: { [userId: string]: VoteStatus };
    projectId?: string;
    ideaId?: string;
}

export interface Evaluation {
    id: string;
    authorId: string;
// FIX: Made author optional to align with mock data shape.
    author?: Resource;
    text: string;
    vote: VoteStatus;
    timestamp: string;
    projectId?: string;
    ideaId?: string;
}


export interface PurchaseRequest {
    id: string;
    projectId: string;
// FIX: Made project optional to align with mock data shape.
    project?: Project;
    requesterId: string;
// FIX: Made requester optional to align with mock data shape.
    requester?: Resource;
    item: string;
    quantity: number;
    unitPrice: number;
    status: PurchaseRequestStatus;
    requestDate: string;
    files?: string[];
    link?: string;
}

export interface Invoice {
    id: string;
    projectId: string;
// FIX: Made project optional to align with mock data shape.
    project?: Project;
    invoiceNumber: string;
    amount: number;
    status: InvoiceStatus;
    issueDate: string;
    dueDate: string;
}

export interface User {
    id: string;
    username: string;
    role: Role;
    departmentId?: string;
}

export interface PerformanceEvaluation {
    id: string;
    resourceId: string;
    evaluatorId: string; // ID of the resource who made the evaluation
    date: string;
    rating: number; // e.g., 1-5
    comment: string;
    goals?: { goal: string; completed: boolean }[];
}

export interface Announcement {
    id: string;
    title: string;
    content: string;
    authorId: string;
// FIX: Made author optional to align with mock data shape.
    author?: Resource;
    timestamp: string;
    departmentId?: 'all' | string;
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: React.ElementType;
}

export interface Feedback {
    id: string;
    authorId: string | null;
    author?: Resource | null;
    category: FeedbackCategory;
    rating: number; // 1-5
    subject: string;
    description: string;
    files: { name: string; type: string; size: number }[];
    contextUrl: string;
    userAgent: string;
    assigneeDepartmentId?: string;
    assigneeProjectId?: string;
    assigneeResourceId?: string;
    timestamp: string;
    status: FeedbackStatus;
}

// Backend View Types
export enum SystemStatus {
    Healthy = 'Sağlıklı',
    Warning = 'Uyarı',
    Error = 'Hata',
}

export interface SystemMetric {
    id: string;
    name: string;
    value: string;
    status: SystemStatus;
}

export interface ApiLog {
    id: string;
    timestamp: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    endpoint: string;
    statusCode: number;
    responseTime: number; // in ms
}

export interface DatabaseStats {
    tableName: string;
    rowCount: number;
    size: string; // e.g., '12.5 MB'
}