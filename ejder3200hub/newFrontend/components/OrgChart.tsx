

import React from 'react';
import { Resource, Department, Project, ProjectStatus } from '../types';
import { Edit, Trash2, Building, User, Users, Briefcase, Clock } from 'lucide-react';

interface DepartmentCardProps {
    department: Department;
    resources: Resource[];
    projects: Project[];
    onEditDepartment: (department: Department) => void;
    onDeleteDepartment: (departmentId: string) => void;
    canManage: boolean;
    onClick: (department: Department) => void;
}

const DepartmentCard: React.FC<DepartmentCardProps> = ({ department, resources, projects, onEditDepartment, onDeleteDepartment, canManage, onClick }) => {
    
    const members = resources.filter(r => r.departmentId === department.id);
    const manager = resources.find(r => r.id === department.managerId);
    const employeeCount = members.length;
    const activeProjectsCount = projects.filter(p => 
        p.status === ProjectStatus.Active && 
        p.team.some(memberId => members.find(m => m.id === memberId))
    ).length;
    const totalCapacity = members.reduce((sum, r) => sum + r.weeklyHours, 0);

    return (
        <div onClick={() => onClick(department)} className="bg-card-bg rounded-lg shadow-md-custom p-5 flex flex-col gap-4 border-l-4 border-yellow-400 group relative transition-all hover:shadow-lg-custom hover:-translate-y-1 cursor-pointer">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                    <div className="bg-gray-100 p-3 rounded-lg">
                        <Building className="w-6 h-6 text-project" />
                    </div>
                    <div>
                        <h3 className="font-bold text-text-primary text-xl">{department.name}</h3>
                        <p className="text-sm text-text-secondary">Departman</p>
                    </div>
                </div>
                {canManage && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => { e.stopPropagation(); onEditDepartment(department); }} title="Departmanı Düzenle" className="p-2 rounded-full hover:bg-gray-200 text-text-secondary hover:text-project transition-colors">
                            <Edit size={16} />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); onDeleteDepartment(department.id); }} title="Departmanı Sil" className="p-2 rounded-full hover:bg-red-100 text-text-secondary hover:text-red-600 transition-colors">
                            <Trash2 size={16} />
                        </button>
                    </div>
                )}
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-text-secondary my-2">
                <div className="flex items-center gap-2" title="Personel Sayısı">
                    <Users size={16} className="text-gray-400"/> 
                    <span className="font-medium text-text-primary">{employeeCount} Personel</span>
                </div>
                <div className="flex items-center gap-2" title="Aktif Proje Sayısı">
                    <Briefcase size={16} className="text-gray-400"/> 
                    <span className="font-medium text-text-primary">{activeProjectsCount} Proje</span>
                </div>
                <div className="flex items-center gap-2 col-span-2" title="Haftalık Toplam Kapasite">
                    <Clock size={16} className="text-gray-400"/> 
                    <span className="font-medium text-text-primary">{totalCapacity} Saat / Hafta</span>
                </div>
            </div>
            
            {/* Members Avatars */}
            <div className="flex items-center justify-between min-h-[36px]">
                 <div className="flex -space-x-3">
                    {members.slice(0, 7).map(member => (
                         <img 
                            key={member.id}
                            src={`https://picsum.photos/seed/${member.id}/32/32`}
                            alt={member.name}
                            title={member.name}
                            className="w-9 h-9 rounded-full border-2 border-white"
                         />
                    ))}
                    {members.length > 7 && (
                        <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-text-secondary border-2 border-white">
                            +{members.length - 7}
                        </div>
                    )}
                </div>
            </div>

            {/* Manager Footer */}
            <div className="border-t pt-4 mt-auto">
                {manager ? (
                    <>
                        <p className="text-xs text-text-secondary mb-2">Yönetici</p>
                        <div className="flex items-center gap-3">
                            <img 
                                src={`https://picsum.photos/seed/${manager.id}/40/40`}
                                alt={manager.name}
                                title={manager.name}
                                className="w-10 h-10 rounded-full"
                            />
                             <div>
                                <p className="font-semibold text-text-primary">{manager.name}</p>
                                <p className="text-sm text-text-secondary">{manager.position}</p>
                             </div>
                        </div>
                    </>
                ) : (
                     <div className="flex items-center gap-3 text-text-secondary">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                            <User size={20} className="text-gray-400" />
                        </div>
                        <p className="text-sm">Yönetici Atanmamış</p>
                     </div>
                )}
            </div>
        </div>
    );
};

interface OrgChartProps {
    resources: Resource[];
    departments: Department[];
    projects: Project[];
    onEditDepartment: (department: Department) => void;
    onDeleteDepartment: (departmentId: string) => void;
    canManage: boolean;
    onCardClick: (department: Department) => void;
}

export const OrgChart: React.FC<OrgChartProps> = ({ resources, departments, projects, onEditDepartment, onDeleteDepartment, canManage, onCardClick }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {departments.map(dept => (
                <DepartmentCard
                    key={dept.id}
                    department={dept}
                    resources={resources}
                    projects={projects}
                    onEditDepartment={onEditDepartment}
                    onDeleteDepartment={onDeleteDepartment}
                    canManage={canManage}
                    onClick={onCardClick}
                />
            ))}
        </div>
    );
};