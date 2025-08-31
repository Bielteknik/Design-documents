import { EventType, Priority } from '../types';

interface FormField {
    id: string;
    label: string;
    type: string;
    placeholder: string;
    component?: 'input' | 'textarea' | 'select';
    options?: { value: string; label: string }[];
    required?: boolean;
    multiple?: boolean;
}

interface ModalConfig {
    title: string;
    color: string;
    focusColor: string;
    fields: FormField[];
}

export const generateFormFields = (type: EventType): ModalConfig => {
    const baseFields: FormField[] = [
        { id: 'title', label: 'Başlık', type: 'text', placeholder: 'Etkinlik başlığını girin', component: 'input' },
        { id: 'date', label: 'Tarih', type: 'date', placeholder: '', component: 'input' },
    ];

    const sharedFields: FormField[] = [
        { 
            id: 'link', 
            label: 'Proje / Fikir ile İlişkilendir', 
            type: 'select', 
            placeholder: '', 
            component: 'select', 
            required: false,
        },
        { 
            id: 'files', 
            label: 'Dosya Ekle', 
            type: 'file', 
            placeholder: '', 
            component: 'input', 
            required: false,
            multiple: true,
        },
    ];
    
    const reminderField: FormField = { 
        id: 'reminder', 
        label: 'Hatırlatma', 
        type: 'select', 
        placeholder: '', 
        component: 'select',
        options: [
            { value: 'none', label: 'Hatırlatma Yok' },
            { value: 'on_time', label: 'Etkinlik zamanında' },
            { value: '5m_before', label: '5 dakika önce' },
            { value: '15m_before', label: '15 dakika önce' },
            { value: '30m_before', label: '30 dakika önce' },
            { value: '1h_before', label: '1 saat önce' },
            { value: '1d_before', label: '1 gün önce' },
        ]
    };

    const priorityField: FormField = { 
        id: 'priority', 
        label: 'Öncelik', 
        type: 'select', 
        placeholder: '', 
        component: 'select',
        required: false,
        options: [
            { value: '', label: 'Öncelik Yok' },
            { value: Priority.Low, label: 'Düşük' },
            { value: Priority.Medium, label: 'Orta' },
            { value: Priority.High, label: 'Yüksek' },
        ]
    };

    const assigneeField: FormField = {
        id: 'assignee',
        label: 'Atanan',
        type: 'select',
        placeholder: 'Birini ata',
        component: 'select',
        required: true,
    }


    switch (type) {
        case EventType.Appointment:
            return {
                title: 'Randevu',
                color: '#3B82F6',
                focusColor: 'blue',
                fields: [
                    ...baseFields,
                    { id: 'location', label: 'Konum', type: 'text', placeholder: 'Randevu konumu', component: 'input' },
                    { id: 'startTime', label: 'Başlangıç Saati', type: 'time', placeholder: '', component: 'input' },
                    ...sharedFields,
                    reminderField,
                    priorityField,
                ],
            };
        case EventType.Task:
            return {
                title: 'Görev',
                color: '#10B981',
                focusColor: 'green',
                fields: [
                    ...baseFields,
                    { id: 'description', label: 'Açıklama', type: 'text', placeholder: 'Görevin açıklaması', component: 'textarea', required: false },
                    assigneeField,
                    ...sharedFields,
                    priorityField,
                    reminderField,
                ],
            };
        case EventType.Meeting:
            return {
                title: 'Toplantı',
                color: '#8B5CF6',
                focusColor: 'purple',
                fields: [
                    ...baseFields,
                    { id: 'startTime', label: 'Başlangıç Saati', type: 'time', placeholder: '', component: 'input' },
                    { id: 'endTime', label: 'Bitiş Saati', type: 'time', placeholder: '', component: 'input' },
                    { 
                        id: 'participants', 
                        label: 'Katılımcılar', 
                        type: 'select', 
                        placeholder: 'Katılımcıları seçin', 
                        component: 'select',
                        multiple: true,
                        required: false,
                    },
                    ...sharedFields,
                    reminderField,
                ],
            };
        case EventType.Event:
            return {
                title: 'Etkinlik',
                color: '#F59E0B',
                focusColor: 'yellow',
                fields: [
                    ...baseFields,
                    { id: 'location', label: 'Konum', type: 'text', placeholder: 'Etkinlik konumu', component: 'input' },
                    { id: 'startTime', label: 'Başlangıç Saati', type: 'time', placeholder: '', component: 'input' },
                    { id: 'endTime', label: 'Bitiş Saati', type: 'time', placeholder: '', component: 'input' },
                    { id: 'description', label: 'Açıklama', type: 'text', placeholder: 'Etkinlik hakkında detaylar', component: 'textarea', required: false },
                    ...sharedFields,
                    reminderField,
                ],
            };
        case EventType.Note:
            return {
                title: 'Not',
                color: '#6B7280',
                focusColor: 'gray',
                fields: [
                     { id: 'title', label: 'Başlık', type: 'text', placeholder: 'Not başlığını girin', component: 'input' },
                     { id: 'content', label: 'İçerik', type: 'text', placeholder: 'Notunuzu buraya yazın...', component: 'textarea' },
                     { id: 'tags', label: 'Etiketler (virgülle ayırın)', type: 'text', placeholder: 'iş, kişisel, önemli', component: 'input', required: false },
                     ...sharedFields,
                     priorityField,
                     reminderField,
                ],
            };
        default:
            throw new Error('Unknown event type');
    }
};