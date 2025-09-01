
import React from 'react';
import { Feedback, FeedbackStatus, Resource, Department, Project } from '../../../types';
import { Plus, MessageSquare, Clock, Star, Tag, User, Briefcase, Building } from 'lucide-react';

interface FeedbackSupportTabProps {
    feedbackList: Feedback[];
    onNewFeedbackClick: () => void;
    resources: Resource[];
    departments: Department[];
    projects: Project[];
}

const getStatusStyle = (status: FeedbackStatus) => {
    switch(status) {
        case FeedbackStatus.Submitted: return 'bg-blue-100 text-blue-700';
        case FeedbackStatus.InProgress: return 'bg-yellow-100 text-yellow-700';
        case FeedbackStatus.Resolved: return 'bg-green-100 text-green-700';
        case FeedbackStatus.Closed: return 'bg-gray-200 text-gray-600';
        default: return 'bg-gray-100 text-gray-500';
    }
};

export const FeedbackSupportTab: React.FC<FeedbackSupportTabProps> = ({ feedbackList, onNewFeedbackClick, resources, departments, projects }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-text-primary">Geri Bildirimlerim</h2>
                    <p className="text-text-secondary mt-1">Gönderdiğiniz geri bildirimlerin durumunu buradan takip edebilirsiniz.</p>
                </div>
                <button
                    onClick={onNewFeedbackClick}
                    className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-project text-white rounded-lg hover:bg-project-focus transition-colors shadow-sm"
                >
                    <Plus size={18} />
                    <span>Yeni Geri Bildirim Gönder</span>
                </button>
            </div>

            <div className="space-y-4">
                {feedbackList.length > 0 ? (
                    feedbackList.map(fb => {
                        const assignee = resources.find(r => r.id === fb.assigneeResourceId);
                        const project = projects.find(p => p.id === fb.assigneeProjectId);
                        const department = departments.find(d => d.id === fb.assigneeDepartmentId);

                        return (
                            <div key={fb.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${getStatusStyle(fb.status)}`}>
                                            <MessageSquare size={18} />
                                        </div>
                                        <p className="font-medium text-text-primary truncate">{fb.subject}</p>
                                    </div>
                                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusStyle(fb.status)}`}>
                                        {fb.status}
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-secondary mt-3 pl-12">
                                    <div className="flex items-center gap-1.5" title="Kategori"><Tag size={14}/> {fb.category}</div>
                                    <div className="flex items-center gap-1.5" title="Puan"><Star size={14} className="text-yellow-500"/> {fb.rating}/5</div>
                                    <div className="flex items-center gap-1.5" title="Gönderim Zamanı"><Clock size={14}/> {fb.timestamp}</div>
                                    {assignee && <div className="flex items-center gap-1.5" title="Atanan"><User size={14}/> {assignee.name}</div>}
                                    {project && <div className="flex items-center gap-1.5" title="Proje"><Briefcase size={14}/> {project.name}</div>}
                                    {department && <div className="flex items-center gap-1.5" title="Departman"><Building size={14}/> {department.name}</div>}
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="text-center py-12 text-text-secondary">
                        <p>Henüz bir geri bildirim göndermediniz.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
