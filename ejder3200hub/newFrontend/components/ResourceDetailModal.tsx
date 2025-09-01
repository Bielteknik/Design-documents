import React from 'react';
import { Resource, Department } from '../types';
import { Modal } from './Modal';
import { Briefcase, User, Mail, Phone, BrainCircuit, ArrowRightCircle } from 'lucide-react';

interface ResourceDetailModalProps {
    resource: Resource;
    manager?: Resource;
    department?: Department;
    onClose: () => void;
    onGoToDetails: (resource: Resource) => void;
}

const DetailRow: React.FC<{ icon: React.ElementType; label: string; value?: string }> = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
        <div>
            <p className="text-xs text-text-secondary">{label}</p>
            <p className="text-sm font-medium text-text-primary">{value || 'Belirtilmemiş'}</p>
        </div>
    </div>
);


export const ResourceDetailModal: React.FC<ResourceDetailModalProps> = ({ resource, manager, department, onClose, onGoToDetails }) => {
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center backdrop-blur-sm animate-fadeIn"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-md m-4 flex flex-col max-h-[90vh] animate-slideUp"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    <div className="flex flex-col items-center text-center">
                        <div className="relative mb-4">
                            <img src={`https://picsum.photos/seed/${resource.id}/128/128`} alt={resource.name} className="w-32 h-32 rounded-full border-4 border-white shadow-lg" />
                            <button 
                                onClick={() => onGoToDetails(resource)} 
                                className="absolute -bottom-1 -right-1 flex items-center gap-1.5 text-xs bg-project text-white px-3 py-1.5 rounded-full shadow-md hover:bg-project-focus transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-project"
                                title="Tam profili gör"
                            >
                                <ArrowRightCircle size={14} /> Detaylar
                            </button>
                        </div>
                        <h3 className="text-2xl font-bold text-text-primary">{resource.name}</h3>
                        <p className="text-md text-project font-semibold">{resource.position}</p>
                        <p className="text-sm text-text-secondary mt-2 max-w-sm">{resource.bio}</p>
                    </div>

                    <div className="grid grid-cols-1 gap-y-4 mt-6 border-t pt-6">
                        <DetailRow icon={Briefcase} label="Departman" value={department?.name} />
                        <DetailRow icon={User} label="Yöneticisi" value={manager?.name} />
                        <DetailRow icon={Mail} label="E-posta" value={resource.email} />
                        <DetailRow icon={Phone} label="Telefon" value={resource.phone} />
                    </div>
                    
                    <div className="mt-4 border-t pt-4">
                         <div className="flex items-start gap-3">
                            <BrainCircuit className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                            <div>
                                <p className="text-xs text-text-secondary">Yetenekler</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {resource.skills.map(skill => (
                                        <span key={skill} className="bg-status-purple-bg text-status-purple-text text-xs font-semibold px-2 py-1 rounded-full">{skill}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-shrink-0 flex justify-end p-4 bg-gray-50 border-t">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition">Kapat</button>
                </div>
            </div>
        </div>
    );
};