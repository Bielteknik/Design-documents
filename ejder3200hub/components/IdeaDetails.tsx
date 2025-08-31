import React from 'react';
import { Idea, Resource } from '../types';
// FIX: Import 'Check' and 'AlertTriangle' icons to resolve 'Cannot find name' errors.
import { Type, AlertCircle, TrendingUp, Tag, Paperclip, User, DollarSign, Target, Users, Check, AlertTriangle } from 'lucide-react';

interface IdeaDetailsProps {
    idea: Idea;
    onEdit: () => void;
    resources: Resource[];
}

const DetailRow: React.FC<{ icon: React.ElementType; label: string; children: React.ReactNode; fullWidth?: boolean }> = ({ icon: Icon, label, children, fullWidth }) => (
    <div className={`py-3 ${fullWidth ? '' : 'sm:grid sm:grid-cols-3 sm:gap-4'}`}>
        <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
            <Icon className="h-5 w-5 text-gray-400" />
            <span>{label}</span>
        </dt>
        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-wrap">{children}</dd>
    </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h4 className="text-md font-semibold text-text-primary pb-2 mb-2 border-b">{title}</h4>
        <dl className="divide-y divide-gray-200">{children}</dl>
    </div>
);

export const IdeaDetails: React.FC<IdeaDetailsProps> = ({ idea, onEdit, resources }) => {
    const author = resources.find(r => r.id === idea.authorId);
    return (
        <div className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                    <div>
                        <p className="font-bold text-xl text-text-primary">{idea.name}</p>
                        {author && (
                             <div className="flex items-center gap-2 mt-2">
                                <img src={`https://picsum.photos/seed/${author.id}/24/24`} alt={author.name} className="w-6 h-6 rounded-full" />
                                <span className="text-sm font-medium text-text-secondary">Oluşturan: {author.name}</span>
                            </div>
                        )}
                    </div>
                    
                    <Section title="Temel Bilgiler">
                        {idea.description && <DetailRow icon={Type} label="Açıklama">{idea.description}</DetailRow>}
                        {idea.problem && <DetailRow icon={AlertCircle} label="Çözdüğü Problem">{idea.problem}</DetailRow>}
                        {/* FIX: Replaced non-existent 'currentSituation' and 'impact' properties with 'benefits' from the Idea type. */}
                        {idea.benefits && <DetailRow icon={TrendingUp} label="Hedeflenen Faydalar">{idea.benefits}</DetailRow>}
                    </Section>
                    
                    <Section title="Finansal Analiz">
                        {/* FIX: Replaced non-existent 'estimatedBudget' with 'totalBudget' and removed 'paybackPeriod'. Added other financial metrics from Idea type. */}
                         {idea.totalBudget != null && <DetailRow icon={DollarSign} label="Tahmini Bütçe">{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(idea.totalBudget)}</DetailRow>}
                         {idea.expectedROI != null && <DetailRow icon={TrendingUp} label="Beklenen ROI">{idea.expectedROI}%</DetailRow>}
                         {idea.expectedRevenueIncrease != null && <DetailRow icon={TrendingUp} label="Beklenen Gelir Artışı">{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(idea.expectedRevenueIncrease)}</DetailRow>}
                         {idea.expectedCostSavings != null && <DetailRow icon={DollarSign} label="Maliyet Tasarrufu">{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(idea.expectedCostSavings)}</DetailRow>}
                    </Section>

                    <Section title="Stratejik Analiz">
                         {idea.swotStrengths && <DetailRow icon={Target} label="Güçlü Yönler">{idea.swotStrengths}</DetailRow>}
                         {idea.swotWeaknesses && <DetailRow icon={Target} label="Zayıf Yönler">{idea.swotWeaknesses}</DetailRow>}
                         {idea.swotOpportunities && <DetailRow icon={Target} label="Fırsatlar">{idea.swotOpportunities}</DetailRow>}
                         {idea.swotThreats && <DetailRow icon={Target} label="Tehditler">{idea.swotThreats}</DetailRow>}
                         {idea.successCriteria && <DetailRow icon={Check} label="Başarı Kriterleri">{idea.successCriteria}</DetailRow>}
                    </Section>
                    
                     <Section title="Risk Analizi">
                         {idea.risks && <DetailRow icon={AlertTriangle} label="Olası Riskler">{idea.risks}</DetailRow>}
                         {idea.mitigations && <DetailRow icon={AlertTriangle} label="Önlemler">{idea.mitigations}</DetailRow>}
                    </Section>
                    
                    {(idea.tags || idea.files) && (
                         <Section title="Ek Bilgiler">
                            {idea.tags && idea.tags.length > 0 && (
                                 <DetailRow icon={Tag} label="Etiketler" fullWidth>
                                    <div className="flex flex-wrap gap-2">
                                        {idea.tags.map(tag => (
                                             <span key={tag} className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
                                                {tag}
                                             </span>
                                        ))}
                                    </div>
                                </DetailRow>
                            )}
                            {idea.files && idea.files.length > 0 && (
                                <DetailRow icon={Paperclip} label="Ekli Dosyalar" fullWidth>
                                    <div className="flex flex-col gap-1">
                                        {idea.files.map((file, index) => <span key={index} className="text-blue-600 hover:underline cursor-pointer">{file}</span>)}
                                    </div>
                                </DetailRow>
                            )}
                         </Section>
                    )}
                </div>
            </div>

            <div className="flex-shrink-0 flex justify-end gap-3 p-4 border-t bg-gray-50">
                <button type="button" onClick={onEdit} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition">Düzenle</button>
            </div>
        </div>
    );
};