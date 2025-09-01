import React, { useState, useMemo, useRef, useCallback } from 'react';
import { Feedback, FeedbackCategory, User, Department, Project, Resource } from '../../types.ts';
import { Star, Send, Upload, FileText, X, Trash2, AlertCircle, Info, ArrowLeft } from 'lucide-react';

interface FeedbackFormViewProps {
    onSubmit: (data: Omit<Feedback, 'id' | 'timestamp' | 'status'>) => void;
    onCancel: () => void;
    currentUser: User;
    departments: Department[];
    projects: Project[];
    resources: Resource[];
}

// Simple compact components
const StarRating: React.FC<{ rating: number; setRating: (rating: number) => void; size?: number }> = ({ rating, setRating, size = 20 }) => (
    <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => {
            const ratingValue = i + 1;
            return (
                <button
                    key={ratingValue}
                    type="button"
                    onClick={() => setRating(ratingValue)}
                    className="focus:outline-none transition-transform hover:scale-110"
                    aria-label={`${ratingValue} yıldız`}
                >
                    <Star
                        size={size}
                        className={`transition-colors cursor-pointer ${
                            ratingValue <= rating 
                                ? 'text-yellow-400 fill-current drop-shadow-sm' 
                                : 'text-gray-300 hover:text-yellow-300'
                        }`}
                    />
                </button>
            );
        })}
        <span className="ml-2 text-sm text-text-secondary font-medium">
            {rating > 0 ? `${rating}/5` : 'Değerlendirin'}
        </span>
    </div>
);

// Simple Priority Radio Buttons
const PrioritySelector: React.FC<{
    priority: 'low' | 'medium' | 'high' | 'critical';
    setPriority: (priority: 'low' | 'medium' | 'high' | 'critical') => void;
}> = ({ priority, setPriority }) => {
    const priorities = [
        { value: 'low', label: 'Düşük' },
        { value: 'medium', label: 'Orta' },
        { value: 'high', label: 'Yüksek' },
        { value: 'critical', label: 'Kritik' },
    ];

    return (
        <div className="flex flex-wrap gap-4">
            {priorities.map((p) => (
                <label key={p.value} className="flex items-center cursor-pointer">
                    <input
                        type="radio"
                        name="priority"
                        value={p.value}
                        checked={priority === p.value}
                        onChange={() => setPriority(p.value as any)}
                        className="mr-2 h-4 w-4 text-project focus:ring-project border-gray-300"
                    />
                    <span className="text-sm font-medium text-text-primary">{p.label}</span>
                </label>
            ))}
        </div>
    );
};

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
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl text-sm border border-gray-200">
            <div className="flex items-center gap-4 overflow-hidden">
                {preview ? (
                    <img src={preview} alt={file.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                ) : (
                    <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <FileText size={28} className="text-gray-500" />
                    </div>
                )}
                <div className="flex-grow overflow-hidden">
                    <p className="font-medium text-text-primary truncate">{file.name}</p>
                    <p className="text-xs text-text-secondary">{formatBytes(file.size)}</p>
                </div>
            </div>
            <button 
                type="button" 
                onClick={onRemove} 
                className="text-red-500 hover:text-red-700 flex-shrink-0 p-2 rounded-full hover:bg-red-100 transition-colors"
            >
                <Trash2 size={20} />
            </button>
        </div>
    );
};



const DeviceInfoCard: React.FC<{ userAgent: string; contextUrl: string }> = ({ userAgent, contextUrl }) => (
    <div className="bg-gray-50 p-4 rounded-xl text-sm space-y-3 border border-gray-200">
        <div className="flex items-start gap-3">
            <Info size={18} className="text-gray-500 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
                <p className="font-semibold text-gray-700">Teknik Bilgiler:</p>
                <p className="text-gray-600 break-all"><strong>Sayfa:</strong> {contextUrl}</p>
                <p className="text-gray-600"><strong>Tarayıcı:</strong> {userAgent.split(' ')[0]}</p>
                <p className="text-gray-600"><strong>Zaman:</strong> {new Date().toLocaleString('tr-TR')}</p>
            </div>
        </div>
    </div>
);

export const FeedbackFormView: React.FC<FeedbackFormViewProps> = ({ onSubmit, onCancel, currentUser, departments, projects, resources }) => {
    // State management
    const [category, setCategory] = useState<FeedbackCategory>(FeedbackCategory.General);
    const [rating, setRating] = useState(0);
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
    
    // Assignment states
    const [assigneeDepartmentId, setAssigneeDepartmentId] = useState<string>('');
    const [assigneeProjectId, setAssigneeProjectId] = useState<string>('');
    const [assigneeResourceId, setAssigneeResourceId] = useState<string>('');
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Category configurations
    const categoryConfigs = {
        [FeedbackCategory.BugReport]: {
            title: 'Hata Bildirimi',
            description: 'Karşılaştığınız teknik sorunları ve hataları bildirin'
        },
        [FeedbackCategory.FeatureRequest]: {
            title: 'Özellik Talebi', 
            description: 'Yeni özellik önerilerinizi ve iyileştirme fikirlerinizi paylaşın'
        },
        [FeedbackCategory.General]: {
            title: 'Genel Yorum',
            description: 'Genel yorumlarınızı, önerilerinizi ve değerlendirmelerinizi iletin'
        }
    };

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
        if (description.trim() && rating > 0 && subject.trim()) {
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
        }
    };

    const filteredProjects = useMemo(() => {
        if (!assigneeDepartmentId) return projects;
        const projectIdsInDept = resources
            .filter(r => r.departmentId === assigneeDepartmentId)
            .flatMap(r => projects.filter(p => p.team.includes(r.id) || p.managerId === r.id))
            .map(p => p.id);
        return projects.filter(p => projectIdsInDept.includes(p.id));
    }, [projects, resources, assigneeDepartmentId]);

    const filteredResources = useMemo(() => {
        let availableResources = resources;
        if (assigneeProjectId) {
            const project = projects.find(p => p.id === assigneeProjectId);
            if (project) {
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

    const isFormValid = description.trim() && subject.trim() && rating > 0;

    return (
        <div className="min-h-screen bg-main-bg">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={onCancel}
                                className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
                            >
                                <ArrowLeft size={20} />
                                <span className="font-medium">Geri Dön</span>
                            </button>
                            <div className="h-6 w-px bg-gray-300" />
                            <div>
                                <h1 className="text-2xl font-bold text-text-primary">Gelişmiş Geri Bildirim Sistemi</h1>
                                <p className="text-text-secondary mt-1">Görüşlerinizi ve önerilerinizi bizimle paylaşın</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-sm text-text-secondary">
                                <AlertCircle size={16} className="inline mr-1" />
                                Gerekli alanları doldurun
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-6 py-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
                        
                        {/* Category Selection */}
                        <div>
                            <label className="block text-lg font-semibold text-text-primary mb-4">
                                Kategori Seçimi *
                            </label>
                            <div className="space-y-3">
                                {Object.entries(categoryConfigs).map(([cat, config]) => (
                                    <label key={cat} className="flex items-start cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                        <input
                                            type="radio"
                                            name="category"
                                            value={cat}
                                            checked={category === cat}
                                            onChange={() => setCategory(cat as FeedbackCategory)}
                                            className="mt-1 mr-3 h-4 w-4 text-project focus:ring-project border-gray-300"
                                        />
                                        <div>
                                            <div className="font-medium text-text-primary">{config.title}</div>
                                            <div className="text-sm text-text-secondary mt-1">{config.description}</div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Subject */}
                        <div>
                            <label className="block text-lg font-semibold text-text-primary mb-3">
                                Konu Başlığı *
                            </label>
                            <input 
                                type="text" 
                                value={subject} 
                                onChange={e => setSubject(e.target.value)} 
                                placeholder="Geri bildirimin kısa ve açıklayıcı başlığını yazın"
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-project focus:border-project transition-all"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-lg font-semibold text-text-primary mb-3">
                                Açıklama *
                            </label>
                            <textarea 
                                value={description} 
                                onChange={e => setDescription(e.target.value)} 
                                placeholder="Geri bildiriminizi detaylı olarak açıklayın. Ne ile ilgili? Nasıl oluştu? Beklentiniz nedir?"
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-project focus:border-project transition-all resize-none"
                                rows={6} 
                                required 
                            />
                            <p className="text-xs text-text-secondary mt-2">
                                {description.length}/500 karakter
                            </p>
                        </div>

                        {/* Priority Level */}
                        <div>
                            <label className="block text-lg font-semibold text-text-primary mb-3">
                                Öncelik Düzeyi
                            </label>
                            <PrioritySelector priority={priority} setPriority={setPriority} />
                        </div>

                        {/* Rating */}
                        <div>
                            <label className="block text-lg font-semibold text-text-primary mb-3">
                                Genel Deneyiminizi Değerlendirin *
                            </label>
                            <StarRating rating={rating} setRating={setRating} />
                        </div>

                        {/* Anonymous Option */}
                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                            <input 
                                id="anonymous" 
                                type="checkbox" 
                                checked={isAnonymous} 
                                onChange={e => setIsAnonymous(e.target.checked)} 
                                className="h-4 w-4 rounded border-gray-300 text-project focus:ring-project"
                            />
                            <label htmlFor="anonymous" className="text-sm text-text-primary font-medium">
                                Anonim olarak gönder
                            </label>
                        </div>
                    </div>

                    {/* File Attachments */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <label className="block text-lg font-semibold text-text-primary mb-4">
                            Dosya Ekleri
                        </label>
                        <div 
                            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-project hover:bg-gray-50 transition-all"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={onDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <p className="text-lg font-medium text-text-secondary mb-2">
                                Dosyaları sürükleyip bırakın veya seçin
                            </p>
                            <p className="text-sm text-text-secondary">
                                PNG, JPG, PDF, DOC dosyaları desteklenir (Maks. 10MB)
                            </p>
                            <input 
                                type="file" 
                                multiple 
                                ref={fileInputRef} 
                                onChange={(e) => handleFileChange(e.target.files)} 
                                className="hidden"
                                accept=".png,.jpg,.jpeg,.pdf,.doc,.docx,.txt" 
                            />
                        </div>
                        {files.length > 0 && (
                            <div className="mt-4 space-y-3">
                                <h4 className="font-medium text-text-primary">Eklenen Dosyalar:</h4>
                                {files.map((file, index) => (
                                    <FilePreview key={index} file={file} onRemove={() => removeFile(file)} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Assignment Section (Optional) */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <label className="block text-lg font-semibold text-text-primary mb-4">
                            Yönlendirme & Atama (Opsiyonel)
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">
                                    Hedef Departman
                                </label>
                                <select 
                                    value={assigneeDepartmentId} 
                                    onChange={handleDepartmentChange} 
                                    className="w-full p-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-project focus:border-project"
                                >
                                    <option value="">Departman Seç...</option>
                                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">
                                    İlgili Proje
                                </label>
                                <select 
                                    value={assigneeProjectId} 
                                    onChange={handleProjectChange} 
                                    className="w-full p-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-project focus:border-project disabled:bg-gray-100 disabled:text-gray-500"
                                    disabled={!assigneeDepartmentId}
                                >
                                    <option value="">Proje Seç...</option>
                                    {filteredProjects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">
                                    Atanacak Kişi
                                </label>
                                <select 
                                    value={assigneeResourceId} 
                                    onChange={e => setAssigneeResourceId(e.target.value)} 
                                    className="w-full p-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-project focus:border-project"
                                >
                                    <option value="">Kişi Seç...</option>
                                    {filteredResources.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Form Actions - Footer */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-500">
                                <AlertCircle size={16} className="inline mr-1" />
                                {isFormValid ? 'Form hazır, gönderebilirsiniz!' : 'Tüm gerekli alanları doldurun'}
                            </div>
                            <div className="flex gap-4">
                                <button 
                                    type="button" 
                                    onClick={onCancel} 
                                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                                >
                                    İptal
                                </button>
                                <button 
                                    type="submit" 
                                    className="flex items-center gap-2 px-6 py-3 bg-project text-white rounded-lg hover:bg-project-focus disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                                    disabled={!isFormValid}
                                >
                                    <Send size={18} /> 
                                    Geri Bildirimi Gönder
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};