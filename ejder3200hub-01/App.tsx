


import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { CalendarView } from './components/views/CalendarView';
import { ProjectsView } from './components/views/ProjectsView';
import { ResourcesView } from './components/views/ResourcesView';
import { ReportsView } from './components/views/ReportsView';
import { NotesView } from './components/views/NotesView';
import { Modal } from './components/Modal';
import { useProAjandaStore } from './hooks/useProAjandaStore';
import { View, EventType, Event, RsvpStatus, Idea, Resource, Task, Project, User, PurchaseRequest, Invoice, Role } from './types';
import { generateFormFields } from './utils/formUtils';
import { EventDetails } from './components/EventDetails';
import { IdeaDetails } from './components/IdeaDetails';
import { TaskForm } from './components/TaskForm';
import { ItemDetailView } from './components/views/ItemDetailView';
import { Login } from './components/Login';
import { X } from 'lucide-react';
import { TeamManagementModal } from './components/TeamManagementModal';
import { PurchaseRequestForm } from './components/PurchaseRequestForm';
import { InvoiceForm } from './components/InvoiceForm';
import { NewIdeaView } from './components/views/NewIdeaView';
import { DashboardView } from './components/views/DashboardView';
import { NewResourceView } from './components/views/NewResourceView';
import { HelpCenterView } from './components/views/HelpCenterView';
import { BackendView } from './components/views/BackendView';
import { useModalStore, ModalMode } from './hooks/useModalStore';

export type CalendarViewMode = 'day' | 'week' | 'month';

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>({ id: 'r2', username: 'Ahmet Kaya', role: Role.Admin, departmentId: 'd2' });
    const [activeView, setActiveView] = useState<View>(View.Dashboard);
    const [detailedItem, setDetailedItem] = useState<Project | Idea | null>(null);
    const [ideaToEdit, setIdeaToEdit] = useState<Idea | null>(null);
    const [isCreatingIdea, setIsCreatingIdea] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isManagingResource, setIsManagingResource] = useState(false);
    const [resourceToEdit, setResourceToEdit] = useState<Resource | null>(null);
    
    const modal = useModalStore();
    const store = useProAjandaStore();
    const [calendarViewMode, setCalendarViewMode] = useState<CalendarViewMode>('month');

    const handleLogin = (user: User) => {
        setCurrentUser(user);
    };

    /* if (!currentUser) {
        return <Login onLogin={handleLogin} />;
    } */

    const openCreateEventModal = useCallback((type: EventType, initialData?: Partial<Event>) => {
        setDetailedItem(null);
        setIdeaToEdit(null);
        setIsCreatingIdea(false);
        modal.openModal('create', type, undefined, initialData);
    }, [modal]);
    
    const openItemDetails = useCallback((item: Event | Idea | Project) => {
        if ('type' in item) { // It's an Event, open modal
            setDetailedItem(null);
            setIdeaToEdit(null);
            setIsCreatingIdea(false);
            modal.openModal('view', item.type, item);
        } else { // It's a Project or Idea, open detail page
            modal.closeModal();
            setIdeaToEdit(null);
            setIsCreatingIdea(false);
            setDetailedItem(item);
        }
    }, [modal]);

    const closeDetailView = useCallback(() => {
        setDetailedItem(null);
    }, []);
    
    const handleAddIdeaClick = useCallback(() => {
        setDetailedItem(null);
        setIdeaToEdit(null);
        setIsCreatingIdea(true);
    }, []);

    const handleEditIdeaClick = useCallback((ideaToEdit: Idea) => {
        setDetailedItem(null);
        setIsCreatingIdea(false);
        setIdeaToEdit(ideaToEdit);
    }, []);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).filter(
                (newFile: File) => !selectedFiles.some(existingFile => existingFile.name === newFile.name)
            );
            setSelectedFiles(prev => [...prev, ...newFiles]);
            if(e.target) e.target.value = '';
        }
    }, [selectedFiles]);

    const handleRemoveFile = useCallback((fileNameToRemove: string) => {
        setSelectedFiles(prev => prev.filter(file => file.name !== fileNameToRemove));
    }, []);
    
    const handleFormSubmit = useCallback((data: Omit<Event, 'id'>) => {
        if (modal.mode === 'edit' && modal.selectedItem && 'type' in modal.selectedItem) {
            store.updateEvent({ ...(modal.selectedItem as Event), ...data });
        } else {
            const newEvent: Event = { 
                ...data, 
                id: Date.now().toString(),
                ...(data.type === EventType.Meeting && {
                    // FIX: Changed data.participants to use string IDs, which can be used as keys. The Event type was also updated to reflect this change.
                    rsvp: data.participants?.reduce((acc, participantId) => {
                        acc[participantId] = RsvpStatus.Pending;
                        return acc;
                    }, {} as { [key: string]: RsvpStatus })
                })
             };
            store.addEvent(newEvent);
        }
        modal.closeModal();
    }, [modal, store]);
    
    const handleIdeaFormSubmit = useCallback((data: Omit<Idea, 'id' | 'status' | 'authorId'>, files: File[]) => {
        console.log("Submitting idea with files:", files.map(f => f.name));
        if (ideaToEdit) {
            store.updateIdea({ ...ideaToEdit, ...data });
        } else {
            store.addIdea(data);
        }
        setIdeaToEdit(null);
        setIsCreatingIdea(false);
    }, [ideaToEdit, store]);

    const handleResourceFormSubmit = useCallback((data: Partial<Omit<Resource, 'skills'>> & { skills: string }) => {
        if (resourceToEdit) {
            store.updateResource({ ...resourceToEdit, ...data } as Resource & { skills: string | string[] });
        } else {
            store.addResource(data as Omit<Resource, 'id' | 'initials' | 'currentLoad' | 'skills' | 'department'> & { skills: string });
        }
        setResourceToEdit(null);
        setIsManagingResource(false);
    }, [resourceToEdit, store]);
    
     const handleRsvpUpdate = useCallback((status: RsvpStatus) => {
        if (modal.selectedItem && 'type' in modal.selectedItem && currentUser) {
            store.updateRsvpStatus(modal.selectedItem.id, currentUser.id, status);
        }
    }, [modal.selectedItem, currentUser, store]);
    
    const handlePurchaseRequestSubmit = useCallback((data: Omit<PurchaseRequest, 'id' | 'status' | 'requesterId' | 'requestDate'>) => {
        store.addPurchaseRequest(data);
        modal.closeModal();
    }, [store, modal]);

    const handleInvoiceSubmit = useCallback((data: Omit<Invoice, 'id' | 'status'>) => {
        store.addInvoice(data);
        modal.closeModal();
    }, [store, modal]);
    
    const onCancelNewIdea = useCallback(() => {
        setIdeaToEdit(null);
        setIsCreatingIdea(false);
    }, []);

    const onCancelNewResource = useCallback(() => {
        setResourceToEdit(null);
        setIsManagingResource(false);
    }, []);

    const handleAddTaskToProject = useCallback((projectId: string) => {
        openCreateEventModal(EventType.Task, { projectId });
    }, [openCreateEventModal]);

    const handleAddNewResourceClick = useCallback(() => {
        setResourceToEdit(null);
        setIsManagingResource(true);
    }, []);
    
    const handleEditResourceClick = useCallback((resource: Resource) => {
        setResourceToEdit(resource);
        setIsManagingResource(true);
    }, []);

    const renderView = () => {
        if (isCreatingIdea || ideaToEdit) {
            return <NewIdeaView
                initialData={ideaToEdit}
                onSubmit={handleIdeaFormSubmit}
                onCancel={onCancelNewIdea}
                resources={store.resources}
            />
        }
        if (isManagingResource || resourceToEdit) {
            return <NewResourceView
                initialData={resourceToEdit}
                onSubmit={handleResourceFormSubmit}
                onCancel={onCancelNewResource}
                departments={store.departments}
                projects={store.projects}
                performanceEvaluations={store.performanceEvaluations}
                resources={store.resources}
            />
        }
        if (detailedItem) {
            return <ItemDetailView
                item={detailedItem}
                onClose={closeDetailView}
                resources={store.resources}
                tasks={store.tasks}
                currentUser={currentUser!}
                purchaseRequests={store.purchaseRequests}
                invoices={store.invoices}
                evaluations={store.evaluations}
                comments={store.comments}
                store={store}
                onManageTeam={modal.openTeamManagement}
                onAddPurchaseRequest={modal.openPurchaseRequest}
                onAddInvoice={modal.openInvoice}
                onEditIdea={handleEditIdeaClick}
                onAddTask={handleAddTaskToProject}
             />
        }
        switch (activeView) {
            case View.Dashboard:
                return <DashboardView currentUser={currentUser!} projects={store.projects} tasks={store.tasks} ideas={store.ideas} notifications={store.notifications} resources={store.resources} events={store.events} onAddEventClick={openCreateEventModal} onAddIdeaClick={handleAddIdeaClick} announcements={store.announcements} evaluations={store.evaluations} store={store} />;
            case View.Calendar:
                return <CalendarView events={store.events} openModal={openCreateEventModal} viewMode={calendarViewMode} setCalendarViewMode={setCalendarViewMode} updateEventDate={store.updateEventDate} onEventClick={openItemDetails} projects={store.projects} tasks={store.tasks} resources={store.resources} toggleTaskCompletion={store.toggleTaskCompletion} />;
            case View.Projects:
                return <ProjectsView projects={store.projects} tasks={store.tasks} resources={store.resources} updateTaskStatus={store.updateTaskStatus} ideas={store.ideas} updateIdeaStatus={store.updateIdeaStatus} onIdeaClick={openItemDetails} onProjectClick={openItemDetails} convertIdeaToProject={store.convertIdeaToProject} evaluations={store.evaluations} comments={store.comments} />;
            case View.Resources:
                return <ResourcesView resources={store.resources} departments={store.departments} onAddResource={handleAddNewResourceClick} onEditResource={handleEditResourceClick} onDeleteResource={store.deleteResource} currentUser={currentUser!} store={store} />;
            case View.Reports:
                return <ReportsView projects={store.projects} tasks={store.tasks} resources={store.resources} />;
            case View.Notes:
                 return <NotesView notes={store.events.filter(e => e.type === EventType.Note)} projects={store.projects} ideas={store.ideas} />;
            case View.Backend:
                return <BackendView systemMetrics={store.systemMetrics} apiLogs={store.apiLogs} databaseStats={store.databaseStats} />;
            case View.HelpCenter:
                return <HelpCenterView store={store} currentUser={currentUser!} />;
            default:
                return <DashboardView currentUser={currentUser!} projects={store.projects} tasks={store.tasks} ideas={store.ideas} notifications={store.notifications} resources={store.resources} events={store.events} onAddEventClick={openCreateEventModal} onAddIdeaClick={handleAddIdeaClick} announcements={store.announcements} evaluations={store.evaluations} store={store} />;
        }
    };
    
    const isViewingEvent = modal.mode === 'view' && modal.selectedItem && 'type' in modal.selectedItem;
    const isTaskForm = !isViewingEvent && modal.entityType === EventType.Task;
    
    const modalConfig = modal.entityType && modal.entityType !== EventType.Task ? generateFormFields(modal.entityType) : null;
    let currentItemForForm = modal.mode === 'edit' ? modal.selectedItem : (modal.mode === 'create' ? modal.initialData : null);
    if (isTaskForm) {
        currentItemForForm = { ...modal.initialData, ...currentItemForForm };
    }

    const getModalTitle = () => {
        if (modal.entityType === EventType.Task) {
             if (modal.mode === 'create') return `Yeni Görev Oluştur`;
             if (modal.mode === 'edit') return `Görevi Düzenle`;
        }
        if (!modalConfig) return '';
        if (modal.mode === 'create') return `Yeni ${modalConfig.title} Oluştur`;
        if (modal.mode === 'edit') return `${modalConfig.title} Düzenle`;
        return (modal.selectedItem as Event)?.title || (modal.selectedItem as Idea)?.name || 'Detaylar';
    };
    
    const isDetailViewActive = !!detailedItem || !!ideaToEdit || isCreatingIdea || isManagingResource || !!resourceToEdit;
    const mainPaddingClass = isDetailViewActive ? '' : 'p-4 md:p-6 lg:p-8';
    
    return (
        <div className="bg-main-bg text-text-primary min-h-screen flex flex-col">
             <Header
                activeView={activeView}
                setActiveView={setActiveView}
                onAddEventClick={openCreateEventModal}
                onAddIdeaClick={handleAddIdeaClick}
                notifications={store.notifications}
                markNotificationAsRead={store.markNotificationAsRead}
                markAllNotificationsAsRead={store.markAllNotificationsAsRead}
                currentUser={currentUser}
            />
            <main className={`flex-1 w-full max-w-screen-2xl mx-auto ${mainPaddingClass}`}>
                {renderView()}
            </main>
            {modal.isOpen && (
                <Modal 
                    isOpen={modal.isOpen} 
                    onClose={modal.closeModal} 
                    title={getModalTitle()}
                    color={modalConfig?.color}
                >
                   {isViewingEvent ? (
                         <EventDetails 
                            event={modal.selectedItem as Event} 
                            resources={store.resources}
                            projects={store.projects}
                            ideas={store.ideas}
                            currentUserId={currentUser!.id}
                            onEdit={() => modal.setModalMode('edit')}
                            onUpdateRsvp={handleRsvpUpdate}
                        />
                    ) : isTaskForm ? (
                        <TaskForm
                            onSubmit={handleFormSubmit}
                            onCancel={modal.closeModal}
                            initialData={currentItemForForm as Partial<Event>}
                            resources={store.resources}
                            projects={store.projects}
                            tasks={store.tasks.filter(t => t.id !== (modal.selectedItem as Event)?.id)}
                        />
                    ) : modalConfig ? (
                        <form id="modal-form" className="flex flex-col flex-1 min-h-0" onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target as HTMLFormElement);
                            const data: { [key: string]: any } = {};
                            formData.forEach((value, key) => {
                                if (key === 'participants' || key === 'files') {
                                    if (!data[key]) data[key] = [];
                                    data[key].push(value);
                                } else {
                                    data[key] = value;
                                }
                            });
                            
                            const files = selectedFiles.map(f => f.name);
                            const tags = data.tags ? (data.tags as string).split(',').map(t => t.trim()) : undefined;

                            const link = data.link as string;
                            let projectId: string | undefined;
                            let ideaId: string | undefined;

                            if (link?.startsWith('project-')) {
                                projectId = link.substring(8);
                            } else if (link?.startsWith('idea-')) {
                                ideaId = link.substring(5);
                            }
                            
                            // FIX: Explicitly added `title` to the object to satisfy the `Omit<Event, 'id'>` type, resolving a TypeScript error.
                            const newEventData = {
                                ...data,
                                title: data.title as string,
                                type: modal.entityType,
                                date: data.date,
                                tags,
                                projectId,
                                ideaId,
                                files,
                                participants: data.participants as string[] | undefined,
                                assigneeId: data.assignee as string | undefined,
                            } as Omit<Event, 'id'>;
                            handleFormSubmit(newEventData);
                        }}>
                             <div className="flex-1 overflow-y-auto p-6">
                                 {modalConfig.fields.map((field, index, allFields) => {
                                    if (field.id === 'endTime' && allFields.some(f => f.id === 'startTime')) {
                                        return null; // Was rendered with startTime
                                    }

                                    const commonProps = {
                                        id: field.id,
                                        name: field.id,
                                        required: field.required !== false,
                                        className: `w-full px-3 py-2 border border-border-color rounded-md shadow-sm bg-card-bg focus:ring-project focus:border-project transition`,
                                        placeholder: field.placeholder,
                                    };
                                    
                                    const defaultValue = currentItemForForm ? (currentItemForForm as any)[field.id] : '';

                                    if (field.id === 'startTime') {
                                        const endTimeField = allFields.find(f => f.id === 'endTime');
                                        if (endTimeField) {
                                            const endDefaultValue = currentItemForForm ? (currentItemForForm as any)[endTimeField.id] : '';
                                            return (
                                                <div key="time-group" className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                                    <div>
                                                        <label htmlFor={field.id} className="block text-sm font-medium text-text-secondary mb-1">{field.label}</label>
                                                        <input {...commonProps} type={field.type} defaultValue={defaultValue} />
                                                    </div>
                                                    <div>
                                                        <label htmlFor={endTimeField.id} className="block text-sm font-medium text-text-secondary mb-1">{endTimeField.label}</label>
                                                        <input id={endTimeField.id} name={endTimeField.id} type={endTimeField.type} defaultValue={endDefaultValue} required={endTimeField.required !== false} className={commonProps.className} />
                                                    </div>
                                                </div>
                                            );
                                        }
                                    }

                                    const renderField = () => {
                                        switch(field.component) {
                                            case 'textarea':
                                                return <textarea {...commonProps} rows={4} defaultValue={defaultValue}></textarea>;
                                            case 'select':
                                                if (field.id === 'link') {
                                                    const defaultLinkValue = (modal.selectedItem as Event)?.projectId ? `project-${(modal.selectedItem as Event).projectId}` : (modal.selectedItem as Event)?.ideaId ? `idea-${(modal.selectedItem as Event).ideaId}` : '';
                                                    return (
                                                        <select {...commonProps} defaultValue={defaultLinkValue}>
                                                            <option value="">İlişkilendirme Yok</option>
                                                            <optgroup label="Projeler">
                                                                {store.projects.map(p => <option key={`project-${p.id}`} value={`project-${p.id}`}>{p.name}</option>)}
                                                            </optgroup>
                                                            <optgroup label="Fikirler">
                                                                {store.ideas.map(i => <option key={`idea-${i.id}`} value={`idea-${i.id}`}>{i.name}</option>)}
                                                            </optgroup>
                                                        </select>
                                                    );
                                                }
                                                if (field.id === 'assignee') {
                                                    return (
                                                        <select {...commonProps} defaultValue={defaultValue}>
                                                             <option value="">Atama Yok</option>
                                                             {store.resources.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                                        </select>
                                                    )
                                                }
                                                if (field.id === 'participants') {
                                                    return (
                                                        <select {...commonProps} multiple={field.multiple} defaultValue={defaultValue || []} className="h-40">
                                                            {store.resources.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                                        </select>
                                                    );
                                                }
                                                return (
                                                    <select {...commonProps} defaultValue={defaultValue}>
                                                        {field.options?.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                                                    </select>
                                                );
                                            case 'input':
                                            default:
                                                if (field.type === 'file') {
                                                    return (
                                                        <div>
                                                            {selectedFiles.length > 0 && (
                                                                <ul className="space-y-2 mb-2 max-h-28 overflow-y-auto border border-border-color p-2 rounded-md">
                                                                    {selectedFiles.map(file => (
                                                                        <li key={file.name} className="flex items-center justify-between bg-main-bg p-2 rounded-md text-sm">
                                                                            <span className="truncate pr-2">{file.name}</span>
                                                                            <button type="button" onClick={() => handleRemoveFile(file.name)} className="text-red-500 hover:text-red-700 flex-shrink-0">
                                                                                <X size={16} />
                                                                            </button>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                            <label htmlFor={field.id} className="relative cursor-pointer w-full flex justify-center items-center px-4 py-2 border border-border-color rounded-md shadow-sm text-sm font-medium text-text-secondary bg-card-bg hover:bg-main-bg">
                                                                <span>Dosya Ekle...</span>
                                                                <input id={field.id} name={field.id} type="file" className="sr-only" multiple={field.multiple} onChange={handleFileChange} />
                                                            </label>
                                                        </div>
                                                    );
                                                }
                                                let val = (field.type === 'file' || !defaultValue) ? undefined : defaultValue;
                                                if (field.type === 'date' && !val) {
                                                    val = new Date().toISOString().split('T')[0];
                                                }
                                                return <input type={field.type} {...commonProps} multiple={field.multiple} defaultValue={Array.isArray(val) ? val.join(', ') : val} />;
                                        }
                                    };

                                    return (
                                        <div key={field.id} className="mb-4">
                                            <label htmlFor={field.id} className="block text-sm font-medium text-text-secondary mb-1">{field.label}</label>
                                            {renderField()}
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex-shrink-0 flex justify-end gap-3 p-4 border-t border-border-color bg-main-bg">
                                <button type="button" onClick={modal.closeModal} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition">İptal</button>
                                <button type="submit" className={`px-4 py-2 text-white rounded-md transition`} style={{ backgroundColor: modalConfig.color }}>
                                    {modal.mode === 'edit' ? 'Güncelle' : 'Oluştur'}
                                </button>
                            </div>
                        </form>
                    ) : null}
                </Modal>
            )}
            {modal.isTeamModalOpen && modal.projectForTeamManagement && (
                <Modal isOpen={modal.isTeamModalOpen} onClose={modal.closeModal} title={`"${modal.projectForTeamManagement.name}" Ekibini Yönet`}>
                    <TeamManagementModal 
                        project={modal.projectForTeamManagement}
                        resources={store.resources}
                        onSave={store.updateProjectTeam}
                        onClose={modal.closeModal}
                    />
                </Modal>
            )}
            {modal.isPurchaseRequestModalOpen && detailedItem && 'code' in detailedItem && (
                <Modal isOpen={modal.isPurchaseRequestModalOpen} onClose={modal.closeModal} title="Yeni Satın Alma Talebi Oluştur">
                    <PurchaseRequestForm
                        projectId={(detailedItem as Project).id}
                        onSubmit={handlePurchaseRequestSubmit}
                        onCancel={modal.closeModal}
                    />
                </Modal>
            )}
            {modal.isInvoiceModalOpen && detailedItem && 'code' in detailedItem && (
                <Modal isOpen={modal.isInvoiceModalOpen} onClose={modal.closeModal} title="Yeni Fatura Ekle">
                    <InvoiceForm
                        projectId={(detailedItem as Project).id}
                        onSubmit={handleInvoiceSubmit}
                        onCancel={modal.closeModal}
                    />
                </Modal>
            )}
        </div>
    );
};

export default App;