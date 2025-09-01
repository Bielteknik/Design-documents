


import React, { useState, useEffect, useMemo, Fragment } from 'react';
import { Resource, Department, EmploymentType, Project, PerformanceEvaluation, ProjectStatus, TaskStatus, Badge } from '../../types';
import { User, Briefcase, Mail, Phone, Calendar, Clock, BrainCircuit, Save, X, ArrowLeft, Check, Info, HelpCircle, Star, Circle, CheckCircle, BarChart2, Award, Zap } from 'lucide-react';

interface NewResourceViewProps {
    onSubmit: (resource: Partial<Omit<Resource, 'skills'>> & { skills: string }) => void;
    onCancel: () => void;
    departments: Department[];
    initialData?: Resource | null;
    projects: Project[];
    performanceEvaluations: PerformanceEvaluation[];
    resources: Resource[];
}

const badgeLibrary: { [key: string]: Badge } = {
    'idea_starter': { id: 'idea_starter', name: 'Fikir Başlatan', description: 'İlk fikrini başarıyla paylaştı!', icon: Zap },
};

const getArrayAsTextValue = (value: unknown): string => {
    if (Array.isArray(value)) {
        return value.join(', ');
    }
    if (typeof value === 'string') {
        return value;
    }
    return '';
};

const SectionCard: React.FC<{ icon: React.ElementType; title: string; children: React.ReactNode; }> = ({ icon: Icon, title, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-md-custom border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
            <Icon className="w-6 h-6 text-project" />
            <h2 className="text-xl font-bold text-text-primary">{title}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">{children}</div>
    </div>
);

const FormField: React.FC<{ label: string; children: React.ReactNode; required?: boolean; fullWidth?: boolean }> = ({ label, children, required, fullWidth }) => (
    <div className={fullWidth ? 'md:col-span-2' : ''}>
        <label className="block text-sm font-medium text-text-secondary mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {children}
    </div>
);

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
            <Star key={i} size={18} className={i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'} />
        ))}
    </div>
);


export const NewResourceView: React.FC<NewResourceViewProps> = ({ onSubmit, onCancel, departments, initialData, projects, performanceEvaluations, resources }) => {
    const isEditing = !!initialData?.id;
    const [activeTab, setActiveTab] = useState('info');

    const [formData, setFormData] = useState<Partial<Omit<Resource, 'skills'>> & { skills: string }>(() => {
        const { skills, ...restData } = initialData || {};
        return {
            name: '',
            position: '',
            departmentId: '',
            email: '',
            phone: '',
            startDate: new Date().toISOString().split('T')[0],
            employmentType: EmploymentType.FullTime,
            weeklyHours: 40,
            ...restData,
            skills: getArrayAsTextValue(skills),
        };
    });
     
    useEffect(() => {
        if (initialData) {
            const { skills, ...restData } = initialData;
            setFormData(prev => ({
                ...prev,
                ...restData,
                skills: getArrayAsTextValue(skills),
            }));
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? (value ? Number(value) : '') : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ ...formData, id: initialData?.id });
    };

    const assignedProjects = useMemo(() => {
        if (!initialData) return [];
        // FIX: Corrected comparison from object to ID.
        return projects.filter(p => p.team.includes(initialData.id) || p.managerId === initialData.id);
    }, [initialData, projects]);

    const resourcePerformanceEvaluations = useMemo(() => {
        if (!initialData) return [];
        return performanceEvaluations
            .filter(pe => pe.resourceId === initialData.id)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [initialData, performanceEvaluations]);

    const tabOptions = [
        { id: 'info', label: 'Personel Bilgileri', icon: User },
        { id: 'projects', label: 'Atandığı Projeler', icon: Briefcase },
        { id: 'performance', label: 'Performans', icon: BarChart2 },
    ];

    const departmentOptions = useMemo(() => {
        const rootDepartments = departments.filter(d => !d.parentId);
        const options: React.ReactElement[] = [];
        
        const buildOptions = (department: Department, level: number) => {
            options.push(
                <option key={department.id} value={department.id}>
                    {'--'.repeat(level)} {department.name}
                </option>
            );
            const children = departments.filter(d => d.parentId === department.id);
            children.forEach(child => buildOptions(child, level + 1));
        };

        rootDepartments.forEach(root => buildOptions(root, 0));
        return options;
    }, [departments]);


    return (
        <div className="bg-main-bg min-h-full animate-fadeIn">
            <div className="max-w-none mx-auto">
                <div className="bg-white border-b p-4 sm:px-8">
                    <div className="flex items-center gap-4">
                        <button onClick={onCancel} className="p-2 rounded-full hover:bg-gray-200">
                            <ArrowLeft className="w-6 h-6 text-text-secondary" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-text-primary">{isEditing ? formData.name : 'Yeni Personel Ekle'}</h1>
                            <p className="text-md text-text-secondary mt-1">{isEditing ? formData.position : 'Organizasyonunuza yeni bir üye ekleyin.'}</p>
                        </div>
                    </div>
                     {isEditing && (
                        <div className="mt-4">
                            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                                {tabOptions.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                                            activeTab === tab.id
                                                ? 'border-project text-project'
                                                : 'border-transparent text-text-secondary hover:text-project'
                                        }`}
                                    >
                                        <tab.icon size={16} />
                                        <span>{tab.label}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    )}
                </div>

                <div className="p-4 sm:p-8">
                    {(!isEditing || activeTab === 'info') && (
                        <div className="flex flex-col lg:flex-row gap-8 items-start">
                            <form onSubmit={handleSubmit} className="w-full lg:w-2/3 space-y-6">
                                <SectionCard icon={User} title="Kişisel Bilgiler">
                                    <FormField label="İsim Soyisim" required><input name="name" value={formData.name || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required /></FormField>
                                    <FormField label="Pozisyon" required><input name="position" value={formData.position || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required /></FormField>
                                    <FormField label="E-posta Adresi"><input type="email" name="email" value={formData.email || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" /></FormField>
                                    <FormField label="Telefon Numarası"><input type="tel" name="phone" value={formData.phone || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" /></FormField>
                                     {isEditing && initialData?.earnedBadges && initialData.earnedBadges.length > 0 && (
                                        <FormField label="Rozetler" fullWidth>
                                            <div className="flex flex-wrap gap-2 pt-2">
                                                {initialData.earnedBadges.map(badgeId => {
                                                    const badge = badgeLibrary[badgeId];
                                                    if (!badge) return null;
                                                    const Icon = badge.icon;
                                                    return (
                                                        <div key={badge.id} title={badge.description} className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded-full text-sm font-semibold">
                                                            <Icon size={16} />
                                                            <span>{badge.name}</span>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </FormField>
                                     )}
                                </SectionCard>
                                <SectionCard icon={Briefcase} title="İstihdam Bilgileri">
                                    <FormField label="Departman" required>
                                        <select name="departmentId" value={formData.departmentId || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md bg-white" required>
                                            <option value="">Departman Seçin...</option>
                                            {departmentOptions}
                                        </select>
                                    </FormField>
                                    <FormField label="İşe Başlangıç Tarihi"><input type="date" name="startDate" value={formData.startDate || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" /></FormField>
                                    <FormField label="Çalışma Türü" fullWidth>
                                        <select name="employmentType" value={formData.employmentType || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md bg-white">
                                            {Object.values(EmploymentType).map(type => <option key={type} value={type}>{type}</option>)}
                                        </select>
                                    </FormField>
                                </SectionCard>
                                <SectionCard icon={BrainCircuit} title="Yetkinlikler ve Kapasite">
                                    <FormField label="Yetenekler (virgülle ayırın)" fullWidth><input name="skills" value={formData.skills} onChange={handleChange} placeholder="React, Proje Yönetimi, Figma" className="w-full p-2 border border-gray-300 rounded-md" /></FormField>
                                    <FormField label="Haftalık Kapasite (saat)" required><input type="number" name="weeklyHours" value={formData.weeklyHours || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required /></FormField>
                                </SectionCard>
                                <div className="flex justify-end gap-4 pt-4">
                                    <button type="button" onClick={onCancel} className="flex items-center gap-2 px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-md hover:bg-gray-300 transition"><X size={18}/> İptal</button>
                                    <button type="submit" className="flex items-center justify-center gap-2 px-6 py-2 bg-project text-white font-semibold rounded-md hover:bg-project-focus transition shadow-lg"><Save size={18} /> {isEditing ? 'Değişiklikleri Kaydet' : 'Personeli Kaydet'}</button>
                                </div>
                            </form>
                            <div className="w-full lg:w-1/3 space-y-6 lg:sticky top-24">
                                <SectionCard icon={Check} title="Hazırlık Kontrol Listesi"><ul className="space-y-2 text-sm text-text-secondary md:col-span-2"><li className="flex items-center gap-2"><Check size={16} className="text-green-500" /> Hoş geldin e-postası gönder.</li><li className="flex items-center gap-2"><Check size={16} className="text-gray-400" /> Gerekli yazılım lisanslarını ata.</li><li className="flex items-center gap-2"><Check size={16} className="text-gray-400" /> Oryantasyon takvimini planla.</li><li className="flex items-center gap-2"><Check size={16} className="text-gray-400" /> Ekip tanıtım toplantısı ayarla.</li></ul></SectionCard>
                                {formData.departmentId && (<SectionCard icon={Info} title="Departman İstatistikleri"><div className="md:col-span-2 space-y-3"><h4 className="font-bold text-lg text-project">{departments.find(d=>d.id === formData.departmentId)?.name}</h4><p className="text-sm">Toplam Personel: <span className="font-semibold">{resources.filter(r => r.departmentId === formData.departmentId).length}</span></p></div></SectionCard>)}
                                <SectionCard icon={HelpCircle} title="Yardımcı Bilgiler"><div className="md:col-span-2 text-sm text-text-secondary space-y-2"><p><strong className="text-text-primary">Haftalık Kapasite:</strong> Bu personelin bir hafta içinde proje görevlerine ayırabileceği maksimum saat miktarıdır.</p><p><strong className="text-text-primary">Yetenekler:</strong> Personelin ana yetkinliklerini virgülle ayırarak girin. Bu, kaynak atamalarını kolaylaştıracaktır.</p></div></SectionCard>
                            </div>
                        </div>
                    )}
                    
                    {isEditing && activeTab === 'projects' && (
                        <div className="space-y-4">
                            {assignedProjects.map(project => (
                                <div key={project.id} className="bg-white p-4 rounded-lg shadow-sm border flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-project">{project.name}</p>
                                        <p className="text-sm text-text-secondary">{project.managerId === initialData.id ? 'Yönetici' : 'Ekip Üyesi'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-sm font-semibold ${project.status === ProjectStatus.Active ? 'text-green-600' : 'text-gray-500'}`}>{project.status}</p>
                                        <p className="text-xs text-text-secondary">{new Date(project.startDate).getFullYear()} - {new Date(project.endDate).getFullYear()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                     {isEditing && activeTab === 'performance' && (
                        <div className="space-y-4">
                           {resourcePerformanceEvaluations.map(pe => {
                               const evaluator = resources.find(r => r.id === pe.evaluatorId);
                               return(
                                <div key={pe.id} className="bg-white p-5 rounded-lg shadow-sm border">
                                    <div className="flex justify-between items-center mb-3 border-b pb-3">
                                        <div>
                                            <p className="font-bold text-text-primary">{new Date(pe.date).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long' })} Değerlendirmesi</p>
                                            <p className="text-sm text-text-secondary">Değerlendiren: {evaluator?.name || 'Bilinmiyor'}</p>
                                        </div>
                                        <StarRating rating={pe.rating} />
                                    </div>
                                    <p className="text-text-secondary mb-4">{pe.comment}</p>
                                    {pe.goals && pe.goals.length > 0 && (
                                        <div>
                                            <h4 className="font-semibold text-sm mb-2">Hedefler</h4>
                                            <ul className="space-y-2">
                                                {pe.goals.map((goal, i) => (
                                                    <li key={i} className="flex items-center gap-2 text-sm">
                                                        {goal.completed ? <CheckCircle size={16} className="text-green-500" /> : <Circle size={16} className="text-gray-400" />}
                                                        <span className={goal.completed ? 'line-through text-gray-500' : ''}>{goal.goal}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                               )
                           })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};