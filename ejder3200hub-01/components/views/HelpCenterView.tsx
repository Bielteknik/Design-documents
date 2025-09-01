
import React, { useState } from 'react';
import { useProAjandaStore } from '../../hooks/useProAjandaStore';
import { User, Feedback } from '../../types';
import { FeedbackModal } from '../FeedbackModal';
import { FeedbackSupportTab } from './help_center/FeedbackSupportTab';
import { FaqTab } from './help_center/FaqTab';
import { MessageSquare, HelpCircle } from 'lucide-react';

interface HelpCenterViewProps {
    store: ReturnType<typeof useProAjandaStore>;
    currentUser: User;
}

export const HelpCenterView: React.FC<HelpCenterViewProps> = ({ store, currentUser }) => {
    const [activeTab, setActiveTab] = useState<'feedback' | 'faq'>('feedback');
    const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false);

    const handleFeedbackSubmit = (data: Omit<Feedback, 'id' | 'timestamp' | 'status'>) => {
        store.addFeedback(data);
        setFeedbackModalOpen(false);
    };

    const tabOptions = [
        { id: 'feedback', label: 'Geri Bildirim & Destek', icon: MessageSquare },
        { id: 'faq', label: 'Sıkça Sorulan Sorular', icon: HelpCircle },
    ];

    return (
        <div className="space-y-6 animate-fadeIn">
            <FeedbackModal
                isOpen={isFeedbackModalOpen}
                onClose={() => setFeedbackModalOpen(false)}
                onSubmit={handleFeedbackSubmit}
                currentUser={currentUser}
                departments={store.departments}
                projects={store.projects}
                resources={store.resources}
            />
            <div>
                <h1 className="text-3xl font-bold text-text-primary">Yardım Merkezi</h1>
                <p className="text-text-secondary mt-1">Sorularınıza yanıt bulun ve bizimle iletişime geçin.</p>
            </div>
            
            <div className="border-b border-border-color">
                <nav className="-mb-px flex space-x-4 overflow-x-auto" aria-label="Tabs">
                    {tabOptions.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as 'feedback' | 'faq')}
                            className={`flex-shrink-0 flex items-center gap-2 px-3 py-3 text-sm font-medium border-b-2 transition-colors duration-200 focus:outline-none ${
                                activeTab === tab.id
                                    ? 'border-b-project text-project'
                                    : 'border-transparent text-text-secondary hover:text-project focus:border-b-project'
                            }`}
                        >
                            <tab.icon className="h-5 w-5" />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </nav>
            </div>
            
            <div className="mt-6">
                {activeTab === 'feedback' && (
                    <FeedbackSupportTab 
                        feedbackList={store.feedback.filter(f => f.authorId === currentUser.id || f.authorId === null)} 
                        onNewFeedbackClick={() => setFeedbackModalOpen(true)}
                        resources={store.resources}
                        departments={store.departments}
                        projects={store.projects}
                    />
                )}
                {activeTab === 'faq' && <FaqTab />}
            </div>
        </div>
    );
};
