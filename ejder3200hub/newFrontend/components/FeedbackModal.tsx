import React, { useState, useMemo, useRef, useCallback } from 'react';
import { Modal } from './Modal.tsx';
import { Feedback, FeedbackCategory, User, Department, Project, Resource } from '../types.ts';
import { Star, Send, Upload, FileText, X, Trash2, Image as ImageIcon, ChevronDown, ChevronRight, AlertCircle, Info, MessageSquare, Settings, Users, Bug, Lightbulb, HelpCircle, Zap, Shield } from 'lucide-react';

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<Feedback, 'id' | 'timestamp' | 'status'>) => void;
    currentUser: User;
    departments: Department[];
    projects: Project[];
    resources: Resource[];
}

// Enhanced nested components
const StarRating: React.FC<{ rating: number; setRating: (rating: number) => void; size?: number }> = ({ rating, setRating, size = 24 }) => (
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

const CollapsibleSection: React.FC<{
    title: string;
    icon: React.ElementType;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    badge?: string;
}> = ({ title, icon: Icon, isOpen, onToggle, children, badge }) => (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
        <button
            type="button"
            onClick={onToggle}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
            <div className="flex items-center gap-3">
                <Icon size={20} className="text-project" />
                <span className="font-medium text-text-primary">{title}</span>
                {badge && (
                    <span className="bg-project text-white text-xs px-2 py-1 rounded-full">
                        {badge}
                    </span>
                )}
            </div>
            {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </button>
        {isOpen && (
            <div className="p-4 border-t border-gray-200 bg-white">
                {children}
            </div>
        )}
    </div>
);

const CategoryCard: React.FC<{
    category: FeedbackCategory;
    icon: React.ElementType;
    title: string;
    description: string;
    selected: boolean;
    onSelect: () => void;
}> = ({ category, icon: Icon, title, description, selected, onSelect }) => (
    <div
        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
            selected
                ? 'border-project bg-project bg-opacity-5'
                : 'border-gray-200 hover:border-project hover:bg-gray-50'
        }`}
        onClick={onSelect}
    >
        <div className="flex items-start gap-3">
            <Icon size={24} className={selected ? 'text-project' : 'text-gray-600'} />
            <div>
                <h4 className={`font-medium ${selected ? 'text-project' : 'text-text-primary'}`}>
                    {title}
                </h4>
                <p className="text-sm text-text-secondary mt-1">{description}</p>
            </div>
        </div>
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
        <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg text-sm border border-gray-200">
            <div className="flex items-center gap-3 overflow-hidden">
                {preview ? (
                    <img src={preview} alt={file.name} className="w-12 h-12 rounded object-cover flex-shrink-0" />
                ) : (
                    <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <FileText size={24} className="text-gray-500" />
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
                <Trash2 size={16} />
            </button>
        </div>
    );
};

const PrioritySelector: React.FC<{
    priority: 'low' | 'medium' | 'high' | 'critical';
    setPriority: (priority: 'low' | 'medium' | 'high' | 'critical') => void;
}> = ({ priority, setPriority }) => {
    const priorities = [
        { value: 'low', label: 'Düşük', color: 'text-green-600 bg-green-100' },
        { value: 'medium', label: 'Orta', color: 'text-yellow-600 bg-yellow-100' },
        { value: 'high', label: 'Yüksek', color: 'text-orange-600 bg-orange-100' },
        { value: 'critical', label: 'Kritik', color: 'text-red-600 bg-red-100' },
    ];

    return (
        <div className="grid grid-cols-2 gap-2">
            {priorities.map((p) => (
                <button
                    key={p.value}
                    type="button"
                    onClick={() => setPriority(p.value as any)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                        priority === p.value
                            ? `${p.color} border-current`
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                >
                    {p.label}
                </button>
            ))}
        </div>
    );
};

const DeviceInfoCard: React.FC<{ userAgent: string; contextUrl: string }> = ({ userAgent, contextUrl }) => (
    <div className="bg-gray-50 p-3 rounded-lg text-xs space-y-2">
        <div className="flex items-start gap-2">
            <Info size={14} className="text-gray-500 mt-0.5 flex-shrink-0" />
            <div>
                <p className="font-medium text-gray-700">Teknik Bilgiler:</p>
                <p className="text-gray-600 break-all">Sayfa: {contextUrl}</p>
                <p className="text-gray-600 truncate">Tarayıcı: {userAgent.split(' ')[0]}</p>
            </div>
        </div>
    </div>
);

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, onSubmit, currentUser, departments, projects, resources }) => {
    // Enhanced state management
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
    
    // Collapsible sections state
    const [openSections, setOpenSections] = useState({
        category: true,
        details: true,
        assignment: false,
        attachments: false,
        rating: true,
        system: false
    });
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Category configurations with enhanced descriptions
    const categoryConfigs = {
        [FeedbackCategory.BugReport]: {
            icon: Bug,
            title: 'Hata Bildirimi',
            description: 'Karşılaştığınız teknik sorunları ve hataları bildirin'
        },
        [FeedbackCategory.FeatureRequest]: {
            icon: Lightbulb,
            title: 'Özellik Talebi',
            description: 'Yeni özellik önerilerinizi ve iyileştirme fikirlerinizi paylaşın'
        },
        [FeedbackCategory.General]: {
            icon: MessageSquare,
            title: 'Genel Yorum',
            description: 'Genel yorumlarınızı, önerilerinizi ve değerlendirmelerinizi iletin'
        }
    };

    const toggleSection = (section: keyof typeof openSections) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
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
            // Reset form with enhanced states
            setCategory(FeedbackCategory.General);
            setRating(0);
            setSubject('');
            setDescription('');
            setFiles([]);
            setIsAnonymous(false);
            setPriority('medium');
            setAssigneeDepartmentId('');
            setAssigneeProjectId('');
            setAssigneeResourceId('');
            setOpenSections({
                category: true,
                details: true,
                assignment: false,
                attachments: false,
                rating: true,
                system: false
            });
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


    const isFormValid = description.trim() && subject.trim() && rating > 0;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Gelişmiş Geri Bildirim Sistemi">
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Category Selection Section */}
                    <CollapsibleSection
                        title="Kategori Seçimi"
                        icon={MessageSquare}
                        isOpen={openSections.category}
                        onToggle={() => toggleSection('category')}
                        badge="Gerekli"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(categoryConfigs).map(([cat, config]) => (
                                <CategoryCard
                                    key={cat}
                                    category={cat as FeedbackCategory}
                                    icon={config.icon}
                                    title={config.title}
                                    description={config.description}
                                    selected={category === cat}
                                    onSelect={() => setCategory(cat as FeedbackCategory)}
                                />
                            ))}
                        </div>
                    </CollapsibleSection>

                    {/* Feedback Details Section */}
                    <CollapsibleSection
                        title="Geri Bildirim Detayları"
                        icon={FileText}
                        isOpen={openSections.details}
                        onToggle={() => toggleSection('details')}
                        badge="Gerekli"
                    >
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">
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
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">
                                    Açıklama *
                                </label>
                                <textarea 
                                    value={description} 
                                    onChange={e => setDescription(e.target.value)} 
                                    placeholder="Geri bildiriminizi detaylı olarak açıklayın. Ne ile ilgili? Nasıl oluştu? Beklentiniz nedir?"
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-project focus:border-project transition-all"
                                    rows={6} 
                                    required 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">
                                    Öncelik Düzeyi
                                </label>
                                <PrioritySelector priority={priority} setPriority={setPriority} />
                            </div>
                        </div>
                    </CollapsibleSection>

                    {/* Rating Section */}
                    <CollapsibleSection
                        title="Değerlendirme"
                        icon={Star}
                        isOpen={openSections.rating}
                        onToggle={() => toggleSection('rating')}
                        badge="Gerekli"
                    >
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-3">
                                    Genel Deneyiminizi Değerlendirin *
                                </label>
                                <StarRating rating={rating} setRating={setRating} size={32} />
                            </div>
                            <div className="flex items-center space-x-3">
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
                    </CollapsibleSection>

                    {/* Attachments Section */}
                    <CollapsibleSection
                        title="Dosya Ekleri"
                        icon={Upload}
                        isOpen={openSections.attachments}
                        onToggle={() => toggleSection('attachments')}
                        badge={files.length > 0 ? `${files.length} dosya` : undefined}
                    >
                        <div className="space-y-4">
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
                                <div className="space-y-3 max-h-48 overflow-y-auto">
                                    <h4 className="font-medium text-text-primary">Eklenen Dosyalar:</h4>
                                    {files.map((file, index) => (
                                        <FilePreview key={index} file={file} onRemove={() => removeFile(file)} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </CollapsibleSection>
                </div>

                {/* Form Actions */}
                <div className="flex-shrink-0 flex justify-between items-center gap-4 p-6 border-t bg-gray-50">
                    <div className="text-sm text-gray-500">
                        <AlertCircle size={16} className="inline mr-1" />
                        Tüm gerekli alanları doldurun
                    </div>
                    <div className="flex gap-3">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                        >
                            İptal
                        </button>
                        <button 
                            type="submit" 
                            className="flex items-center gap-2 px-6 py-3 bg-project text-white rounded-lg hover:bg-project-focus disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium shadow-lg"
                            disabled={!isFormValid}
                        >
                            <Send size={18} /> 
                            Geri Bildirimi Gönder
                        </button>
                    </div>
                </div>
            </form>
        </Modal>
    );
};