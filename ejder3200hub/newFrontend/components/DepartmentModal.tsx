import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Department, Resource } from '../types';

interface DepartmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Omit<Department, 'id'> & { id?: string }) => void;
    initialData?: Department | null;
    resources: Resource[];
}

export const DepartmentModal: React.FC<DepartmentModalProps> = ({ isOpen, onClose, onSave, initialData, resources }) => {
    const [formData, setFormData] = useState({
        name: '',
        managerId: '',
    });

    useEffect(() => {
        if (isOpen) {
            setFormData({
                name: initialData?.name || '',
                managerId: initialData?.managerId || '',
            });
        }
    }, [isOpen, initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.name.trim()) {
            onSave({
                id: initialData?.id,
                name: formData.name,
                managerId: formData.managerId || undefined,
                parentId: undefined, // Explicitly remove parent relationship
            });
        }
    };

    const title = `${initialData?.id ? 'Departmanı Düzenle' : 'Yeni Departman Oluştur'}`;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">
                            Departman Adı
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                            autoFocus
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">
                            Yönetici (İsteğe bağlı)
                        </label>
                        <select
                            value={formData.managerId}
                            onChange={(e) => setFormData(prev => ({ ...prev, managerId: e.target.value }))}
                            className="w-full p-2 border border-gray-300 rounded-md bg-white"
                        >
                            <option value="">Yönetici Seçin</option>
                            {resources.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                    </div>
                </div>
                <div className="flex-shrink-0 flex justify-end gap-3 p-4 border-t bg-gray-50">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">İptal</button>
                    <button type="submit" className="px-4 py-2 bg-project text-white rounded-md hover:bg-project-focus">Kaydet</button>
                </div>
            </form>
        </Modal>
    );
};