

import React, { useState, useMemo } from 'react';
import { Resource, User, Department, Role, roleAuthority, Task } from '../../types';
import { Users, AlertCircle, TrendingUp, UserCheck, Plus, Edit, Trash2, Search, List, Building, LayoutGrid } from 'lucide-react';
import { useProAjandaStore } from '../../hooks/useProAjandaStore';
import { OrgChart } from '../OrgChart';
import { ResourceDetailModal } from '../ResourceDetailModal';
import { DepartmentModal } from '../DepartmentModal';
import { DepartmentDetailView } from './DepartmentDetailView';


interface ResourcesViewProps {
    resources: Resource[];
    departments: Department[];
    onAddResource: () => void;
    onEditResource: (resource: Resource) => void;
    onDeleteResource: (resourceId: string) => void;
    currentUser: User;
    store: ReturnType<typeof useProAjandaStore>;
}

const KpiCard: React.FC<{ title: string; value: string | number; icon: React.ElementType; color: string }> = ({ title, value, icon: Icon, color }) => (
    <div className="bg-card-bg p-6 rounded-lg shadow-md-custom flex items-center gap-4">
        <div className={`p-3 rounded-full`} style={{ backgroundColor: `${color}1A`}}>
             <Icon size={24} style={{ color: color }}/>
        </div>
        <div>
            <p className="text-sm text-text-secondary">{title}</p>
            <p className="text-2xl font-bold text-text-primary">{value}</p>
        </div>
    </div>
);

const getLoadStatus = (load: number, capacity: number) => {
    const ratio = load / capacity;
    if (ratio > 1) return { text: 'Aşırı Yüklü', color: 'bg-status-red-bg text-status-red-text' };
    if (ratio > 0.8) return { text: 'Optimal', color: 'bg-status-green-bg text-status-green-text' };
    return { text: 'Müsait', color: 'bg-status-blue-bg text-status-blue-text' };
}

export const ResourcesView: React.FC<ResourcesViewProps> = React.memo(({ resources, departments, onAddResource, onEditResource, onDeleteResource, currentUser, store }) => {
    
    const [activeTab, setActiveTab] = useState<'list' | 'org'>('org');
    const [searchQuery, setSearchQuery] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
    const [viewType, setViewType] = useState<'card' | 'list'>('card');

    const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false);
    const [departmentToEdit, setDepartmentToEdit] = useState<Department | null>(null);
    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);


    const canManageOrg = roleAuthority[currentUser.role] <= roleAuthority[Role.Admin];
    
    const getSubDepartmentIds = (parentId: string): string[] => {
        let result: string[] = [];
        const children = departments.filter(d => d.parentId === parentId);
        for (const child of children) {
            result.push(child.id);
            result = result.concat(getSubDepartmentIds(child.id));
        }
        return result;
    };

    const canManageResource = (resource: Resource): boolean => {
        const userRole = currentUser.role;
        const userAuthority = roleAuthority[userRole];
        if (userAuthority <= roleAuthority[Role.Admin]) {
            return true; // Superadmin and Admin can manage everyone
        }
        if (userAuthority <= roleAuthority[Role.Manager] && currentUser.departmentId) {
             const manageableDeptIds = [currentUser.departmentId, ...getSubDepartmentIds(currentUser.departmentId)];
             return manageableDeptIds.includes(resource.departmentId);
        }
        return false;
    };

    const handleCardClick = (resource: Resource) => {
        setSelectedResource(resource);
    };

    const handleGoToDetails = (resource: Resource) => {
        setSelectedResource(null);
        onEditResource(resource);
    };
    
    const openAddDepartmentModal = () => {
        setDepartmentToEdit(null);
        setIsDepartmentModalOpen(true);
    };

    const openEditDepartmentModal = (department: Department) => {
        setDepartmentToEdit(department);
        setIsDepartmentModalOpen(true);
    };

    const handleDeleteDepartment = (departmentId: string) => {
        if (window.confirm('Bu departmanı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
            store.deleteDepartment(departmentId);
        }
    };


    const handleSaveDepartment = (data: Omit<Department, 'id'> & { id?: string }) => {
        if (data.id) {
            store.updateDepartment(data as Department);
        } else {
            store.addDepartment(data);
        }
        setIsDepartmentModalOpen(false);
    };

    const handleDepartmentClick = (department: Department) => {
        setSelectedDepartment(department);
    };

    const handleCloseDepartmentDetail = () => {
        setSelectedDepartment(null);
    };


    const selectedResourceManager = useMemo(() => {
        if (!selectedResource || !selectedResource.managerId) return undefined;
        return resources.find(r => r.id === selectedResource.managerId);
    }, [selectedResource, resources]);

    const selectedResourceDepartment = useMemo(() => {
        if (!selectedResource) return undefined;
        return departments.find(d => d.id === selectedResource.departmentId);
    }, [selectedResource, departments]);

    const filteredResources = useMemo(() => {
        return resources.filter(resource => {
            const nameMatch = resource.name.toLowerCase().includes(searchQuery.toLowerCase());
            const departmentMatch = departmentFilter === 'all' || resource.departmentId === departmentFilter;
            return nameMatch && departmentMatch;
        });
    }, [resources, searchQuery, departmentFilter]);

    const totalCapacity = filteredResources.reduce((sum, r) => sum + r.weeklyHours, 0);
    const totalLoad = filteredResources.reduce((sum, r) => sum + r.currentLoad, 0);
    const overallUtilization = totalCapacity > 0 ? ((totalLoad / totalCapacity) * 100).toFixed(0) : 0;
    const overloadedResources = filteredResources.filter(r => r.currentLoad > r.weeklyHours).length;
    const availableResources = filteredResources.filter(r => r.currentLoad / r.weeklyHours <= 0.8).length;

    const kpiData = [
        { title: 'Toplam Personel', value: filteredResources.length, icon: Users, color: '#7C3AED' },
        { title: 'Genel Kullanım', value: `${overallUtilization}%`, icon: TrendingUp, color: '#22C55E' },
        { title: 'Aşırı Yüklü', value: overloadedResources, icon: AlertCircle, color: '#EF4444' },
        { title: 'Müsait Personel', value: availableResources, icon: UserCheck, color: '#3B82F6' },
    ];
    
    const tabOptions = [
        { id: 'list', label: 'Personel Listesi', icon: List },
        { id: 'org', label: 'Organizasyon Yapısı', icon: Building, requiresAdmin: true },
    ];

    const availableTabs = tabOptions.filter(tab => !tab.requiresAdmin || canManageOrg);

    if (selectedDepartment) {
        return (
            <DepartmentDetailView
                department={selectedDepartment}
                onClose={handleCloseDepartmentDetail}
                resources={resources}
                projects={store.projects}
                tasks={store.tasks}
            />
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                     <h1 className="text-2xl font-bold text-text-primary">Kaynak Yönetimi</h1>
                     <p className="text-text-secondary mt-1">Ekibinizin iş yükünü ve kapasitesini yönetin.</p>
                </div>
                {roleAuthority[currentUser.role] <= roleAuthority[Role.Manager] && (
                    <button 
                        onClick={onAddResource}
                        className="flex items-center gap-2 px-4 py-2 bg-project text-white rounded-md hover:bg-project-focus transition-colors"
                    >
                        <Plus size={18} />
                        <span>Yeni Personel Ekle</span>
                    </button>
                )}
            </div>

            <div className="border-b border-border-color">
                <nav className="-mb-px flex space-x-4 overflow-x-auto" aria-label="Tabs">
                    {availableTabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as 'list' | 'org')}
                            className={`flex-shrink-0 flex items-center gap-2 px-3 py-3 text-sm font-medium border-b-2 transition-colors duration-200 focus:outline-none ${
                                activeTab === tab.id
                                    ? 'border-b-project text-project'
                                    : 'border-transparent text-text-secondary hover:text-project focus:border-b-project'
                            }`}
                        >
                            <tab.icon className="h-5 w-5" />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </nav>
            </div>
            
            {activeTab === 'list' && (
                 <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {kpiData.map(kpi => <KpiCard key={kpi.title} {...kpi} />)}
                    </div>

                    <div className="bg-card-bg p-4 rounded-lg shadow-md-custom flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                            <div className="w-full sm:max-w-xs relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input 
                                    type="text" 
                                    placeholder="Personel ara..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 text-sm border rounded-md bg-gray-50 focus:ring-1 focus:ring-project focus:border-project" 
                                />
                            </div>
                            <select 
                                value={departmentFilter}
                                onChange={(e) => setDepartmentFilter(e.target.value)}
                                className="w-full sm:w-auto p-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-project focus:border-project"
                            >
                                <option value="all">Tüm Departmanlar</option>
                                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                        </div>
                        <div className="flex-shrink-0 bg-gray-100 p-1 rounded-lg flex items-center gap-1">
                            <button onClick={() => setViewType('card')} className={`p-2 rounded-md transition-colors ${viewType === 'card' ? 'bg-white shadow text-project' : 'text-text-secondary hover:bg-gray-200'}`} aria-label="Card View">
                                <LayoutGrid size={16} />
                            </button>
                            <button onClick={() => setViewType('list')} className={`p-2 rounded-md transition-colors ${viewType === 'list' ? 'bg-white shadow text-project' : 'text-text-secondary hover:bg-gray-200'}`} aria-label="List View">
                                <List size={16} />
                            </button>
                        </div>
                    </div>
                    
                    {viewType === 'card' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredResources.map(resource => {
                                const status = getLoadStatus(resource.currentLoad, resource.weeklyHours);
                                const department = departments.find(d => d.id === resource.departmentId);
                                const canManage = canManageResource(resource);
                                return (
                                <div key={resource.id} className="bg-white rounded-lg shadow-md-custom p-5 flex flex-col gap-4 hover:shadow-lg-custom hover:-translate-y-1 transition-all duration-300 relative group">
                                    {canManage && (
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white/50 backdrop-blur-sm p-1 rounded-full">
                                        <button onClick={() => onEditResource(resource)} className="p-2 text-text-secondary hover:text-project hover:bg-gray-100 rounded-full">
                                            <Edit size={16} />
                                        </button>
                                        <button onClick={() => onDeleteResource(resource.id)} className="p-2 text-text-secondary hover:text-red-500 hover:bg-gray-100 rounded-full">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    )}
                                    <div className="flex flex-col items-center text-center">
                                        <img src={`https://picsum.photos/seed/${resource.id}/80/80`} alt={resource.name} className="w-20 h-20 rounded-full border-4 border-gray-100" />
                                        <h3 className="font-bold text-lg text-text-primary mt-3">{resource.name}</h3>
                                        <p className="text-sm text-project font-semibold">{resource.position}</p>
                                        <p className="text-xs text-text-secondary mt-1">{department?.name}</p>
                                    </div>
                                    <div className="border-t pt-3">
                                        <h4 className="text-xs font-semibold text-text-secondary uppercase mb-2 text-center">Yetenekler</h4>
                                        <div className="flex flex-wrap gap-1 justify-center">
                                            {resource.skills.slice(0, 3).map(skill => (
                                                <span key={skill} className="bg-status-purple-bg text-status-purple-text text-xs font-medium px-2 py-0.5 rounded-full">{skill}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mt-auto pt-3">
                                        <div className="flex justify-between items-center text-sm text-text-secondary mb-1">
                                            <span>İş Yükü</span>
                                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${status.color}`}>{status.text}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="h-2 rounded-full" 
                                                style={{ 
                                                    width: `${Math.min((resource.currentLoad / resource.weeklyHours) * 100, 100)}%`,
                                                    backgroundColor: resource.currentLoad > resource.weeklyHours ? '#EF4444' : '#8B5CF6'
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-card-bg rounded-lg shadow-md-custom overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">Personel</th>
                                            <th scope="col" className="px-6 py-3">Departman</th>
                                            <th scope="col" className="px-6 py-3">Yetenekler</th>
                                            <th scope="col" className="px-6 py-3">İş Yükü</th>
                                            <th scope="col" className="px-6 py-3">Durum</th>
                                            <th scope="col" className="px-6 py-3">Eylemler</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredResources.map(resource => {
                                            const status = getLoadStatus(resource.currentLoad, resource.weeklyHours);
                                            const department = departments.find(d => d.id === resource.departmentId);
                                            const canManage = canManageResource(resource);
                                            return (
                                            <tr key={resource.id} className="bg-white border-b hover:bg-gray-50">
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex items-center gap-3">
                                                    <img src={`https://picsum.photos/seed/${resource.id}/40/40`} alt={resource.name} className="w-10 h-10 rounded-full" />
                                                    <div>
                                                        <div>{resource.name}</div>
                                                        <div className="text-xs text-text-secondary">{resource.position}</div>
                                                    </div>
                                                </th>
                                                <td className="px-6 py-4">{department?.name || 'N/A'}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-wrap gap-1 max-w-xs">
                                                        {resource.skills.map(skill => (
                                                            <span key={skill} className="bg-status-purple-bg text-status-purple-text text-xs font-medium px-2 py-0.5 rounded-full">{skill}</span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <span>{resource.currentLoad} / {resource.weeklyHours} sa</span>
                                                        <div className="w-24 bg-gray-200 rounded-full h-2">
                                                            <div 
                                                                className="h-2 rounded-full" 
                                                                style={{ 
                                                                    width: `${Math.min((resource.currentLoad / resource.weeklyHours) * 100, 100)}%`,
                                                                    backgroundColor: resource.currentLoad > resource.weeklyHours ? '#EF4444' : '#8B5CF6'
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${status.color}`}>
                                                        {status.text}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                   {canManage && (
                                                        <div className="flex items-center gap-2">
                                                            <button onClick={() => onEditResource(resource)} className="p-2 text-text-secondary hover:text-project hover:bg-gray-100 rounded-full">
                                                                <Edit size={16} />
                                                            </button>
                                                            <button onClick={() => onDeleteResource(resource.id)} className="p-2 text-text-secondary hover:text-red-500 hover:bg-gray-100 rounded-full">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        )})}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                 </div>
            )}

            {activeTab === 'org' && (
                <div className="mt-4 space-y-4">
                    {canManageOrg && (
                        <div className="flex justify-end">
                            <button
                                onClick={() => openAddDepartmentModal()}
                                className="flex items-center gap-2 px-4 py-2 bg-project text-white rounded-md hover:bg-project-focus transition-colors"
                            >
                                <Plus size={18} />
                                Yeni Departman Ekle
                            </button>
                        </div>
                    )}
                    <OrgChart
                        resources={resources}
                        departments={departments}
                        projects={store.projects}
                        onEditDepartment={openEditDepartmentModal}
                        onDeleteDepartment={handleDeleteDepartment}
                        canManage={canManageOrg}
                        onCardClick={handleDepartmentClick}
                    />
                </div>
            )}

            {selectedResource && (
                <ResourceDetailModal
                    resource={selectedResource}
                    manager={selectedResourceManager}
                    department={selectedResourceDepartment}
                    onClose={() => setSelectedResource(null)}
                    onGoToDetails={handleGoToDetails}
                />
            )}

            {isDepartmentModalOpen && (
                <DepartmentModal
                    isOpen={isDepartmentModalOpen}
                    onClose={() => setIsDepartmentModalOpen(false)}
                    onSave={handleSaveDepartment}
                    initialData={departmentToEdit}
                    resources={resources}
                />
            )}
        </div>
    );
});