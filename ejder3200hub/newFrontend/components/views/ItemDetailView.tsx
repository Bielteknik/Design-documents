

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Project, Idea, Resource, Task, Comment, TaskStatus, ProjectStatus, Priority, IdeaStatus, User, PurchaseRequest, Invoice, PurchaseRequestStatus, InvoiceStatus, Evaluation, VoteStatus, Role } from '../../types';
import { ArrowLeft, Send, MessageSquare, Briefcase, DollarSign, BarChart2, Calendar, CheckCircle, Circle, Users, Tag, AlertCircle, TrendingUp, Target, Check, Type, Info, Flag, MoreVertical, Edit, Trash2, File, Plus, Upload, Download, FileText, ShoppingCart, Receipt, Lightbulb, Settings, PiggyBank, Clock, User as UserIcon, ThumbsUp, ThumbsDown, Hand, HelpCircle, Activity, ShieldCheck, Zap } from 'lucide-react';
import { useProAjandaStore } from '../../hooks/useProAjandaStore';


interface ItemDetailViewProps {
    item: Project | Idea;
    onClose: () => void;
    resources: Resource[];
    tasks: Task[];
    currentUser: User;
    purchaseRequests: PurchaseRequest[];
    invoices: Invoice[];
    evaluations: Evaluation[];
    comments: Comment[];
    store: ReturnType<typeof useProAjandaStore>;
    onManageTeam: (project: Project) => void;
    onAddPurchaseRequest: () => void;
    onAddInvoice: () => void;
    onEditIdea: (idea: Idea) => void;
    onAddTask: (projectId: string) => void;
}

const getStatusAndPriorityStyles = (status: ProjectStatus | IdeaStatus | PurchaseRequestStatus | InvoiceStatus, priority?: Priority) => {
    const statusTagStyle: { [key: string]: string } = {};
    statusTagStyle[ProjectStatus.Active] = 'bg-status-green-bg text-status-green-text';
    statusTagStyle[ProjectStatus.Planning] = 'bg-status-yellow-bg text-status-yellow-text';
    statusTagStyle[ProjectStatus.Completed] = 'bg-status-blue-bg text-status-blue-text';
    statusTagStyle[IdeaStatus.New] = 'bg-status-blue-bg text-status-blue-text';
    statusTagStyle[IdeaStatus.Evaluating] = 'bg-status-yellow-bg text-status-yellow-text';
    statusTagStyle[IdeaStatus.Approved] = 'bg-status-green-bg text-status-green-text';
    statusTagStyle[IdeaStatus.Archived] = 'bg-gray-200 text-gray-700';
    statusTagStyle[PurchaseRequestStatus.Pending] = 'bg-status-yellow-bg text-status-yellow-text';
    statusTagStyle[PurchaseRequestStatus.Approved] = 'bg-status-green-bg text-status-green-text';
    statusTagStyle[PurchaseRequestStatus.Rejected] = 'bg-status-red-bg text-status-red-text';
    statusTagStyle[InvoiceStatus.Unpaid] = 'bg-status-red-bg text-status-red-text';
    statusTagStyle[InvoiceStatus.Paid] = 'bg-status-green-bg text-status-green-text';

    const priorityTagStyle: { [key in Priority]: string } = {
      [Priority.High]: 'bg-status-red-bg text-status-red-text',
      [Priority.Medium]: 'bg-status-yellow-bg text-status-yellow-text',
      [Priority.Low]: 'bg-status-purple-bg text-status-purple-text',
    };
    
    return { statusClass: statusTagStyle[status], priorityClass: priority ? priorityTagStyle[priority] : '' };
};

const Avatar: React.FC<{ resource?: Resource, size?: 'sm' | 'md' }> = ({ resource, size = 'md' }) => {
    const sizeClass = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm';
    const avatarColors = ['bg-indigo-500', 'bg-teal-500', 'bg-amber-500', 'bg-rose-500', 'bg-cyan-500'];
    const getAvatarColor = (id: string) => avatarColors[id.charCodeAt(id.length-1) % avatarColors.length];

    if (!resource) return null;
    return (
        <div className={`${sizeClass} rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold ring-2 ring-white ${getAvatarColor(resource.id)}`} title={resource.name}>
            {resource.initials}
        </div>
    );
}

const DetailCard: React.FC<{ icon: React.ElementType, title: string, value: React.ReactNode, color: string }> = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border flex items-center gap-4">
        <div className={`p-3 rounded-lg`} style={{ backgroundColor: `${color}20`}}>
            <Icon size={24} className="flex-shrink-0" style={{ color }} />
        </div>
        <div>
            <p className="text-sm text-text-secondary">{title}</p>
            <p className="font-bold text-lg text-text-primary">{value}</p>
        </div>
    </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode; icon: React.ElementType; action?: React.ReactNode }> = ({ title, children, icon: Icon, action }) => (
    <div className="bg-white p-5 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
                <Icon className="w-6 h-6 text-text-secondary" />
                <h3 className="text-lg font-bold text-text-primary">{title}</h3>
            </div>
            {action}
        </div>
        <div className="space-y-4">{children}</div>
    </div>
);


const IdeaDetailRow: React.FC<{ icon: React.ElementType; label: string; children: React.ReactNode; }> = ({ icon: Icon, label, children }) => (
    <div className="py-3 border-b border-border-color last:border-b-0">
        <div className="flex items-center gap-3 text-sm font-semibold text-text-secondary mb-1">
            <Icon className="h-4 w-4" />
            <span>{label}</span>
        </div>
        <div className="pl-7 text-md text-text-primary whitespace-pre-wrap">{children}</div>
    </div>
);

export const ItemDetailView: React.FC<ItemDetailViewProps> = React.memo(({ item, onClose, resources, tasks, currentUser, purchaseRequests, invoices, evaluations, comments, store, onManageTeam, onAddPurchaseRequest, onAddInvoice, onEditIdea, onAddTask }) => {
    const [newComment, setNewComment] = useState('');
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [editingComment, setEditingComment] = useState<{ id: string; text: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const commentInputRef = useRef<HTMLTextAreaElement>(null);
    
    const [activeTab, setActiveTab] = useState<'interaction' | 'messages'>('interaction');
    const [newEvaluationText, setNewEvaluationText] = useState('');
    const [selectedVote, setSelectedVote] = useState<VoteStatus | null>(null);

    const [mentionQuery, setMentionQuery] = useState('');
    const [showMentions, setShowMentions] = useState(false);
    
    const itemComments = useMemo(() => {
        const itemId = item.id;
        const isProject = 'code' in item;
        return comments
            .filter(c => (isProject ? c.projectId === itemId : c.ideaId === itemId))
            .sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [comments, item]);


    const isProject = 'code' in item;

    const canEdit = useMemo(() => {
        if (!currentUser) return false;
        if (currentUser.role === Role.Admin) {
            return true;
        }
        if (isProject) { // isProject
            const project = item as Project;
            return project.team.includes(currentUser.id) || project.managerId === currentUser.id;
        }
        if ('authorId' in item) { // isIdea
            return item.authorId === currentUser.id;
        }
        return false;
    }, [item, currentUser, isProject]);

    const isIdeaEditable = !isProject && canEdit && (item.status === IdeaStatus.New || item.status === IdeaStatus.Evaluating);

    const handleDeleteIdea = (ideaId: string) => {
        if (window.confirm('Bu fikri silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
            store.deleteIdea(ideaId);
            onClose();
        }
    };

    const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        setNewComment(text);

        const cursorPos = e.target.selectionStart;
        const textUpToCursor = text.substring(0, cursorPos);
        const mentionMatch = textUpToCursor.match(/@(\w*)$/);

        if (mentionMatch) {
            setMentionQuery(mentionMatch[1]);
            setShowMentions(true);
        } else {
            setShowMentions(false);
        }
    };
    
    const insertMention = (user: Resource) => {
        const currentText = newComment;
        const cursorPos = commentInputRef.current?.selectionStart ?? currentText.length;
        const textUpToCursor = currentText.substring(0, cursorPos);
        const mentionMatch = textUpToCursor.match(/@(\w*)$/);
    
        if (mentionMatch) {
            const mentionStartIndex = mentionMatch.index ?? 0;
            const textBefore = currentText.substring(0, mentionStartIndex);
            const textAfter = currentText.substring(cursorPos);
            const mentionText = `@[${user.name}](${user.id}) `;
            setNewComment(textBefore + mentionText + textAfter);
        }
    
        setShowMentions(false);
        commentInputRef.current?.focus();
    };

    const filteredMentionSuggestions = useMemo(() => {
        if (!mentionQuery) return resources;
        return resources.filter(r => r.name.toLowerCase().includes(mentionQuery.toLowerCase()));
    }, [mentionQuery, resources]);


    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim()) {
            store.addComment(item, newComment, currentUser.id);
            setNewComment('');
        }
    };

    const handleDeleteComment = (commentId: string) => {
        store.deleteComment(commentId);
        setActiveMenu(null);
    };

    const handleStartEdit = (comment: Comment) => {
        setEditingComment({ id: comment.id, text: comment.text });
        setActiveMenu(null);
    };

    const handleCancelEdit = () => {
        setEditingComment(null);
    };

    const handleSaveEdit = () => {
        if (editingComment) {
            store.updateComment(editingComment.id, editingComment.text);
            setEditingComment(null);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && 'code' in item) {
            const file = e.target.files[0];
            store.addProjectFile(item.id, file.name);
        }
    };

    const handleAddEvaluation = (e: React.FormEvent) => {
        e.preventDefault();
        if (newEvaluationText.trim() && selectedVote) {
            const isProject = 'code' in item;
            store.addEvaluation({
                text: newEvaluationText,
                vote: selectedVote,
                projectId: isProject ? item.id : undefined,
                ideaId: !isProject ? item.id : undefined,
            });
            setNewEvaluationText('');
            setSelectedVote(null);
        }
    };
    
    const { statusClass, priorityClass } = getStatusAndPriorityStyles(item.status, isProject ? (item as Project).priority : (item as Idea).priority);

    const renderProjectDetails = (project: Project) => {
        const { manager } = project;
        const teamMembers = resources.filter(r => project.team.includes(r.id));
        const projectTasks = tasks.filter(t => t.projectId === project.id);
        const projectPurchaseRequests = purchaseRequests.filter(pr => pr.projectId === project.id).map(pr => ({ ...pr, requester: resources.find(r => r.id === pr.requesterId)! }));
        const projectInvoices = invoices.filter(inv => inv.projectId === project.id);
        const tasksByStatus = {
            [TaskStatus.ToDo]: projectTasks.filter(t => t.status === TaskStatus.ToDo),
            [TaskStatus.InProgress]: projectTasks.filter(t => t.status === TaskStatus.InProgress),
            [TaskStatus.Done]: projectTasks.filter(t => t.status === TaskStatus.Done),
        };
         const priorityColors: { [key in Priority]: string } = {
            [Priority.High]: 'bg-red-500',
            [Priority.Medium]: 'bg-yellow-500',
            [Priority.Low]: 'bg-blue-500',
        };
        
        const handleTaskStatusChange = (task: Task) => {
            if (!canEdit) return;
            switch(task.status) {
                case TaskStatus.ToDo:
                    store.updateTaskStatus(task.id, TaskStatus.InProgress);
                    break;
                case TaskStatus.InProgress:
                    store.updateTaskStatus(task.id, TaskStatus.Done);
                    break;
                case TaskStatus.Done:
                    store.updateTaskStatus(task.id, TaskStatus.InProgress);
                    break;
            }
        };

        return (
            <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <DetailCard icon={Briefcase} title="Proje Yöneticisi" value={manager?.name || 'N/A'} color="#7C3AED" />
                    <DetailCard icon={Calendar} title="Bitiş Tarihi" value={new Date(project.endDate).toLocaleDateString('tr-TR')} color="#3B82F6" />
                    <DetailCard icon={DollarSign} title="Bütçe" value={new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0 }).format(project.budget)} color="#22C55E" />
                    <DetailCard icon={BarChart2} title="İlerleme" value={`${project.progress}%`} color="#F59E0B" />
                </div>
                
                <Section title="Proje Künyesi" icon={Info}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                        <IdeaDetailRow icon={Info} label="Proje Kodu">{project.code}</IdeaDetailRow>
                        <IdeaDetailRow icon={Calendar} label="Başlangıç Tarihi">{new Date(project.startDate).toLocaleDateString('tr-TR')}</IdeaDetailRow>
                        <IdeaDetailRow icon={CheckCircle} label="Durum"><span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${statusClass}`}>{project.status}</span></IdeaDetailRow>
                        <IdeaDetailRow icon={Flag} label="Öncelik"><span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${priorityClass}`}>{project.priority}</span></IdeaDetailRow>
                    </div>
                </Section>
                
                <div className="space-y-6">
                    <Section 
                        title="Ekip Üyeleri" 
                        icon={Users}
                        action={canEdit && (
                            <button onClick={() => onManageTeam(project)} className="flex items-center gap-2 text-sm text-project px-3 py-1.5 rounded-md hover:bg-purple-50 transition-colors">
                                <Settings size={16}/> Yönet
                            </button>
                        )}
                    >
                         <div className="flex items-center gap-4 overflow-x-auto pb-3 -mx-5 px-5">
                            {teamMembers.map(member => (
                                <div key={member.id} className="flex-shrink-0 flex flex-col items-center text-center w-20">
                                    <Avatar resource={member} size="md" />
                                    <p className="font-semibold text-xs mt-2 truncate w-full">{member.name}</p>
                                    <p className="text-xs text-text-secondary truncate w-full">{member.position}</p>
                                </div>
                            ))}
                        </div>
                    </Section>
                    <Section 
                        title="Kilometre Taşları" 
                        icon={CheckCircle}
                        action={canEdit && (
                            <button onClick={() => onAddTask(project.id)} className="flex items-center gap-2 text-sm text-project px-3 py-1.5 rounded-md hover:bg-purple-50 transition-colors">
                                <Plus size={16}/> Yeni Görev Ekle
                            </button>
                        )}
                    >
                        {projectTasks.length > 0 ? (
                            <div className="h-80 overflow-y-auto pr-2 space-y-4">
                                {Object.entries(tasksByStatus).map(([status, statusTasks]) => statusTasks.length > 0 && (
                                    <div key={status}>
                                        <h4 className="font-semibold text-sm text-text-secondary mb-2">{status} ({statusTasks.length})</h4>
                                        <div className="space-y-2">
                                            {statusTasks.map(task => {
                                                const assignee = task.assignee;
                                                return (
                                                    <div key={task.id} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 transition-all">
                                                        <div className="flex items-center gap-3">
                                                            <button 
                                                                onClick={() => handleTaskStatusChange(task)}
                                                                disabled={!canEdit}
                                                                className="p-1 rounded-full hover:bg-gray-200 transition-colors flex-shrink-0 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                                                aria-label={`Change status for ${task.title}`}
                                                            >
                                                                {task.status === TaskStatus.Done ? <CheckCircle size={18} className="text-green-500" /> : <Circle size={18} className="text-gray-400" />}
                                                            </button>
                                                            <div>
                                                                <p className={`font-medium text-sm text-text-primary ${task.status === TaskStatus.Done ? 'line-through text-text-secondary' : ''}`}>{task.title}</p>
                                                                {task.endDate && <p className="text-xs text-text-secondary">Bitiş: {new Date(task.endDate).toLocaleDateString('tr-TR')}</p>}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className={`w-3 h-3 rounded-full flex-shrink-0 ${priorityColors[task.priority]}`} title={`${task.priority} Öncelik`}></span>
                                                            <Avatar resource={assignee} size="sm" />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                             <p className="text-sm text-text-secondary">Bu proje için görev bulunmuyor.</p>
                        )}
                    </Section>
                </div>
                
                <Section icon={File} title="Proje Dosyaları" action={canEdit && (
                    <>
                        <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
                        <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 text-sm bg-project text-white px-3 py-1.5 rounded-md hover:bg-project-focus transition-colors"><Upload size={16}/> Yükle</button>
                    </>
                )}>
                    <div className="divide-y">
                        {(project.files && project.files.length > 0) ? project.files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between py-2 group">
                                <div className="flex items-center gap-3">
                                    <FileText size={24} className="text-text-secondary"/>
                                    <p className="font-medium text-sm text-text-primary">{file}</p>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-1.5 text-text-secondary hover:text-project"><Download size={16}/></button>
                                    {canEdit && <button onClick={() => store.deleteProjectFile(project.id, file)} className="p-1.5 text-text-secondary hover:text-red-500"><Trash2 size={16}/></button>}
                                </div>
                            </div>
                        )) : <p className="text-sm text-text-secondary text-center py-4">Proje dosyası bulunmuyor.</p>}
                    </div>
                </Section>
                
                 <Section icon={ShoppingCart} title="Satın Alma Talepleri" action={canEdit && (
                    <button onClick={onAddPurchaseRequest} className="flex items-center gap-2 text-sm bg-project text-white px-3 py-1.5 rounded-md hover:bg-project-focus transition-colors"><Plus size={16}/> Yeni Talep</button>
                )}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="text-left text-text-secondary"><tr><th className="p-2">Ürün</th><th className="p-2">Tutar</th><th className="p-2">Talep Eden</th><th className="p-2">Durum</th></tr></thead>
                            <tbody>
                                {projectPurchaseRequests.map(req => {
                                    const { statusClass } = getStatusAndPriorityStyles(req.status);
                                    return (
                                        <tr key={req.id} className="border-b last:border-0">
                                            <td className="p-2 font-medium">{req.item}</td>
                                            <td className="p-2">{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(req.quantity * req.unitPrice)}</td>
                                            <td className="p-2">{req.requester.name}</td>
                                            <td className="p-2"><span className={`text-xs font-semibold px-2 py-1 rounded-md ${statusClass}`}>{req.status}</span></td>
                                        </tr>
                                    );
                                })}
                                {projectPurchaseRequests.length === 0 && <tr><td colSpan={4} className="text-center text-text-secondary py-4">Satın alma talebi yok.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </Section>

                <Section icon={Receipt} title="Faturalar" action={canEdit && (
                    <button onClick={onAddInvoice} className="flex items-center gap-2 text-sm bg-project text-white px-3 py-1.5 rounded-md hover:bg-project-focus transition-colors"><Plus size={16}/> Fatura Ekle</button>
                )}>
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="text-left text-text-secondary"><tr><th className="p-2">Fatura No</th><th className="p-2">Tutar</th><th className="p-2">Son Ödeme</th><th className="p-2">Durum</th></tr></thead>
                            <tbody>
                                {projectInvoices.map(inv => {
                                    const { statusClass } = getStatusAndPriorityStyles(inv.status);
                                    return (
                                        <tr key={inv.id} className="border-b last:border-0">
                                            <td className="p-2 font-medium">{inv.invoiceNumber}</td>
                                            <td className="p-2">{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(inv.amount)}</td>
                                            <td className="p-2">{new Date(inv.dueDate).toLocaleDateString('tr-TR')}</td>
                                            <td className="p-2"><span className={`text-xs font-semibold px-2 py-1 rounded-md ${statusClass}`}>{inv.status}</span></td>
                                        </tr>
                                    );
                                })}
                                {projectInvoices.length === 0 && <tr><td colSpan={4} className="text-center text-text-secondary py-4">Fatura kaydı yok.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </Section>
            </>
        )
    };
    const renderIdeaDetails = (idea: Idea) => {
        const author = resources.find(r => r.id === idea.authorId);
        const projectLeader = resources.find(r => r.id === idea.projectLeaderId);
        const potentialTeamMembers = resources.filter(r => idea.potentialTeam?.includes(r.id));

        const riskLevelStyles: { [key: string]: string } = {
            'Yüksek': 'bg-red-100 text-red-700',
            'Orta': 'bg-yellow-100 text-yellow-700',
            'Düşük': 'bg-green-100 text-green-700',
        };

        return (
            <>
                <div className="bg-white p-6 rounded-lg shadow-sm border space-y-2">
                    <h2 className="text-lg font-bold text-text-primary mb-2 flex items-center gap-3"><Info className="w-5 h-5 text-text-secondary"/>Temel Bilgiler</h2>
                    {author && <IdeaDetailRow icon={UserIcon} label="Oluşturan">
                        <div className="flex items-center gap-2 pt-1">
                            <Avatar resource={author} size="sm" />{author.name}
                        </div>
                    </IdeaDetailRow>}
                    {idea.description && <IdeaDetailRow icon={Type} label="Detaylı Açıklama">{idea.description}</IdeaDetailRow>}
                </div>

                <Section title="Problem Analizi" icon={HelpCircle}>
                    {idea.problem && <IdeaDetailRow icon={AlertCircle} label="Problem Tanımı">{idea.problem}</IdeaDetailRow>}
                    {idea.problemType && <IdeaDetailRow icon={Tag} label="Problem Türü">{idea.problemType}</IdeaDetailRow>}
                    {idea.problemFrequency && <IdeaDetailRow icon={BarChart2} label="Problem Sıklığı">{idea.problemFrequency}</IdeaDetailRow>}
                </Section>

                <Section title="Stratejik Çerçeve" icon={Target}>
                    {idea.solution && <IdeaDetailRow icon={CheckCircle} label="Çözüm Önerisi">{idea.solution}</IdeaDetailRow>}
                    {idea.benefits && <IdeaDetailRow icon={TrendingUp} label="Hedeflenen Faydalar">{idea.benefits}</IdeaDetailRow>}
                    {idea.targetAudience && <IdeaDetailRow icon={Users} label="Hedef Kitle">{idea.targetAudience}</IdeaDetailRow>}
                </Section>

                <Section title="ROI Analizi" icon={Activity}>
                    {idea.expectedRevenueIncrease != null && <IdeaDetailRow icon={TrendingUp} label="Beklenen Gelir Artışı">{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(idea.expectedRevenueIncrease)}</IdeaDetailRow>}
                    {idea.expectedCostSavings != null && <IdeaDetailRow icon={DollarSign} label="Maliyet Tasarrufu">{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(idea.expectedCostSavings)}</IdeaDetailRow>}
                </Section>

                <Section title="Risk Analizi" icon={ShieldCheck}>
                     {idea.riskLevel && <IdeaDetailRow icon={AlertCircle} label="Risk Seviyesi"><span className={`px-2 py-0.5 rounded-md text-sm font-medium ${riskLevelStyles[idea.riskLevel]}`}>{idea.riskLevel}</span></IdeaDetailRow>}
                     {idea.risks && <IdeaDetailRow icon={AlertCircle} label="Olası Riskler">{idea.risks}</IdeaDetailRow>}
                     {idea.mitigations && <IdeaDetailRow icon={Check} label="Önlemler">{idea.mitigations}</IdeaDetailRow>}
                </Section>

                <Section title="Atamalar ve Sorumluluk" icon={Users}>
                     {projectLeader && <IdeaDetailRow icon={UserIcon} label="Fikir Lideri">
                         <div className="flex items-center gap-2 pt-1"><Avatar resource={projectLeader} size="sm" />{projectLeader.name}</div>
                     </IdeaDetailRow>}
                     {potentialTeamMembers && potentialTeamMembers.length > 0 && <IdeaDetailRow icon={Users} label="Potansiyel Ekip">
                         <div className="flex flex-wrap items-center gap-4 pt-1">
                             {potentialTeamMembers.map(member => (
                                 <div key={member.id} className="flex items-center gap-2">
                                     <Avatar resource={member} size="sm"/>
                                     <span>{member.name}</span>
                                 </div>
                             ))}
                         </div>
                     </IdeaDetailRow>}
                     {idea.relatedDepartments && idea.relatedDepartments.length > 0 && 
                        <IdeaDetailRow icon={Briefcase} label="İlgili Departmanlar">
                            <div className="flex flex-wrap gap-2 pt-1">
                                {idea.relatedDepartments.map(dep => <span key={dep} className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">{dep}</span>)}
                            </div>
                        </IdeaDetailRow>
                    }
                </Section>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h2 className="text-lg font-bold text-text-primary mb-2 flex items-center gap-3 border-b pb-3"><Calendar className="w-5 h-5 text-text-secondary"/> Zaman Planı</h2>
                        {idea.estimatedDuration && <IdeaDetailRow icon={Clock} label="Tahmini Süre">{idea.estimatedDuration}</IdeaDetailRow>}
                        {idea.timelinePhases && idea.timelinePhases.length > 0 && idea.timelinePhases[0].name &&
                            <IdeaDetailRow icon={BarChart2} label="Aşamalar">
                                <ul className="list-disc pl-5 space-y-1 pt-1">
                                    {idea.timelinePhases.map((phase, i) => <li key={i}><strong>{phase.name}:</strong> {phase.duration}</li>)}
                                </ul>
                            </IdeaDetailRow>
                        }
                    </div>
                     <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h2 className="text-lg font-bold text-text-primary mb-2 flex items-center gap-3 border-b pb-3"><PiggyBank className="w-5 h-5 text-text-secondary"/> Bütçe Planı</h2>
                        {idea.totalBudget != null && <IdeaDetailRow icon={DollarSign} label="Toplam Bütçe">{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(idea.totalBudget)}</IdeaDetailRow>}
                        {idea.budgetItems && idea.budgetItems.length > 0 && idea.budgetItems[0].name &&
                            <IdeaDetailRow icon={BarChart2} label="Bütçe Kalemleri">
                                <table className="w-full text-sm mt-1">
                                    <tbody>
                                    {idea.budgetItems.map((item, i) => (
                                        <tr key={i}><td className="pr-4 py-0.5">{item.name}</td><td className="text-right font-semibold py-0.5">{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(item.amount || 0)}</td></tr>
                                    ))}
                                    </tbody>
                                </table>
                            </IdeaDetailRow>
                        }
                    </div>
                </div>
            </>
        )
    };
    
    return (
        <div className="flex h-[calc(100vh-4rem)] animate-fadeIn">
            {/* Left side: Scrollable Details */}
            <div className="w-full lg:w-2/3 p-4 md:p-6 lg:p-8 overflow-y-auto bg-main-bg">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <button onClick={onClose} className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-2 font-medium">
                            <ArrowLeft size={20} />
                            Geri Dön
                        </button>
                        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">{item.name}</h1>
                        {isProject && <p className="text-text-secondary">{(item as Project).code}</p>}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${statusClass}`}>{item.status}</span>
                        {priorityClass && <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${priorityClass}`}>{(item as Project).priority || (item as Idea).priority}</span>}
                         {!isProject && (item as Idea).status === IdeaStatus.Approved && (
                            <button
                                onClick={() => {
                                    store.convertIdeaToProject(item.id);
                                    onClose();
                                }}
                                className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm text-sm font-semibold"
                            >
                                <Zap size={14} /> Projeye Dönüştür
                            </button>
                        )}
                         {isProject && canEdit && (
                            <div className="flex items-center gap-1 ml-2 border-l pl-3">
                                <button title="Düzenle" className="text-text-secondary hover:text-project p-2 rounded-full hover:bg-gray-100 transition-colors"><Edit size={18} /></button>
                                <button title="Sil" className="text-text-secondary hover:text-red-500 p-2 rounded-full hover:bg-gray-100 transition-colors"><Trash2 size={18} /></button>
                            </div>
                        )}
                        {isIdeaEditable && (
                             <div className="flex items-center gap-1 ml-2 border-l pl-3">
                                <button onClick={() => onEditIdea(item as Idea)} title="Düzenle" className="text-text-secondary hover:text-project p-2 rounded-full hover:bg-gray-100 transition-colors"><Edit size={18} /></button>
                                <button onClick={() => handleDeleteIdea(item.id)} title="Sil" className="text-text-secondary hover:text-red-500 p-2 rounded-full hover:bg-gray-100 transition-colors"><Trash2 size={18} /></button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="space-y-6">
                    {isProject ? renderProjectDetails(item as Project) : renderIdeaDetails(item as Idea)}
                </div>
            </div>

            {/* Right side: Fixed Interaction Panel */}
            <div className="hidden lg:flex flex-col w-1/3 border-l border-gray-200 bg-white">
                <div className="p-2 border-b flex items-stretch gap-2 flex-shrink-0 bg-gray-50">
                    <button onClick={() => setActiveTab('interaction')} className={`flex-1 text-center font-semibold p-2 rounded-md transition-colors text-sm ${activeTab === 'interaction' ? 'bg-white shadow-sm text-project' : 'text-text-secondary hover:bg-gray-200'}`}>Etkileşim</button>
                    <button onClick={() => setActiveTab('messages')} className={`flex-1 text-center font-semibold p-2 rounded-md transition-colors text-sm ${activeTab === 'messages' ? 'bg-white shadow-sm text-project' : 'text-text-secondary hover:bg-gray-200'}`}>Mesajlar</button>
                </div>

                {activeTab === 'interaction' && (
                    <div className="flex flex-col flex-1 min-h-0">
                        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                           {evaluations.filter(ev => isProject ? ev.projectId === item.id : ev.ideaId === item.id).map(evaluation => {
                               const author = evaluation.author;
                               const voteConfig = {
                                   [VoteStatus.Supports]: { text: 'Destekliyor', color: 'text-green-600', icon: ThumbsUp },
                                   [VoteStatus.Neutral]: { text: 'Nötr', color: 'text-yellow-600', icon: Hand },
                                   [VoteStatus.Opposed]: { text: 'Karşı', color: 'text-red-600', icon: ThumbsDown },
                               };
                               const config = voteConfig[evaluation.vote];
                               const Icon = config.icon;
                               return (
                                   <div key={evaluation.id} className="flex items-start gap-3">
                                       <Avatar resource={author} size="sm" />
                                       <div className="flex-1">
                                           <div className="bg-gray-100 rounded-lg p-3">
                                               <div className="flex justify-between items-center">
                                                    <div>
                                                        <span className="font-semibold text-sm">{author?.name}</span>
                                                        <span className="text-xs text-text-secondary mx-2">•</span>
                                                        <span className={`text-xs font-semibold ${config.color} flex items-center gap-1`}><Icon size={12}/> {config.text}</span>
                                                    </div>
                                                    <p className="text-xs text-text-secondary">{evaluation.timestamp}</p>
                                               </div>
                                               <p className="text-sm mt-1">{evaluation.text}</p>
                                           </div>
                                       </div>
                                   </div>
                               )
                           })}
                        </div>
                        <form onSubmit={handleAddEvaluation} className="p-4 border-t bg-gray-50 space-y-3">
                            <textarea
                                value={newEvaluationText}
                                onChange={(e) => setNewEvaluationText(e.target.value)}
                                placeholder="Yorumunuzu yazın..."
                                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm resize-none"
                                rows={3}
                            />
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <button type="button" onClick={() => setSelectedVote(VoteStatus.Supports)} className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full transition-colors ${selectedVote === VoteStatus.Supports ? 'bg-green-100 text-green-700 ring-2 ring-green-200' : 'hover:bg-gray-200'}`}><ThumbsUp size={16}/> Destekliyor</button>
                                    <button type="button" onClick={() => setSelectedVote(VoteStatus.Neutral)} className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full transition-colors ${selectedVote === VoteStatus.Neutral ? 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-200' : 'hover:bg-gray-200'}`}><Hand size={16}/> Nötr</button>
                                    <button type="button" onClick={() => setSelectedVote(VoteStatus.Opposed)} className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full transition-colors ${selectedVote === VoteStatus.Opposed ? 'bg-red-100 text-red-700 ring-2 ring-red-200' : 'hover:bg-gray-200'}`}><ThumbsDown size={16}/> Karşı</button>
                                </div>
                                <button type="submit" disabled={!newEvaluationText || !selectedVote} className="px-4 py-2 bg-project text-white rounded-md hover:bg-project-focus transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold text-sm">Gönder</button>
                            </div>
                        </form>
                    </div>
                )}
                
                {activeTab === 'messages' && (
                    <>
                        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                        {itemComments.map(comment => {
                            const author = comment.author;
                            const isCurrentUser = author?.id === currentUser.id;
                            const votes = comment.votes || {};
                            const voteCounts = {
                                [VoteStatus.Supports]: 0,
                                [VoteStatus.Neutral]: 0,
                                [VoteStatus.Opposed]: 0,
                            };
                            Object.values(votes).forEach(vote => { voteCounts[vote]++; });
                            const currentUserVote = votes[currentUser.id];
                             
                            const formattedText = comment.text.replace(/@\[([^\]]+)\]\((\w+)\)/g, '<span class="bg-blue-200 text-blue-800 font-semibold rounded px-1 py-0.5">@$1</span>');


                            return (
                                <div key={comment.id} className="flex items-start gap-3 w-full">
                                    {!isCurrentUser && <Avatar resource={author} size="sm" />}
                                    
                                    <div className={`w-full max-w-sm group relative ${isCurrentUser ? 'ml-auto' : ''}`}>
                                        {editingComment?.id === comment.id ? (
                                            <div>
                                                <textarea
                                                    value={editingComment.text}
                                                    onChange={(e) => setEditingComment({ ...editingComment, text: e.target.value })}
                                                    className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                                    rows={3}
                                                    autoFocus
                                                />
                                                <div className="flex justify-end gap-2 mt-2">
                                                    <button onClick={handleCancelEdit} className="text-xs px-2 py-1 bg-gray-200 rounded">İptal</button>
                                                    <button onClick={handleSaveEdit} className="text-xs px-2 py-1 bg-blue-500 text-white rounded">Kaydet</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className={`rounded-lg p-3 ${isCurrentUser ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                                <div className="flex justify-between items-center">
                                                    <p className="font-semibold text-sm">{author?.name || 'Bilinmiyor'}</p>
                                                    <p className="text-xs text-text-secondary">{comment.timestamp}</p>
                                                </div>
                                                <p className="text-sm mt-1 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: formattedText }}></p>
                                                
                                                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200 -mx-3 px-3">
                                                    <button onClick={() => store.voteOnComment(comment.id, currentUser.id, VoteStatus.Supports)} className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full transition-colors ${currentUserVote === VoteStatus.Supports ? 'bg-green-100 text-green-700' : 'hover:bg-gray-200'}`}>
                                                        <ThumbsUp size={14}/>
                                                        {voteCounts[VoteStatus.Supports] > 0 && <span>{voteCounts[VoteStatus.Supports]}</span>}
                                                    </button>
                                                    <button onClick={() => store.voteOnComment(comment.id, currentUser.id, VoteStatus.Opposed)} className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full transition-colors ${currentUserVote === VoteStatus.Opposed ? 'bg-red-100 text-red-700' : 'hover:bg-gray-200'}`}>
                                                        <ThumbsDown size={14}/>
                                                        {voteCounts[VoteStatus.Opposed] > 0 && <span>{voteCounts[VoteStatus.Opposed]}</span>}
                                                    </button>
                                                    {isCurrentUser && (
                                                         <div className="relative ml-auto">
                                                            <button onClick={() => setActiveMenu(activeMenu === comment.id ? null : comment.id)} className="p-1 rounded-full hover:bg-gray-200">
                                                                <MoreVertical size={14} />
                                                            </button>
                                                             {activeMenu === comment.id && (
                                                                <div className="absolute right-0 bottom-full mb-1 w-28 bg-white rounded-md shadow-lg border z-10 text-xs">
                                                                    <button onClick={() => handleStartEdit(comment)} className="w-full text-left px-3 py-1.5 hover:bg-gray-100 flex items-center gap-2"><Edit size={12} /> Düzenle</button>
                                                                    <button onClick={() => handleDeleteComment(comment.id)} className="w-full text-left px-3 py-1.5 hover:bg-gray-100 text-red-600 flex items-center gap-2"><Trash2 size={12} /> Sil</button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                     {isCurrentUser && <Avatar resource={author} size="sm" />}
                                </div>
                            )
                        })}
                        </div>
                        <form onSubmit={handleAddComment} className="p-4 border-t bg-gray-50 relative">
                            {showMentions && filteredMentionSuggestions.length > 0 && (
                                <div className="absolute bottom-full left-4 right-4 mb-1 bg-white border rounded-lg shadow-lg max-h-40 overflow-y-auto z-10">
                                    {filteredMentionSuggestions.map(user => (
                                        <button 
                                            key={user.id} 
                                            type="button"
                                            onClick={() => insertMention(user)}
                                            className="w-full text-left flex items-center gap-2 p-2 hover:bg-gray-100 text-sm"
                                        >
                                            <Avatar resource={user} size="sm" />
                                            <span>{user.name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                            <div className="flex items-start gap-2">
                                <textarea
                                    ref={commentInputRef}
                                    value={newComment}
                                    onChange={handleCommentChange}
                                    placeholder="Mesajınızı yazın... @ ile bahsedin"
                                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm resize-none"
                                    rows={3}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleAddComment(e);
                                        }
                                    }}
                                />
                                <button type="submit" className="p-3 bg-project text-white rounded-lg hover:bg-project-focus transition-colors disabled:bg-gray-400">
                                    <Send size={20} />
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
});