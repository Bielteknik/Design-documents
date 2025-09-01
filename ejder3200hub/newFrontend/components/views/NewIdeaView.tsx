import React, { useState, useEffect, useCallback } from 'react';
import { Idea, Resource } from '../../types';
import { 
    Send, XCircle, Plus, Trash2, Lightbulb, Target, GanttChartSquare, ShieldCheck,
    Paperclip, Users, Award, Banknote, UploadCloud, FileText, AlertTriangle, HelpCircle, Activity, PiggyBank
} from 'lucide-react';

interface NewIdeaViewProps {
    onSubmit: (idea: Omit<Idea, 'id' | 'status' | 'authorId'>, files: File[]) => void;
    onCancel: () => void;
    resources: Resource[];
    initialData?: Idea | null;
}

const SectionCard: React.FC<{ icon: React.ElementType; title: string; children: React.ReactNode; action?: React.ReactNode }> = ({ icon: Icon, title, children, action }) => (
    <div className="bg-white p-6 rounded-lg shadow-md-custom border border-gray-200">
        <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
                <Icon className="w-6 h-6 text-project" />
                <h2 className="text-xl font-bold text-text-primary">{title}</h2>
            </div>
            {action}
        </div>
        <div className="space-y-4">{children}</div>
    </div>
);

const FormField: React.FC<{ label: string; children: React.ReactNode; required?: boolean; description?: string; action?: React.ReactNode }> = ({ label, children, required, description, action }) => (
    <div>
        <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-text-secondary mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {action}
        </div>
        {children}
        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
    </div>
);

const CheckboxField: React.FC<{ id: string; name: string; label: string; checked: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ id, name, label, checked, onChange }) => (
    <div className="flex items-center">
        <input id={id} name={name} type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 rounded border-gray-300 text-project focus:ring-project" />
        <label htmlFor={id} className="ml-2 block text-sm text-text-primary">{label}</label>
    </div>
);

const CurrencyInput: React.FC<{ name: string; value?: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; required?: boolean; }> = ({ name, value, onChange, placeholder, required }) => (
    <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">₺</span>
        <input type="number" name={name} value={value || ''} onChange={onChange} placeholder={placeholder} className="w-full p-2 pl-7 border border-gray-300 rounded-md shadow-sm bg-white focus:ring-project focus:border-project" required={required} />
    </div>
);

const FileUploader: React.FC<{ files: File[]; onFilesChange: (files: File[]) => void }> = ({ files, onFilesChange }) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            const uniqueNewFiles = newFiles.filter(
                newFile => !files.some(existingFile => 
                    existingFile.name === newFile.name && existingFile.size === newFile.size
                )
            );
            onFilesChange([...files, ...uniqueNewFiles]);
        }
    };
    
    const removeFile = (fileToRemove: File) => {
        onFilesChange(files.filter(file => file !== fileToRemove));
    };
    
    const formatBytes = (bytes: number, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    return (
        <div>
            <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-project hover:bg-gray-50 transition-colors"
            >
                <UploadCloud className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm text-text-secondary">Dosyaları sürükleyip bırakın veya <span className="font-semibold text-project hover:underline">gözatın</span></p>
                <input type="file" multiple ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            </div>
            {files.length > 0 && (
                <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
                     <div className="hidden md:flex items-center gap-3 w-full p-2 bg-gray-50/70 text-xs font-semibold text-text-secondary border-b border-gray-200">
                        <span className="w-8 pl-3"><FileText size={14}/></span>
                        <span className="flex-1">Dosya Adı</span>
                        <span className="w-24 text-center">Boyut</span>
                        <span className="w-12 text-center">Eylem</span>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                        <ul className="divide-y divide-gray-200">
                            {files.map((file, index) => (
                                <li key={index} className="flex items-center justify-between p-2 text-sm bg-white even:bg-gray-50/50">
                                    <div className="flex items-center gap-3 overflow-hidden flex-1">
                                        <div className="flex-grow overflow-hidden">
                                            <p className="font-medium text-text-primary truncate">{file.name}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-text-secondary w-24 flex-shrink-0 text-center">{formatBytes(file.size)}</span>
                                    <div className="w-12 flex justify-center flex-shrink-0">
                                        <button type="button" onClick={() => removeFile(file)} className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export const NewIdeaView: React.FC<NewIdeaViewProps> = React.memo(({ onSubmit, onCancel, resources, initialData }) => {
    const [formData, setFormData] = useState<Partial<Idea>>(initialData || { relatedDepartments: [], timelinePhases: [{name: '', duration: ''}], budgetItems: [{name: '', amount: undefined}], potentialTeam: [] });
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    
    useEffect(() => {
        if (initialData) {
            const data = { ...initialData };
            if (!data.timelinePhases || data.timelinePhases.length === 0) data.timelinePhases = [{ name: '', duration: '' }];
            if (!data.budgetItems || data.budgetItems.length === 0) data.budgetItems = [{ name: '', amount: undefined }];
            if (!data.potentialTeam) data.potentialTeam = [];
            setFormData(data);
            // Note: File objects can't be restored from initialData which only has filenames.
            // This component assumes new file uploads for edits.
        }
    }, [initialData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormData(prev => {
                const arr = prev.relatedDepartments || [];
                return { ...prev, relatedDepartments: checked ? [...arr, name] : arr.filter((i: string) => i !== name) };
            });
        } else {
             const isNumeric = ['totalBudget', 'expectedRevenueIncrease', 'expectedCostSavings'].includes(name);
             setFormData(prev => ({ ...prev, [name]: isNumeric ? (value === '' ? undefined : Number(value)) : value }));
        }
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

    const handleListChange = (listName: 'timelinePhases' | 'budgetItems', index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const list = formData[listName] as any[];
        const updatedList = list.map((item, i) => i === index ? { ...item, [name]: name === 'amount' ? (value === '' ? undefined : Number(value)) : value } : item);
        setFormData(prev => ({ ...prev, [listName]: updatedList }));
    };

    const addListItem = (listName: 'timelinePhases' | 'budgetItems') => {
        const newItem = listName === 'timelinePhases' ? { name: '', duration: '' } : { name: '', amount: undefined };
        const list = formData[listName] || [];
        setFormData(prev => ({ ...prev, [listName]: [...list, newItem] }));
    };

    const removeListItem = (listName: 'timelinePhases' | 'budgetItems', index: number) => {
        const list = formData[listName] as any[];
        if (list.length > 1) {
          setFormData(prev => ({ ...prev, [listName]: list.filter((_, i) => i !== index) }));
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalData = {
            ...formData,
            name: formData.name!,
            tags: typeof (formData.tags as any) === 'string' ? (formData.tags as any).split(',').map((t: string) => t.trim()) : formData.tags,
            files: [...(initialData?.files || []), ...selectedFiles.map(f => f.name)],
        };
        onSubmit(finalData as Omit<Idea, 'id' | 'status' | 'authorId'>, selectedFiles);
    };

    const departments = ['Teknoloji', 'Pazarlama', 'Satış', 'Finans', 'İnsan Kaynakları', 'Üretim'];
    const categories = ['İç Süreç İyileştirme', 'Yeni Ürün/Hizmet', 'Pazarlama Stratejisi', 'Teknolojik Geliştirme', 'Operasyonel Verimlilik', 'Müşteri Deniyimi'];
    const isEditing = !!initialData?.id;

    return (
        <div className="bg-main-bg p-2 md:p-4 animate-fadeIn">
            <form onSubmit={handleSubmit}>
                <div className="max-w-none mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-text-primary">Fikir Haritası</h1>
                            <p className="text-md text-text-secondary mt-2">Parlak fikrinizi tüm boyutlarıyla detaylandırarak hayata geçirmeye bir adım daha yaklaşın.</p>
                        </div>

                        <SectionCard icon={Lightbulb} title="Fikrin Temelleri">
                            <FormField label="Fikir Başlığı" required><input name="name" value={formData.name || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-project focus:border-project" required /></FormField>
                            <FormField label="Özet" description="Fikrinizi tek cümleyle açıklayın." required><textarea name="summary" value={formData.summary || ''} onChange={handleInputChange} rows={2} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-project focus:border-project" required /></FormField>
                            <FormField label="Detaylı Açıklama"><textarea name="description" value={formData.description || ''} onChange={handleInputChange} rows={4} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-project focus:border-project" /></FormField>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField label="Kategori">
                                     <select name="category" value={formData.category || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md bg-white shadow-sm focus:ring-project focus:border-project">
                                        <option value="">Kategori Seçin...</option>
                                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                </FormField>
                                <FormField label="Etiketler"><input name="tags" value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags || ''} onChange={handleInputChange} placeholder="pazarlama, verimlilik, mobil" className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-project focus:border-project" /></FormField>
                            </div>
                        </SectionCard>
                        
                        <SectionCard icon={HelpCircle} title="Problem Analizi">
                             <FormField label="Problem Tanımı" description="Bu fikir hangi problemi veya ihtiyacı çözüyor?"><textarea name="problem" value={formData.problem || ''} onChange={handleInputChange} rows={3} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-project focus:border-project" /></FormField>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField label="Problem Türü">
                                    <select name="problemType" value={formData.problemType || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md bg-white shadow-sm focus:ring-project focus:border-project">
                                        <option value="">Seçiniz...</option>
                                        <option>Teknik</option><option>Operasyonel</option><option>Stratejik</option><option>Diğer</option>
                                    </select>
                                </FormField>
                                <FormField label="Problem Sıklığı">
                                    <select name="problemFrequency" value={formData.problemFrequency || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md bg-white shadow-sm focus:ring-project focus:border-project">
                                        <option value="">Seçiniz...</option>
                                        <option>Sık</option><option>Ara Sıra</option><option>Nadir</option>
                                    </select>
                                </FormField>
                            </div>
                        </SectionCard>
                        
                        <SectionCard icon={Target} title="Stratejik Çerçeve">
                            <FormField label="Çözüm Önerisi"><textarea name="solution" value={formData.solution || ''} onChange={handleInputChange} rows={3} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-project focus:border-project" /></FormField>
                            <FormField label="Hedeflenen Faydalar"><textarea name="benefits" value={formData.benefits || ''} onChange={handleInputChange} rows={3} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-project focus:border-project" /></FormField>
                            <FormField label="Hedef Kitle" description="Bu fikirden kimler etkilenecek veya kimler kullanacak?"><textarea name="targetAudience" value={formData.targetAudience || ''} onChange={handleInputChange} rows={3} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-project focus:border-project" /></FormField>
                        </SectionCard>

                        <SectionCard icon={ShieldCheck} title="SWOT Analizi">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField label="Güçlü Yönler (Strengths)"><textarea name="swotStrengths" value={formData.swotStrengths || ''} onChange={handleInputChange} rows={4} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-project focus:border-project" /></FormField>
                                <FormField label="Zayıf Yönler (Weaknesses)"><textarea name="swotWeaknesses" value={formData.swotWeaknesses || ''} onChange={handleInputChange} rows={4} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-project focus:border-project" /></FormField>
                                <FormField label="Fırsatlar (Opportunities)"><textarea name="swotOpportunities" value={formData.swotOpportunities || ''} onChange={handleInputChange} rows={4} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-project focus:border-project" /></FormField>
                                <FormField label="Tehditler (Threats)"><textarea name="swotThreats" value={formData.swotThreats || ''} onChange={handleInputChange} rows={4} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-project focus:border-project" /></FormField>
                            </div>
                        </SectionCard>

                        <SectionCard icon={Activity} title="ROI Analizi">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField label="Beklenen Gelir Artışı">
                                    <CurrencyInput name="expectedRevenueIncrease" value={formData.expectedRevenueIncrease} onChange={handleInputChange} />
                                </FormField>
                                <FormField label="Maliyet Tasarrufu">
                                    <CurrencyInput name="expectedCostSavings" value={formData.expectedCostSavings} onChange={handleInputChange} />
                                </FormField>
                            </div>
                        </SectionCard>

                        <SectionCard icon={AlertTriangle} title="Risk Analizi">
                            <FormField label="Risk Seviyesi">
                                <select name="riskLevel" value={formData.riskLevel || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md bg-white shadow-sm focus:ring-project focus:border-project">
                                    <option value="">Seçiniz...</option>
                                    <option>Düşük</option><option>Orta</option><option>Yüksek</option>
                                </select>
                            </FormField>
                            <FormField label="Olası Riskler"><textarea name="risks" value={formData.risks || ''} onChange={handleInputChange} rows={3} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-project focus:border-project" /></FormField>
                            <FormField label="Risk Azaltma Stratejileri (Önlemler)"><textarea name="mitigations" value={formData.mitigations || ''} onChange={handleInputChange} rows={3} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-project focus:border-project" /></FormField>
                        </SectionCard>
                        
                        <SectionCard 
                            icon={GanttChartSquare} 
                            title="Zaman Planı"
                            action={
                                <button type="button" onClick={() => addListItem('timelinePhases')} className="flex items-center gap-2 text-sm bg-project text-white px-3 py-1.5 rounded-md hover:bg-project-focus transition-colors">
                                    <Plus size={16}/> Aşama Ekle
                                </button>
                            }
                        >
                            <FormField label="Tahmini Süre" required>
                                <select name="estimatedDuration" value={formData.estimatedDuration || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md bg-white shadow-sm focus:ring-project focus:border-project" required>
                                    <option value="">Seçiniz...</option><option>0-3 Ay</option><option>3-6 Ay</option><option>6-12 Ay</option><option>12+ Ay</option>
                                </select>
                            </FormField>
                            
                            <FormField label="Proje Aşamaları">
                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <div className="hidden md:flex items-center gap-3 w-full p-2 bg-gray-50/70 text-xs font-semibold text-text-secondary border-b border-gray-200">
                                        <span className="w-8 pl-2">#</span>
                                        <span className="flex-1">Aşama Adı</span>
                                        <span className="w-40">Süre</span>
                                        <span className="w-10"></span>
                                    </div>
                                    <div className="max-h-72 overflow-y-auto">
                                        <div className="divide-y divide-gray-200">
                                            {formData.timelinePhases?.map((phase, index) => (
                                                <div key={index} className="flex flex-col md:flex-row items-start md:items-center gap-2 w-full p-2">
                                                    <span className="text-gray-500 font-medium w-8 text-center hidden md:block">{index + 1}</span>
                                                    <input name="name" value={phase.name} onChange={(e) => handleListChange('timelinePhases', index, e)} placeholder="Aşama Adı" className="flex-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-project focus:border-project" />
                                                    <input name="duration" value={phase.duration} onChange={(e) => handleListChange('timelinePhases', index, e)} placeholder="Örn: 2 Hafta" className="w-full md:w-40 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-project focus:border-project" />
                                                    <button type="button" onClick={() => removeListItem('timelinePhases', index)} className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 w-10 flex justify-center self-end md:self-center" aria-label="Aşamayı sil"><Trash2 size={16}/></button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </FormField>
                        </SectionCard>
                        
                        <SectionCard 
                            icon={PiggyBank}
                            title="Bütçe Planı"
                            action={
                                <button type="button" onClick={() => addListItem('budgetItems')} className="flex items-center gap-2 text-sm bg-project text-white px-3 py-1.5 rounded-md hover:bg-project-focus transition-colors">
                                   <Plus size={16}/> Kalem Ekle
                               </button>
                            }
                        >
                            <FormField label="Toplam Bütçe" required>
                                <CurrencyInput name="totalBudget" value={formData.totalBudget} onChange={handleInputChange} required />
                            </FormField>
                            
                            <FormField label="Bütçe Kalemleri">
                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <div className="hidden md:flex items-center gap-3 w-full p-2 bg-gray-50/70 text-xs font-semibold text-text-secondary border-b border-gray-200">
                                        <span className="w-8 pl-2">#</span>
                                        <span className="flex-1">Kalem Adı</span>
                                        <span className="w-40">Tutar</span>
                                        <span className="w-10"></span>
                                    </div>
                                    <div className="max-h-72 overflow-y-auto">
                                        <div className="divide-y divide-gray-200">
                                            {formData.budgetItems?.map((item, index) => (
                                                <div key={index} className="flex flex-col md:flex-row items-start md:items-center gap-2 w-full p-2">
                                                    <span className="text-gray-500 font-medium w-8 text-center hidden md:block">{index + 1}</span>
                                                    <input name="name" value={item.name} onChange={(e) => handleListChange('budgetItems', index, e)} placeholder="Kalem adı" className="flex-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-project focus:border-project" />
                                                    <div className="w-full md:w-40">
                                                      <CurrencyInput name="amount" value={item.amount} onChange={(e) => handleListChange('budgetItems', index, e)} placeholder="Tutar" />
                                                    </div>
                                                    <button type="button" onClick={() => removeListItem('budgetItems', index)} className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 w-10 flex justify-center self-end md:self-center" aria-label="Kalemi sil"><Trash2 size={16}/></button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </FormField>
                        </SectionCard>
                        
                        <SectionCard icon={Paperclip} title="Dosyalar">
                            <FileUploader files={selectedFiles} onFilesChange={setSelectedFiles} />
                        </SectionCard>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-1 sticky top-24 space-y-6">
                        <SectionCard icon={Send} title="Eylemler">
                            <p className="text-sm text-text-secondary mb-4">Fikrinizi göndermeye hazır olduğunuzda aşağıdaki butonu kullanın.</p>
                            <button type="submit" className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-project text-white font-semibold rounded-md hover:bg-project-focus transition shadow-lg">
                                <Send size={18} /> {isEditing ? 'Fikri Güncelle' : 'Fikri Oluştur'}
                            </button>
                            <button type="button" onClick={onCancel} className="w-full mt-2 flex items-center justify-center gap-2 px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-md hover:bg-gray-300 transition">
                                <XCircle size={18}/> İptal
                            </button>
                        </SectionCard>

                        <SectionCard icon={Users} title="Atamalar ve Sorumluluk">
                            <FormField label="Fikir Lideri">
                                <select name="projectLeaderId" value={formData.projectLeaderId || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md bg-white shadow-sm focus:ring-project focus:border-project">
                                    <option value="">Lider Seçin...</option>
                                    {resources.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                </select>
                            </FormField>
                            <FormField label="Potansiyel Ekip Üyeleri">
                                <select 
                                    name="potentialTeam" 
                                    multiple 
                                    value={formData.potentialTeam || []} 
                                    onChange={handleMultiSelectChange} 
                                    className="w-full p-2 h-32 border border-gray-300 rounded-md bg-white shadow-sm focus:ring-project focus:border-project"
                                >
                                    {resources.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                </select>
                                <p className="text-xs text-gray-500 mt-1">Ctrl/Cmd tuşu ile çoklu seçim yapabilirsiniz.</p>
                            </FormField>
                            <FormField label="İlgili Departmanlar">
                                <div className="space-y-2 pt-1">
                                    {departments.map(dep => (
                                        <CheckboxField key={dep} id={dep} name={dep} label={dep} checked={!!formData.relatedDepartments?.includes(dep)} onChange={handleInputChange} />
                                    ))}
                                </div>
                            </FormField>
                        </SectionCard>
                        
                        <SectionCard icon={Award} title="Başarı ve Finansman">
                            <FormField label="Başarı Kriterleri"><textarea name="successCriteria" value={formData.successCriteria || ''} onChange={handleInputChange} rows={3} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-project focus:border-project" /></FormField>
                            <FormField label="Finansman Kaynakları"><textarea name="fundingSources" value={formData.fundingSources || ''} onChange={handleInputChange} rows={3} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-project focus:border-project" /></FormField>
                            <FormField label="Gelir Kaynakları"><textarea name="revenueSources" value={formData.revenueSources || ''} onChange={handleInputChange} rows={3} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-project focus:border-project" /></FormField>
                        </SectionCard>
                    </div>
                </div>
            </form>
        </div>
    );
});