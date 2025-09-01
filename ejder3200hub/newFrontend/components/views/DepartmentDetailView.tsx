
import React from 'react';
import { Department, Resource, Project, Task, ProjectStatus } from '../../types';
import { ArrowLeft, Users, Briefcase, Clock, TrendingUp, User, Mail, Phone } from 'lucide-react';

interface DepartmentDetailViewProps {
    department: Department;
    onClose: () => void;
    resources: Resource[];
    projects: Project[];
    tasks: Task[];
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

const Section: React.FC<{ title: string; children: React.ReactNode; icon: React.ElementType }> = ({ title, children, icon: Icon }) => (
    <div className="bg-white p-5 rounded-lg shadow-sm border">
        <div className="flex items-center gap-3 mb-4">
            <Icon className="w-6 h-6 text-text-secondary" />
            <h3 className="text-lg font-bold text-text-primary">{title}</h3>
        </div>
        <div className="space-y-4">{children}</div>
    </div>
);

const MemberCard: React.FC<{ member: Resource }> = ({ member }) => {
    const utilization = member.weeklyHours > 0 ? Math.round((member.currentLoad / member.weeklyHours) * 100) : 0;
    const utilizationColor = utilization > 100 ? 'bg-red-500' : utilization > 80 ? 'bg-green-500' : 'bg-blue-500';

    return (
        <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-4 border border-transparent hover:border-gray-200">
            <img src={`https://picsum.photos/seed/${member.id}/48/48`} alt={member.name} className="w-12 h-12 rounded-full" />
            <div className="flex-1">
                <p className="font-semibold text-text-primary">{member.name}</p>
                <p className="text-sm text-text-secondary">{member.position}</p>
            </div>
            <div className="text-right">
                <p className="text-sm font-bold">{utilization}%</p>
                <div className="w-16 bg-gray-200 rounded-full h-1.5 mt-1">
                    <div className={`h-1.5 rounded-full ${utilizationColor}`} style={{ width: `${Math.min(utilization, 100)}%`}}></div>
                </div>
            </div>
        </div>
    );
};

const ProjectListItem: React.FC<{ project: Project }> = ({ project }) => {
     return (
        <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-between border-l-4" style={{borderColor: project.color}}>
             <div>
                <p className="font-semibold text-text-primary">{project.name}</p>
                <p className="text-sm text-text-secondary">{project.status}</p>
            </div>
            <div className="text-right">
                <p className="text-sm font-bold">{project.progress}%</p>
                <div className="w-20 bg-gray-200 rounded-full h-1.5 mt-1">
                    <div className="h-1.5 rounded-full" style={{ width: `${project.progress}%`, backgroundColor: project.color }}></div>
                </div>
            </div>
        </div>
     );
};


export const DepartmentDetailView: React.FC<DepartmentDetailViewProps> = ({ department, onClose, resources, projects }) => {
    
    const departmentMembers = React.useMemo(() => resources.filter(r => r.departmentId === department.id), [resources, department.id]);
    const manager = React.useMemo(() => resources.find(r => r.id === department.managerId), [resources, department.managerId]);
    const departmentProjects = React.useMemo(() => projects.filter(p => p.team.some(memberId => departmentMembers.some(m => m.id === memberId)) && p.status === ProjectStatus.Active), [projects, departmentMembers]);
    
    const totalCapacity = React.useMemo(() => departmentMembers.reduce((sum, r) => sum + r.weeklyHours, 0), [departmentMembers]);
    const totalLoad = React.useMemo(() => departmentMembers.reduce((sum, r) => sum + r.currentLoad, 0), [departmentMembers]);
    const utilization = totalCapacity > 0 ? Math.round((totalLoad / totalCapacity) * 100) : 0;

    return (
        <div className="animate-fadeIn">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={onClose} className="flex items-center gap-2 text-text-secondary hover:text-text-primary font-medium">
                    <ArrowLeft size={20} />
                    Geri Dön
                </button>
            </div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">{department.name}</h1>
            <p className="text-text-secondary mb-6">Departman genel bakışı, ekip üyeleri ve projeler.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <KpiCard title="Personel Sayısı" value={departmentMembers.length} icon={Users} color="#7C3AED" />
                <KpiCard title="Aktif Projeler" value={departmentProjects.length} icon={Briefcase} color="#3B82F6" />
                <KpiCard title="Haftalık Kapasite" value={`${totalCapacity} sa`} icon={Clock} color="#F59E0B" />
                <KpiCard title="Kullanım Oranı" value={`${utilization}%`} icon={TrendingUp} color="#22C55E" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-2 space-y-6">
                    <Section title="Aktif Projeler" icon={Briefcase}>
                        {departmentProjects.length > 0 ? (
                            departmentProjects.map(p => <ProjectListItem key={p.id} project={p} />)
                        ) : (
                            <p className="text-text-secondary text-center py-4">Bu departmanın dahil olduğu aktif proje bulunmuyor.</p>
                        )}
                    </Section>
                    
                    <Section title="Ekip Üyeleri" icon={Users}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {departmentMembers.map(m => <MemberCard key={m.id} member={m} />)}
                        </div>
                    </Section>
                </div>

                <div className="lg:col-span-1 lg:sticky top-24">
                     <Section title="Departman Yöneticisi" icon={User}>
                       {manager ? (
                            <div className="text-center">
                                <img src={`https://picsum.photos/seed/${manager.id}/96/96`} alt={manager.name} className="w-24 h-24 rounded-full mx-auto mb-4" />
                                <h4 className="font-bold text-lg text-text-primary">{manager.name}</h4>
                                <p className="text-project font-semibold">{manager.position}</p>
                                <div className="text-left space-y-3 mt-4 pt-4 border-t">
                                     <p className="flex items-center gap-2 text-sm text-text-secondary"><Mail size={14}/> {manager.email}</p>
                                     <p className="flex items-center gap-2 text-sm text-text-secondary"><Phone size={14}/> {manager.phone}</p>
                                </div>
                            </div>
                       ) : <p className="text-text-secondary text-center py-4">Yönetici atanmamış.</p>}
                    </Section>
                </div>
            </div>
        </div>
    );
};
