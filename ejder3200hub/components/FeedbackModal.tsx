import React, { useState, useMemo, useRef, useCallback } from 'react';
import { Modal } from './Modal';
import { Feedback, FeedbackCategory, User, Department, Project, Resource } from '../types';
import { Star, Send, Upload, FileText, X, Trash2, Image as ImageIcon } from 'lucide-react';

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<Feedback, 'id' | 'timestamp' | 'status'>) => void;
    currentUser: User;
    departments: Department[];
    projects: Project[];
    resources: Resource[];
}

const StarRating: React.FC<{ rating: number; setRating: (rating: number) => void }> = ({ rating, setRating }) => (
    <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => {
            const ratingValue = i + 1;
            return (
                <button
                    key={ratingValue}
                    type="button"
                    onClick={() => setRating(ratingValue)}
                    className="focus:outline-none"
                    aria-label={`${ratingValue} yıldız`}
                >
                    <Star
                        size={24}
                        className={`transition-colors cursor-pointer ${ratingValue <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300 hover:text-yellow-300'}`}
                    />
                </button>
            );
        })}
    </div>
);

const FilePreview: React.FC<{ file: File; onRemove: () => void }> = ({ file, onRemove }) => {
    const [preview, setPreview] = useState<string | null>(null);

    React.useEffect(() => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }, [file]);
    
    const formatBytes = (bytes: number, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    return (
        <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md text-sm">
            <div className="flex items-center gap-3 overflow-hidden">
                {preview ? (
                    <img src={preview} alt={file.name} className="w-10 h-10 rounded object-cover flex-shrink-0" />
                ) : (
                    <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <FileText size={20} className="text-gray-500" />
                    </div>
                )}
                <div className="flex-grow overflow-hidden">
                    <p className="font-medium text-text-primary truncate">{file.name}</p>
                    <p className="text-xs text-text-secondary">{formatBytes(file.size)}</p>
                </div>
            </div>
            <button type="button" onClick={onRemove} className="text-red-500 hover:text-red-700 flex-shrink-0 p-1 rounded-full hover:bg-red-100 transition-colors">
                <Trash2 size={16} />
            </button>
        </div>
    );
};

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, onSubmit, currentUser, departments, projects, resources }) => {
    const [category, setCategory] = useState<FeedbackCategory>(FeedbackCategory.General);
    const [rating, setRating] = useState(0);
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [isAnonymous, setIsAnonymous] = useState(false);
    
    const [assigneeDepartmentId, setAssigneeDepartmentId] = useState<string>('');
    const [assigneeProjectId, setAssigneeProjectId] = useState<string>('');
    const [assigneeResourceId, setAssigneeResourceId] = useState<string>('');
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = useCallback((selectedFiles: FileList | null) => {
        if (selectedFiles) {
            const newFiles = Array.from(selectedFiles);
            setFiles(prev => {
                const existingFileNames = prev.map(f => f.name);
                const uniqueNewFiles = newFiles.filter(nf => !existingFileNames.includes(nf.name));
                return [...prev, ...uniqueNewFiles];
            });
        }
    }, []);

    const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        handleFileChange(e.dataTransfer.files);
    }, [handleFileChange]);

    const removeFile = (fileToRemove: File) => {
        setFiles(prev => prev.filter(f => f !== fileToRemove));
    };

    const userAgent = `${navigator.userAgent}`;
    const contextUrl = window.location.pathname;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (description.trim() && rating > 0) {
            onSubmit({ 
                authorId: isAnonymous ? null : currentUser.id,
                category, 
                rating, 
                subject,
                description,
                files: files.map(f => ({ name: f.name, type: f.type, size: f.size })),
                userAgent,
                contextUrl,
                assigneeDepartmentId: assigneeDepartmentId || undefined,
                assigneeProjectId: assigneeProjectId || undefined,
                assigneeResourceId: assigneeResourceId || undefined,
            });
            // Reset form
            setCategory(FeedbackCategory.General);
            setRating(0);
            setSubject('');
            setDescription('');
            setFiles([]);
            setIsAnonymous(false);
            setAssigneeDepartmentId('');
            setAssigneeProjectId('');
            setAssigneeResourceId('');
            onClose();
        }
    };

    const filteredProjects = useMemo(() => {
        if (!assigneeDepartmentId) return projects;
        const projectIdsInDept = resources
            .filter(r => r.departmentId === assigneeDepartmentId)
            // FIX: Corrected comparison from object property access to direct ID comparison for safety.
            .flatMap(r => projects.filter(p => p.team.includes(r.id) || p.managerId === r.id))
            .map(p => p.id);
        return projects.filter(p => projectIdsInDept.includes(p.id));
    }, [projects, resources, assigneeDepartmentId]);

    const filteredResources = useMemo(() => {
        let availableResources = resources;
        if (assigneeProjectId) {
            const project = projects.find(p => p.id === assigneeProjectId);
            if (project) {
                 // FIX: Corrected comparison from object property access to direct ID comparison for safety.
                availableResources = resources.filter(r => project.team.includes(r.id) || project.managerId === r.id);
            }
        } else if (assigneeDepartmentId) {
            availableResources = resources.filter(r => r.departmentId === assigneeDepartmentId);
        }
        return availableResources;
    }, [resources, projects, assigneeDepartmentId, assigneeProjectId]);
    
    const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setAssigneeDepartmentId(e.target.value);
        setAssigneeProjectId('');
        setAssigneeResourceId('');
    };

    const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setAssigneeProjectId(e.target.value);
        setAssigneeResourceId('');
    };


    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Gelişmiş Geri Bildirim Formu">
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
                <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="md:col-span-2 space-y-4">
                        <h3 className="text-lg font-semibold text-text-primary border-b pb-2">Geri Bildirim Detayları</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Kategori</label>
                                <select value={category} onChange={e => setCategory(e.target.value as FeedbackCategory)} className="w-full p-2 border border-gray-300 rounded-md bg-white shadow-sm focus:ring-project focus:border-project">
                                    {Object.values(FeedbackCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Konu</label>
                                <input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Geri bildirimin başlığı" className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-project focus:border-project" required/>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Açıklama</label>
                            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Düşüncelerinizi bizimle detaylı olarak paylaşın..." className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-project focus:border-project" rows={5} required />
                        </div>
                         <div>
                            <h3 className="text-lg font-semibold text-text-primary border-b pb-2 mt-4">Ekler</h3>
                             <div 
                                className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-project hover:bg-gray-50 transition-colors"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={onDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload className="mx-auto h-10 w-10 text-gray-400" />
                                <p className="mt-2 text-sm text-text-secondary">Dosyaları sürükleyip bırakın veya <span className="font-semibold text-project">gözatın</span></p>
                                <input type="file" multiple ref={fileInputRef} onChange={(e) => handleFileChange(e.target.files)} className="hidden" />
                            </div>
                            {files.length > 0 && (
                                <div className="mt-4 space-y-2 max-h-40 overflow-y-auto pr-2">
                                    {files.map((file, index) => (
                                        <FilePreview key={index} file={file} onRemove={() => removeFile(file)} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="md:col-span-1 space-y-4">
                         <h3 className="text-lg font-semibold text-text-primary border-b pb-2">Değerlendirme</h3>
                         <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">Deneyiminizi Puanlayın</label>
                            <StarRating rating={rating} setRating={setRating} />
                        </div>
                        <div className="flex items-center">
                            <input id="anonymous" type="checkbox" checked={isAnonymous} onChange={e => setIsAnonymous(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-project focus:ring-project" />
                            <label htmlFor="anonymous" className="ml-2 block text-sm text-text-primary">Anonim olarak gönder</label>
                        </div>

                        <h3 className="text-lg font-semibold text-text-primary border-b pb-2 pt-4">Yönlendirme & Atama</h3>
                        <div>
                           <label className="block text-sm font-medium text-text-secondary mb-1">Departman</label>
                            <select value={assigneeDepartmentId} onChange={handleDepartmentChange} className="w-full p-2 border border-gray-300 rounded-md bg-white shadow-sm focus:ring-project focus:border-project">
                                <option value="">Departman Seç...</option>
                                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-text-secondary mb-1">Proje</label>
                            <select value={assigneeProjectId} onChange={handleProjectChange} className="w-full p-2 border border-gray-300 rounded-md bg-white shadow-sm focus:ring-project focus:border-project" disabled={!assigneeDepartmentId}>
                                <option value="">Proje Seç...</option>
                                {filteredProjects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                         <div>
                           <label className="block text-sm font-medium text-text-secondary mb-1">Personel</label>
                            <select value={assigneeResourceId} onChange={e => setAssigneeResourceId(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md bg-white shadow-sm focus:ring-project focus:border-project">
                                <option value="">Personel Seç...</option>
                                {filteredResources.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="flex-shrink-0 flex justify-between items-center gap-3 p-4 border-t bg-gray-50">
                    <p className="text-xs text-gray-400 truncate max-w-xs">URL: {contextUrl} | {userAgent}</p>
                    <div className="flex gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">İptal</button>
                        <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-project text-white rounded-md hover:bg-project-focus disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={!description.trim() || !subject.trim() || rating === 0}>
                            <Send size={16} /> Gönder
                        </button>
                    </div>
                </div>
            </form>
        </Modal>
    );
};