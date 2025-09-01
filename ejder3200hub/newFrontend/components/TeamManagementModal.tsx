import React, { useState } from 'react';
import { Project, Resource } from '../types';
import { UserPlus, X } from 'lucide-react';

interface TeamManagementModalProps {
    project: Project;
    resources: Resource[];
    onSave: (projectId: string, teamIds: string[]) => void;
    onClose: () => void;
}

export const TeamManagementModal: React.FC<TeamManagementModalProps> = ({ project, resources, onSave, onClose }) => {
    const [teamIds, setTeamIds] = useState<string[]>(project.team);
    const [selectedNewMember, setSelectedNewMember] = useState<string>('');

    const teamMembers = resources.filter(r => teamIds.includes(r.id));
    const availableResources = resources.filter(r => !teamIds.includes(r.id));

    const handleRemoveMember = (idToRemove: string) => {
        setTeamIds(prev => prev.filter(id => id !== idToRemove));
    };

    const handleAddMember = () => {
        if (selectedNewMember && !teamIds.includes(selectedNewMember)) {
            setTeamIds(prev => [...prev, selectedNewMember]);
            setSelectedNewMember('');
        }
    };

    const handleSave = () => {
        onSave(project.id, teamIds);
        onClose();
    };

    return (
        <div className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto p-6">
                <div className="mb-4">
                    <h4 className="font-semibold text-lg mb-2">Mevcut Ekip Üyeleri</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2 border rounded-md p-2">
                        {teamMembers.length > 0 ? teamMembers.map(member => (
                            <div key={member.id} className="flex justify-between items-center bg-gray-100 p-2 rounded-md">
                                <div className="flex items-center gap-2">
                                    <img src={`https://picsum.photos/seed/${member.id}/32/32`} alt={member.name} className="w-8 h-8 rounded-full" />
                                    <div>
                                        <p className="font-medium text-sm">{member.name}</p>
                                        <p className="text-xs text-text-secondary">{member.position}</p>
                                    </div>
                                </div>
                                <button onClick={() => handleRemoveMember(member.id)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100">
                                    <X size={16} />
                                </button>
                            </div>
                        )) : <p className="text-sm text-text-secondary text-center p-4">Ekipte üye bulunmuyor.</p>}
                    </div>
                </div>
                
                <div className="pt-4 border-t">
                    <h4 className="font-semibold text-lg mb-2">Üye Ekle</h4>
                     <div className="flex items-center gap-2">
                        <select 
                            value={selectedNewMember}
                            onChange={(e) => setSelectedNewMember(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md bg-white flex-1"
                        >
                            <option value="">Personel Seçin...</option>
                            {availableResources.map(res => (
                                <option key={res.id} value={res.id}>{res.name}</option>
                            ))}
                        </select>
                        <button onClick={handleAddMember} disabled={!selectedNewMember} className="px-4 py-2 bg-project text-white rounded-md hover:bg-project-focus disabled:bg-gray-400 flex items-center gap-2">
                           <UserPlus size={16} /> Ekle
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-shrink-0 flex justify-end gap-3 p-4 border-t bg-gray-50">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">İptal</button>
                <button type="button" onClick={handleSave} className="px-4 py-2 bg-project text-white rounded-md hover:bg-project-focus">Değişiklikleri Kaydet</button>
            </div>
        </div>
    );
};