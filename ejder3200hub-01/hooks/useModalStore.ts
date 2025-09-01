import { useState, useCallback } from 'react';
import { EventType, Event, Idea, Project, Resource } from '../types';

export type ModalMode = 'create' | 'view' | 'edit';

interface ModalState {
    isOpen: boolean;
    mode: ModalMode;
    entityType: EventType | null;
    selectedItem: Event | Idea | Project | null;
    initialData: Partial<Event> | null;
}

export const useModalStore = () => {
    const [modalState, setModalState] = useState<ModalState>({
        isOpen: false,
        mode: 'create',
        entityType: null,
        selectedItem: null,
        initialData: null,
    });
    
    const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
    const [isPurchaseRequestModalOpen, setIsPurchaseRequestModalOpen] = useState(false);
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
    const [projectForTeamManagement, setProjectForTeamManagement] = useState<Project | null>(null);

    const openModal = useCallback((mode: ModalMode, entityType: EventType, item?: Event | Idea | Project, initialData?: Partial<Event>) => {
        setModalState({
            isOpen: true,
            mode,
            entityType,
            selectedItem: item || null,
            initialData: initialData || null,
        });
    }, []);

    const closeModal = useCallback(() => {
        setModalState(prev => ({ ...prev, isOpen: false }));
        setIsTeamModalOpen(false);
        setIsPurchaseRequestModalOpen(false);
        setIsInvoiceModalOpen(false);
    }, []);
    
    const openTeamManagement = useCallback((project: Project) => {
        setProjectForTeamManagement(project);
        setIsTeamModalOpen(true);
    }, []);
    
    const openPurchaseRequest = useCallback(() => setIsPurchaseRequestModalOpen(true), []);
    const openInvoice = useCallback(() => setIsInvoiceModalOpen(true), []);

    const setModalMode = (mode: ModalMode) => {
        setModalState(prev => ({...prev, mode}));
    }

    return {
        ...modalState,
        isTeamModalOpen,
        isPurchaseRequestModalOpen,
        isInvoiceModalOpen,
        projectForTeamManagement,
        openModal,
        closeModal,
        setModalMode,
        openTeamManagement,
        openPurchaseRequest,
        openInvoice
    };
};
