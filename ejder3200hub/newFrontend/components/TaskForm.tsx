

import React, { useState } from 'react';
import { Event, Resource, Project, Task, Priority, TaskStatus, EventType } from '../types';
import { Type, Briefcase, User, Flag, Clock, Calendar, Link as LinkIcon, Tag, Sliders, MessageSquare, Edit } from 'lucide-react';

interface TaskFormProps {
    onSubmit: (data: Omit<Event, 'id'>) => void;
    onCancel: () => void;
    initialData?: Partial<Event>;
    resources: Resource[];
    projects: Project[];
    tasks: Task[];
}

// Helper to safely convert an array to a comma-separated string for display in text inputs.
const getArrayAsTextValue = (value: unknown): string => {
    if (Array.isArray(value)) {
        return value.join(', ');
    }
    if (typeof value === 'string') {
        return value;
    }
    return '';
};

// Helper to safely convert a comma-separated string from a text input into a string array.
const textToArray = (value: unknown): string[] => {
    if (Array.isArray(value)) {
        return value;
    }
    if (typeof value === 'string' && value.trim().length > 0) {
        return value.split(',').map(s => s.trim());
    }
    return [];
};

const FormSection: React.FC<{ title: string; icon: React.ElementType; bgColor: string; children: React.ReactNode }> = ({ title, icon: Icon, bgColor, children }) => (
    <div className={`rounded-lg p-4 md:p-5 mb-4 ${bgColor}`}>
        <div className="flex items-center gap-3 mb-4">
            <Icon className="w-5 h-5 text-gray-600" />
            <h3 className="text-md font-semibold text-gray-800">{title}</h3>
        </div>
        <div className="space-y-4">{children}</div>
    </div>
);

const FormField: React.FC<{ label: string; children: React.ReactNode; required?: boolean }> = ({ label, children, required }) => (
    <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {children}
    </div>
);

const toYYYYMMDD = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, onCancel, initialData = {}, resources, projects, tasks }) => {
    const today = toYYYYMMDD(new Date());
    const [formData, setFormData] = useState<Partial<Event>>({
        type: EventType.Task,
        priority: Priority.Medium,
        status: TaskStatus.ToDo,
        progress: 0,
        ...initialData,
        startDate: initialData?.startDate || initialData?.date || today,
        endDate: initialData?.endDate || today,
        completionDate: initialData?.completionDate || today,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isNumeric = ['progress', 'estimatedHours', 'spentHours'].includes(name);
        
        setFormData(prev => ({
            ...prev,
            [name]: isNumeric ? (value === '' ? undefined : Number(value)) : value
        }));
    };
    
    const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, options } = e.target;
        const value: string[] = [];
        for (let i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
                value.push(options[i].value);
            }
        }
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalData = {
            ...formData,
            tags: textToArray(formData.tags),
        }
        onSubmit(finalData as Omit<Event, 'id'>);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto p-6">
                <FormSection title="Temel Bilgiler" icon={Edit} bgColor="bg-blue-50">
                    <FormField label="Görev Başlığı" required>
                        <input type="text" name="title" value={formData.title || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />
                    </FormField>
                    <FormField label="Açıklama">
                        <textarea name="description" value={formData.description || ''} onChange={handleChange} rows={3} className="w-full p-2 border border-gray-300 rounded-md" />
                    </FormField>
                </FormSection>

                <FormSection title="Atama ve Proje" icon={Briefcase} bgColor="bg-blue-50">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <FormField label="Proje" required>
                            <select name="projectId" value={formData.projectId || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md bg-white disabled:bg-gray-100 disabled:text-gray-500" required disabled={!!initialData.projectId}>
                                 <option value="">Proje Seçin</option>
                                 {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </FormField>
                         <FormField label="Atanan Kişi" required>
                            <select name="assigneeId" value={formData.assigneeId || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md bg-white" required>
                                <option value="">Personel Seçin</option>
                                {resources.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                            </select>
                        </FormField>
                        <FormField label="Rapor Veren">
                            <select name="reporterId" value={formData.reporterId || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md bg-white">
                                 <option value="">Personel Seçin</option>
                                 {resources.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                            </select>
                        </FormField>
                    </div>
                </FormSection>

                <FormSection title="Öncelik ve Durum" icon={Flag} bgColor="bg-yellow-50">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                         <FormField label="Öncelik">
                            <select name="priority" value={formData.priority || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md bg-white">
                               {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </FormField>
                        <FormField label="Kategori">
                             <input type="text" name="category" value={formData.category || ''} onChange={handleChange} placeholder="Geliştirme, Tasarım vb." className="w-full p-2 border border-gray-300 rounded-md"/>
                        </FormField>
                        <FormField label="Tahmini Süre (saat)">
                            <input type="number" name="estimatedHours" value={formData.estimatedHours || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md"/>
                        </FormField>
                    </div>
                </FormSection>
                
                <FormSection title="Tarihler" icon={Calendar} bgColor="bg-green-50">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <FormField label="Başlangıç Tarihi">
                            <input type="date" name="startDate" value={formData.startDate || formData.date || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" max={formData.endDate || ''} />
                        </FormField>
                        <FormField label="Bitiş Tarihi">
                             <input type="date" name="endDate" value={formData.endDate || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" min={formData.startDate || formData.date || ''} />
                        </FormField>
                         <FormField label="Tamamlanma Tarihi">
                             <input type="date" name="completionDate" value={formData.completionDate || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" />
                        </FormField>
                    </div>
                </FormSection>

                <FormSection title="Bağımlılıklar ve Etiketler" icon={LinkIcon} bgColor="bg-purple-50">
                    <FormField label="Bağımlı Görevler">
                        <select name="dependencies" value={formData.dependencies || []} onChange={handleMultiSelectChange} multiple className="w-full p-2 h-24 border border-gray-300 rounded-md bg-white">
                            {tasks.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Ctrl/Cmd tuşu ile çoklu seçim yapabilirsiniz</p>
                    </FormField>
                     <FormField label="Etiketler">
                        <input type="text" name="tags" value={getArrayAsTextValue(formData.tags)} onChange={handleChange} placeholder="database, optimization, performance" className="w-full p-2 border border-gray-300 rounded-md"/>
                    </FormField>
                </FormSection>

                <FormSection title="İlerleme ve Notlar" icon={Sliders} bgColor="bg-gray-50">
                     <FormField label={`İlerleme (${formData.progress || 0}%)`}>
                         <input type="range" min="0" max="100" step="5" name="progress" value={formData.progress || 0} onChange={handleChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"/>
                     </FormField>
                    <FormField label="Harcanan Süre (saat)">
                        <input type="number" name="spentHours" value={formData.spentHours || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md"/>
                    </FormField>
                     <FormField label="Notlar">
                        <textarea name="notes" value={formData.notes || ''} onChange={handleChange} rows={3} className="w-full p-2 border border-gray-300 rounded-md" />
                    </FormField>
                </FormSection>
            </div>
            
            <div className="flex-shrink-0 flex justify-end gap-3 p-4 border-t bg-gray-50">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition">İptal</button>
                <button type="submit" className="px-4 py-2 bg-project text-white rounded-md hover:bg-indigo-700 transition">
                    {initialData.id ? 'Görevi Güncelle' : 'Görevi Oluştur'}
                </button>
            </div>
        </form>
    );
};