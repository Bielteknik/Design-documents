


import React, { useState } from 'react';
import { Idea, IdeaStatus, Evaluation, Comment, VoteStatus, Resource, Priority } from '../../../types';
import { ThumbsUp, MessageSquare, Edit, Users, Clock, DollarSign, TrendingUp, Cpu, ShoppingBag, Speaker, Zap } from 'lucide-react';

interface IdeaBoardProps {
    ideas: Idea[];
    updateIdeaStatus: (ideaId: string, newStatus: IdeaStatus) => void;
    onCardClick: (idea: Idea) => void;
    onConvertToProject: (ideaId: string) => void;
    evaluations: Evaluation[];
    comments: Comment[];
    resources: Resource[];
}

const statusConfig: { [key in IdeaStatus]: { title: string; color: string; border: string; } } = {
    [IdeaStatus.New]: { title: 'Yeni Fikir', color: 'bg-status-blue-bg text-status-blue-text', border: 'border-blue-400' },
    [IdeaStatus.Evaluating]: { title: 'Değerlendirmede', color: 'bg-status-yellow-bg text-status-yellow-text', border: 'border-yellow-500' },
    [IdeaStatus.Approved]: { title: 'Onaylandı', color: 'bg-status-green-bg text-status-green-text', border: 'border-green-500' },
    [IdeaStatus.Archived]: { title: 'Arşivlendi', color: 'bg-gray-200 text-gray-700', border: 'border-gray-400' },
};

const categoryIcons: { [key: string]: React.ElementType } = {
    'Teknolojik Geliştirme': Cpu,
    'Yeni Ürün/Hizmet': ShoppingBag,
    'Pazarlama Stratejisi': Speaker,
    'İç Süreç İyileştirme': Zap,
    'Default': Zap,
};

const priorityTagStyle: { [key in Priority]: string } = {
  [Priority.High]: 'bg-status-red-bg text-status-red-text',
  [Priority.Medium]: 'bg-status-yellow-bg text-status-yellow-text',
  [Priority.Low]: 'bg-status-purple-bg text-status-purple-text',
};

const Avatar: React.FC<{ resource?: Resource }> = ({ resource }) => {
    if (!resource) return null;
    const avatarColors = ['bg-indigo-500', 'bg-teal-500', 'bg-amber-500', 'bg-rose-500', 'bg-cyan-500'];
    const getAvatarColor = (id: string) => avatarColors[id.charCodeAt(id.length-1) % avatarColors.length];

    return (
        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-xs ring-2 ring-white ${getAvatarColor(resource.id)}`} title={resource.name}>
            {resource.initials}
        </div>
    );
};


const IdeaCard: React.FC<{ 
    idea: Idea; 
    onClick: () => void;
    onConvertToProject: (ideaId: string) => void;
    likeCount: number;
    commentCount: number;
    resources: Resource[];
}> = ({ idea, onClick, onConvertToProject, likeCount, commentCount, resources }) => {
    const onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData("text", idea.id);
    };

    const config = statusConfig[idea.status];
    // FIX: Changed `idea.projectLeader` to `idea.projectLeaderId` to match the updated `Idea` type.
    const leader = resources.find(r => r.id === idea.projectLeaderId);
    const CategoryIcon = categoryIcons[idea.category || ''] || categoryIcons['Default'];

    const formattedBudget = idea.totalBudget ? new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(idea.totalBudget) : 'N/A';
    
    const leaderTeam = leader ? [leader] : [];

    return (
        <div 
            draggable 
            onClick={onClick}
            onDragStart={onDragStart}
            className={`bg-card-bg p-4 rounded-lg shadow-md-custom mb-4 cursor-pointer active:cursor-grabbing border-l-4 ${config.border} flex flex-col gap-3 hover:shadow-lg-custom hover:-translate-y-0.5 transition-all duration-200`}
        >
            {/* Header */}
            <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-2 rounded-lg">
                        <CategoryIcon className="w-6 h-6 text-text-secondary" />
                    </div>
                    <div>
                        <h4 className="font-bold text-md text-text-primary leading-tight">{idea.name}</h4>
                        <p className="text-sm text-text-secondary">{idea.category}</p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                   <span className={`text-xs font-semibold px-2 py-1 rounded-md ${config.color}`}>{idea.status}</span>
                   {idea.priority && <span className={`text-xs font-semibold px-2 py-1 rounded-md ${priorityTagStyle[idea.priority]}`}>{idea.priority}</span>}
                </div>
            </div>

            {/* Description */}
            <p className="text-sm text-text-secondary line-clamp-2">{idea.description}</p>
            
            {/* Metrics */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-text-secondary">
                <div className="flex items-center gap-2" title="Tahmini Bütçe"><DollarSign size={14} className="text-green-500"/> <span className="font-medium text-text-primary">{formattedBudget}</span></div>
                <div className="flex items-center gap-2" title="Tahmini Süre"><Clock size={14} className="text-blue-500"/> <span className="font-medium text-text-primary">{idea.estimatedDuration || 'N/A'}</span></div>
                <div className="flex items-center gap-2" title="Ekip Büyüklüğü"><Users size={14} className="text-purple-500"/> <span className="font-medium text-text-primary">{leaderTeam.length} kişi</span></div>
                <div className="flex items-center gap-2" title="Beklenen ROI"><TrendingUp size={14} className="text-orange-500"/> <span className="font-medium text-text-primary">ROI: %{idea.expectedROI || 'N/A'}</span></div>
            </div>

            {/* Interaction */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-text-secondary">
                        <ThumbsUp size={16} /> <span>{likeCount}</span>
                    </div>
                     <div className="flex items-center gap-1.5 text-sm font-semibold text-text-secondary">
                        <MessageSquare size={16} /> <span>{commentCount}</span>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    {leader && <Avatar resource={leader} />}
                    <button className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 border-2 border-dashed text-gray-400 font-bold text-xs ring-2 ring-white">
                       +
                    </button>
                    <button className="text-text-secondary hover:text-project p-2 rounded-full hover:bg-gray-100 transition-colors"><Edit size={16} /></button>
                </div>
            </div>
            
            {/* Footer */}
            <div className="border-t pt-3 flex items-center justify-between text-xs">
                {leader ? (
                    <div className="flex items-center gap-2">
                        <Avatar resource={leader} />
                        <div>
                            <p className="font-semibold text-text-primary">{leader.name}</p>
                            <p className="text-text-secondary">{leader.position}</p>
                        </div>
                    </div>
                ) : <div />}
                <p className="text-text-secondary">{idea.creationDate ? new Date(idea.creationDate).toLocaleDateString('tr-TR') : ''}</p>
            </div>
            
            {idea.status === IdeaStatus.Approved && (
                <div className="border-t pt-3 mt-3">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onConvertToProject(idea.id); }}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white text-sm font-semibold rounded-md hover:bg-green-700 transition"
                    >
                        <Zap size={16} /> Projeye Dönüştür
                    </button>
                </div>
            )}
        </div>
    );
};


interface IdeaColumnProps {
    status: IdeaStatus;
    ideas: Idea[];
    onDrop: (e: React.DragEvent<HTMLDivElement>, status: IdeaStatus) => void;
    onCardClick: (idea: Idea) => void;
    onConvertToProject: (ideaId: string) => void;
    evaluations: Evaluation[];
    comments: Comment[];
    resources: Resource[];
}

const IdeaColumn: React.FC<IdeaColumnProps> = ({ status, ideas, onDrop, onCardClick, onConvertToProject, evaluations, comments, resources }) => {
    const [isOver, setIsOver] = useState(false);

    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(true);
    };

    const onDragLeave = () => setIsOver(false);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(false);
        onDrop(e, status);
    };

    const config = statusConfig[status];

    return (
        <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={handleDrop}
            className={`bg-gray-100 rounded-lg p-4 transition-colors duration-300 ${isOver ? 'bg-gray-200' : ''}`}
        >
            <div className="flex items-center gap-2 mb-4">
                <div className={`w-2 h-2 rounded-full ${config.border.replace('border-','bg-')}`}></div>
                <h3 className="font-bold text-text-primary">{config.title}</h3>
                <span className="text-sm bg-gray-200 text-text-secondary rounded-full px-2 py-0.5">{ideas.length}</span>
            </div>
            <div className="space-y-4 min-h-[200px]">
                {ideas.map(idea => {
                    // FIX: Changed `e.itemId` to `e.ideaId` to match the updated `Evaluation` type.
                    const likeCount = evaluations.filter(e => e.ideaId === idea.id && e.vote === VoteStatus.Supports).length;
                    // FIX: Changed `c.itemId` to `c.ideaId` to match the updated `Comment` type.
                    const commentCount = comments.filter(c => c.ideaId === idea.id).length;
                    return (
                        <IdeaCard 
                            key={idea.id} 
                            idea={idea} 
                            onClick={() => onCardClick(idea)} 
                            onConvertToProject={onConvertToProject}
                            likeCount={likeCount}
                            commentCount={commentCount}
                            resources={resources}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export const IdeaBoard: React.FC<IdeaBoardProps> = ({ ideas, updateIdeaStatus, onCardClick, onConvertToProject, evaluations, comments, resources }) => {
    
    const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: IdeaStatus) => {
        const ideaId = e.dataTransfer.getData("text");
        const idea = ideas.find(i => i.id === ideaId);
        if (ideaId && idea && idea.status !== newStatus) {
            updateIdeaStatus(ideaId, newStatus);
        }
    };

    const statusesToDisplay = Object.values(IdeaStatus).filter(status => status !== IdeaStatus.Archived);
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statusesToDisplay.map(status => (
                <IdeaColumn
                    key={status}
                    status={status}
                    ideas={ideas.filter(i => i.status === status)}
                    onDrop={handleDrop}
                    onCardClick={onCardClick}
                    onConvertToProject={onConvertToProject}
                    evaluations={evaluations}
                    comments={comments}
                    resources={resources}
                />
            ))}
        </div>
    );
};